import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';
import sharp from 'sharp';
import { IDIOMAS_PUBLICADOS, type Idioma } from '../../i18n/idiomas';
import { proyectos, type Proyecto } from '../../data';
import { textos } from '../../i18n/ui';
import { SITIO } from '../../config/sitio';

/* ------------------------------------------------------------------ *
 *  EL PORTFOLIO EN PDF
 *
 *  Un solo documento con portada, introducción, índice y los seis
 *  proyectos seguidos: es lo que Beñat manda a un estudio. Se genera al
 *  compilar, uno por idioma, con el mismo contenido y las mismas láminas
 *  que la web, así que no puede quedarse desfasado.
 *
 *  Resultado: /portfolio/es.pdf, /portfolio/en.pdf, /eu.pdf, /ca.pdf
 * ------------------------------------------------------------------ */

export function getStaticPaths() {
  return IDIOMAS_PUBLICADOS.map((idioma) => ({ params: { idioma } }));
}

/* A4 apaisado, el mismo formato que los cuadernos de la web. */
const A4 = { ancho: 841.89, alto: 595.28 };
const MARGEN = 42;
const ANCHO = A4.ancho - MARGEN * 2;
const ALTO = A4.alto - MARGEN * 2;

const TINTA = '#14161a';
const GRIS = '#6a6c71';
const TRAZO = '#a8482f';
const LINEA = '#cbc8c2';

type Doc = InstanceType<typeof PDFDocument>;

/* ------------------------------------------------------------------ *
 *  Las imágenes
 *
 *  pdfkit no sabe leer WebP, que es como están guardadas las láminas, así
 *  que hay que pasarlas a JPEG. Se hace una vez y se guarda en memoria:
 *  las mismas láminas se usan en los cuatro idiomas y convertirlas cuatro
 *  veces multiplicaría por cuatro el tiempo de compilación.
 * ------------------------------------------------------------------ */
const cache = new Map<string, { datos: Buffer; ancho: number; alto: number }>();

async function lamina(archivo: string) {
  const guardada = cache.get(archivo);
  if (guardada) return guardada;

  /* La ruta se calcula desde la raíz del proyecto y no con import.meta.url:
   * al compilar, este módulo acaba empaquetado dentro de dist/ y desde ahí
   * las rutas relativas ya no apuntan a src/. */
  const original = readFileSync(join(process.cwd(), 'src/assets/img', archivo));
  const datos = await sharp(original)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  const { width = 1, height = 1 } = await sharp(datos).metadata();

  const convertida = { datos, ancho: width, alto: height };
  cache.set(archivo, convertida);
  return convertida;
}

/* ------------------------------------------------------------------ *
 *  Piezas de página
 * ------------------------------------------------------------------ */

/** Rótulo en versales, como los de la web. */
function rotulo(doc: Doc, texto: string, x: number, y: number, color = GRIS) {
  doc.font('Helvetica').fontSize(7.5).fillColor(color).text(texto.toUpperCase(), x, y, {
    characterSpacing: 1.6,
    lineBreak: false,
  });
}

/** El número de página, en la esquina de fuera. */
function folio(doc: Doc, numero: number) {
  /* El folio va por debajo del margen inferior, en el blanco de la hoja.
   * pdfkit entiende que escribir fuera de la caja de texto es que la página
   * se ha llenado y abre otra en blanco detrás; dejarle el margen en cero
   * mientras se dibuja el número lo evita. */
  const inferior = doc.page.margins.bottom;
  doc.page.margins.bottom = 0;
  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(GRIS)
    .text(String(numero), MARGEN, A4.alto - MARGEN + 8, {
      width: ANCHO,
      align: 'right',
      lineBreak: false,
      characterSpacing: 1.2,
    });
  doc.page.margins.bottom = inferior;
}

/** Una lámina a toda página, con su cajetín debajo. */
async function paginaLamina(
  doc: Doc,
  pagina: { archivo: string; titulo?: string; escala?: string; orientacion?: string },
  numero: number,
) {
  doc.addPage();

  const cajetin = 26;
  const im = await lamina(pagina.archivo);
  const disponibleAlto = ALTO - cajetin;
  const escala = Math.min(ANCHO / im.ancho, disponibleAlto / im.alto);
  const ancho = im.ancho * escala;
  const alto = im.alto * escala;

  doc.image(im.datos, MARGEN + (ANCHO - ancho) / 2, MARGEN + (disponibleAlto - alto) / 2, {
    width: ancho,
    height: alto,
  });

  const yCajetin = A4.alto - MARGEN - cajetin + 10;
  if (pagina.titulo || pagina.escala) {
    doc
      .moveTo(MARGEN, yCajetin)
      .lineTo(A4.ancho - MARGEN, yCajetin)
      .lineWidth(0.6)
      .strokeColor(LINEA)
      .stroke();
    if (pagina.titulo) rotulo(doc, pagina.titulo, MARGEN, yCajetin + 7, TINTA);
    const derecha = [pagina.escala, pagina.orientacion].filter(Boolean).join(' · ');
    if (derecha) {
      doc.font('Helvetica').fontSize(7.5).fillColor(GRIS).text(derecha, MARGEN, yCajetin + 7, {
        width: ANCHO,
        align: 'right',
        lineBreak: false,
      });
    }
  }

  folio(doc, numero);
}

/** La hoja que abre cada proyecto: título, datos y texto. */
function paginaProyecto(doc: Doc, p: Proyecto, indice: number, numero: number, t: any) {
  doc.addPage();

  rotulo(doc, `${t.portfolio.proyecto} ${String(indice).padStart(2, '0')}`, MARGEN, MARGEN, TRAZO);

  doc
    .font('Helvetica-Bold')
    .fontSize(26)
    .fillColor(TINTA)
    .text(p.titulo, MARGEN, MARGEN + 26, { width: ANCHO * 0.62 });

  if (p.subtitulo) {
    doc
      .font('Helvetica')
      .fontSize(10.5)
      .fillColor(GRIS)
      .text(p.subtitulo, MARGEN, doc.y + 4, { width: ANCHO * 0.62 });
  }

  /* El texto, en columna estrecha y justificado, como en la web. */
  const yTexto = Math.max(doc.y + 22, MARGEN + 120);
  doc.font('Helvetica').fontSize(9.5).fillColor(TINTA);
  doc.text(p.texto.join('\n\n'), MARGEN, yTexto, {
    width: ANCHO * 0.56,
    align: 'justify',
    lineGap: 2.5,
    paragraphGap: 7,
  });

  /* Los datos del proyecto, pegados al margen derecho.
   *
   * Aquí no vale el rótulo de arriba: no lleva ancho y no parte la línea, así
   * que los textos largos —«Astigarreta, Goierri (Gipuzkoa)»— se salían por el
   * margen y, al no ocupar una línea completa, la siguiente se escribía encima.
   * Cada línea se dibuja dentro de su columna y el alto lo da pdfkit. */
  const anchoFicha = ANCHO * 0.3;
  const xFicha = A4.ancho - MARGEN - anchoFicha;
  let yFicha = MARGEN + 120;

  const lineaFicha = (texto: string, color: string, hueco: number) => {
    const letras = texto.toUpperCase();
    const caja = {
      width: anchoFicha,
      align: 'right' as const,
      characterSpacing: 1.6,
      lineGap: 2,
    };
    doc.font('Helvetica').fontSize(7.5).fillColor(color).text(letras, xFicha, yFicha, caja);
    yFicha += doc.heightOfString(letras, caja) + hueco;
  };

  const datos = [p.lugar, p.tipo, p.contexto, p.anio].filter(Boolean) as string[];
  for (const dato of datos) lineaFicha(dato, TINTA, 5);

  if (p.herramientas.length > 0) {
    yFicha += 6;
    doc
      .moveTo(xFicha, yFicha)
      .lineTo(A4.ancho - MARGEN, yFicha)
      .lineWidth(0.4)
      .strokeColor(LINEA)
      .stroke();
    yFicha += 10;
    for (const herramienta of p.herramientas) lineaFicha(herramienta, GRIS, 3);
  }

  folio(doc, numero);
}

/* ------------------------------------------------------------------ *
 *  El documento
 * ------------------------------------------------------------------ */

async function construir(idioma: Idioma): Promise<Buffer> {
  const t = textos(idioma);
  const lista = proyectos(idioma);

  /* El índice necesita saber en qué página empieza cada proyecto, así que
   * las cuentas se hacen antes de dibujar nada. Portada, introducción e
   * índice ocupan las tres primeras. */
  let pagina = 3;
  const comienzos = lista.map((p) => {
    const inicio = pagina + 1;
    pagina += 1 + p.paginas.filter((x) => x.tipo === 'lamina').length;
    return inicio;
  });

  const doc = new PDFDocument({
    size: [A4.ancho, A4.alto],
    margins: { top: MARGEN, bottom: MARGEN, left: MARGEN, right: MARGEN },
    info: {
      Title: `${SITIO.nombreCompleto} — ${t.portfolio.titulo}`,
      Author: SITIO.nombreCompleto,
      Subject: t.meta.inicio.titulo,
      Creator: SITIO.nombreCompleto,
    },
    autoFirstPage: true,
  });

  const trozos: Buffer[] = [];
  const terminado = new Promise<Buffer>((resolver) => {
    doc.on('data', (c: Buffer) => trozos.push(c));
    doc.on('end', () => resolver(Buffer.concat(trozos)));
  });

  /* --- 1. Portada --- */
  rotulo(doc, t.portfolio.titulo, MARGEN, MARGEN, TRAZO);
  doc
    .font('Helvetica-Bold')
    .fontSize(46)
    .fillColor(TINTA)
    .text(SITIO.nombreCompleto, MARGEN, A4.alto / 2 - 60, { width: ANCHO * 0.8 });
  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor(GRIS)
    .text(t.meta.inicio.titulo, MARGEN, doc.y + 6, { width: ANCHO * 0.8 });

  const yRegla = A4.alto - MARGEN - 34;
  doc
    .moveTo(MARGEN, yRegla)
    .lineTo(A4.ancho - MARGEN, yRegla)
    .lineWidth(0.8)
    .strokeColor(TINTA)
    .stroke();
  rotulo(doc, SITIO.correo, MARGEN, yRegla + 10, TINTA);
  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(GRIS)
    .text(SITIO.ubicacion, MARGEN, yRegla + 10, {
      width: ANCHO,
      align: 'right',
      lineBreak: false,
      characterSpacing: 1.6,
    });

  /* --- 2. Introducción --- */
  doc.addPage();
  rotulo(doc, t.portfolio.introduccion, MARGEN, MARGEN, TRAZO);
  doc
    .moveTo(MARGEN, MARGEN + 16)
    .lineTo(A4.ancho - MARGEN, MARGEN + 16)
    .lineWidth(0.6)
    .strokeColor(TINTA)
    .stroke();
  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor(TINTA)
    .text(t.inicio.entradilla, MARGEN, MARGEN + 46, {
      width: ANCHO * 0.62,
      align: 'justify',
      lineGap: 4,
    });
  folio(doc, 2);

  /* --- 3. Índice --- */
  doc.addPage();
  rotulo(doc, t.portfolio.contenido, MARGEN, MARGEN, TRAZO);
  doc
    .moveTo(MARGEN, MARGEN + 16)
    .lineTo(A4.ancho - MARGEN, MARGEN + 16)
    .lineWidth(0.6)
    .strokeColor(TINTA)
    .stroke();

  let yIndice = MARGEN + 44;
  for (const [i, p] of lista.entries()) {
    rotulo(doc, String(i + 1).padStart(2, '0'), MARGEN, yIndice + 3, TRAZO);
    doc
      .font('Helvetica-Bold')
      .fontSize(12)
      .fillColor(TINTA)
      .text(p.titulo, MARGEN + 34, yIndice, { width: ANCHO - 90, lineBreak: false });
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(GRIS)
      .text(String(comienzos[i]), MARGEN, yIndice + 2, {
        width: ANCHO,
        align: 'right',
        lineBreak: false,
      });
    if (p.lugar) {
      doc
        .font('Helvetica')
        .fontSize(8.5)
        .fillColor(GRIS)
        .text(p.lugar, MARGEN + 34, yIndice + 15, { width: ANCHO - 90, lineBreak: false });
    }
    yIndice += 36;
    doc
      .moveTo(MARGEN, yIndice - 8)
      .lineTo(A4.ancho - MARGEN, yIndice - 8)
      .lineWidth(0.4)
      .strokeColor(LINEA)
      .stroke();
  }
  folio(doc, 3);

  /* --- 4. Los proyectos --- */
  let n = 3;
  for (const [i, p] of lista.entries()) {
    n += 1;
    paginaProyecto(doc, p, i + 1, n, t);
    for (const hoja of p.paginas) {
      if (hoja.tipo !== 'lamina') continue;
      n += 1;
      await paginaLamina(doc, hoja, n);
    }
  }

  doc.end();
  return terminado;
}

export const GET: APIRoute = async ({ params }) => {
  const idioma = params.idioma as Idioma;
  const pdf = await construir(idioma);

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Benat-Errazkin-Portfolio-${idioma}.pdf"`,
    },
  });
};
