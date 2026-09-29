import type { APIRoute } from 'astro';
import PDFDocument from 'pdfkit';
import { IDIOMAS_PUBLICADOS, type Idioma } from '../../i18n/idiomas';
import { curriculum, type DatosCV } from '../../data';
import { SITIO } from '../../config/sitio';

/* ------------------------------------------------------------------ *
 *  EL CURRÍCULUM EN PDF
 *
 *  Se genera al compilar la web, uno por idioma, a partir exactamente
 *  del mismo contenido que se ve en pantalla (src/data/cv/<idioma>.json
 *  y los datos de contacto de src/config/sitio.ts). Por eso no puede
 *  contradecir a la web: no hay ningún PDF guardado a mano.
 *
 *  Resultado: /cv/es.pdf, /cv/en.pdf, /cv/eu.pdf, /cv/ca.pdf
 * ------------------------------------------------------------------ */

export function getStaticPaths() {
  return IDIOMAS_PUBLICADOS.map((idioma) => ({ params: { idioma } }));
}

const A4 = { ancho: 595.28, alto: 841.89 };
const MARGEN = 46;
const ANCHO = A4.ancho - MARGEN * 2;

/* Los mismos colores que la web (ver @theme en src/styles/global.css). */
const TINTA = '#14161a';
const GRIS = '#6a6c71';
const TRAZO = '#a8482f';

type Doc = InstanceType<typeof PDFDocument>;

/** Reserva sitio: si no cabe lo que viene, empieza una página nueva. */
function hueco(doc: Doc, alto: number) {
  if (doc.y + alto > A4.alto - MARGEN) doc.addPage();
}

/** Rótulo de sección: versales espaciadas y una línea fina debajo. */
function seccion(doc: Doc, texto: string) {
  hueco(doc, 64);
  doc.moveDown(0.45);
  const y = doc.y;
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(TINTA)
    .text(texto.toUpperCase(), MARGEN, y, { characterSpacing: 1.8 });
  const yLinea = doc.y + 4;
  doc
    .moveTo(MARGEN, yLinea)
    .lineTo(A4.ancho - MARGEN, yLinea)
    .lineWidth(0.6)
    .strokeColor(TRAZO)
    .stroke();
  doc.y = yLinea + 8;
}

/** Una entrada de experiencia o de estudios: fecha a la izquierda. */
function entrada(
  doc: Doc,
  datos: { periodo: string; titulo: string; subtitulo?: string; nota?: string; puntos?: string[] },
) {
  hueco(doc, 72);
  doc.moveDown(0.28);

  const yInicio = doc.y;
  const anchoFecha = 104;
  const xTexto = MARGEN + anchoFecha;
  const anchoTexto = ANCHO - anchoFecha;

  doc
    .font('Helvetica')
    .fontSize(8)
    .fillColor(GRIS)
    .text(datos.periodo, MARGEN, yInicio + 2, { width: anchoFecha - 14 });
  const yTrasFecha = doc.y;

  doc
    .font('Helvetica-Bold')
    .fontSize(10.5)
    .fillColor(TINTA)
    .text(datos.titulo, xTexto, yInicio, { width: anchoTexto });

  if (datos.subtitulo) {
    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor(TINTA)
      .text(datos.subtitulo, xTexto, doc.y + 1, { width: anchoTexto });
  }
  if (datos.nota) {
    doc
      .font('Helvetica')
      .fontSize(8.5)
      .fillColor(GRIS)
      .text(datos.nota, xTexto, doc.y + 1.5, { width: anchoTexto });
  }
  for (const punto of datos.puntos ?? []) {
    const y = doc.y + 2.5;
    /* La misma rayita de lápiz rojo que marca las listas en la web. */
    doc
      .moveTo(xTexto, y + 4.5)
      .lineTo(xTexto + 6, y + 4.5)
      .lineWidth(0.8)
      .strokeColor(TRAZO)
      .stroke();
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(GRIS)
      .text(punto, xTexto + 12, y, { width: anchoTexto - 12, lineGap: 1 });
  }

  doc.y = Math.max(doc.y, yTrasFecha);
}

/* ------------------------------------------------------------------ *
 *  Las secciones cortas (programas, habilidades, idiomas y otros datos)
 *  van de dos en dos, una al lado de otra: son listas breves y a toda
 *  anchura desperdiciarían media página. Con esto el currículum entra
 *  en una sola hoja, que es lo que se espera de un recién titulado.
 * ------------------------------------------------------------------ */

const HUECO_COLUMNAS = 28;
const ANCHO_COLUMNA = (ANCHO - HUECO_COLUMNAS) / 2;

interface Bloque {
  titulo: string;
  elementos: string[];
}

/** Dibuja un bloque en su columna y devuelve la altura que ha ocupado. */
function bloqueEnColumna(doc: Doc, bloque: Bloque, x: number, yInicio: number): number {
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(TINTA)
    .text(bloque.titulo.toUpperCase(), x, yInicio, {
      width: ANCHO_COLUMNA,
      characterSpacing: 1.8,
    });
  const yLinea = doc.y + 4;
  doc
    .moveTo(x, yLinea)
    .lineTo(x + ANCHO_COLUMNA, yLinea)
    .lineWidth(0.6)
    .strokeColor(TRAZO)
    .stroke();

  let y = yLinea + 7;
  for (const elemento of bloque.elementos) {
    doc
      .moveTo(x, y + 5)
      .lineTo(x + 6, y + 5)
      .lineWidth(0.8)
      .strokeColor(TRAZO)
      .stroke();
    doc
      .font('Helvetica')
      .fontSize(9.5)
      .fillColor(TINTA)
      .text(elemento, x + 12, y, { width: ANCHO_COLUMNA - 12 });
    y = doc.y + 2.5;
  }
  return y;
}

/** Dos bloques enfrentados. El segundo puede faltar. */
function parDeBloques(doc: Doc, izquierda: Bloque, derecha?: Bloque) {
  const alto = 30 + Math.max(izquierda.elementos.length, derecha?.elementos.length ?? 0) * 15;
  hueco(doc, alto);
  doc.moveDown(0.6);

  const yInicio = doc.y;
  const yIzquierda = bloqueEnColumna(doc, izquierda, MARGEN, yInicio);
  const yDerecha = derecha
    ? bloqueEnColumna(doc, derecha, MARGEN + ANCHO_COLUMNA + HUECO_COLUMNAS, yInicio)
    : yInicio;

  doc.y = Math.max(yIzquierda, yDerecha);
}

function construirPdf(cv: DatosCV): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: MARGEN, bottom: MARGEN, left: MARGEN, right: MARGEN },
    info: {
      Title: `${SITIO.nombreCompleto} — ${cv.titular}`,
      Author: SITIO.nombreCompleto,
      Subject: cv.titular,
      Creator: SITIO.nombreCompleto,
    },
    autoFirstPage: true,
  });

  const trozos: Buffer[] = [];
  const terminado = new Promise<Buffer>((resolver) => {
    doc.on('data', (t: Buffer) => trozos.push(t));
    doc.on('end', () => resolver(Buffer.concat(trozos)));
  });

  const contacto = [SITIO.correo, ...(SITIO.telefono ? [SITIO.telefono] : []), SITIO.ubicacion];

  /* Cabecera: el oficio pequeño arriba y el nombre grande, como en la web. */
  doc.y = MARGEN;
  doc
    .font('Helvetica')
    .fontSize(8.5)
    .fillColor(GRIS)
    .text(cv.titular.toUpperCase(), MARGEN, doc.y, { characterSpacing: 1.8 });
  doc
    .font('Helvetica')
    .fontSize(25)
    .fillColor(TINTA)
    .text(SITIO.nombreCompleto, MARGEN, doc.y + 6, { width: ANCHO });
  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor(GRIS)
    .text(contacto.join('   ·   '), MARGEN, doc.y + 8, { width: ANCHO });

  const yRegla = doc.y + 14;
  doc
    .moveTo(MARGEN, yRegla)
    .lineTo(A4.ancho - MARGEN, yRegla)
    .lineWidth(0.8)
    .strokeColor(TINTA)
    .stroke();
  doc.y = yRegla + 6;

  seccion(doc, cv.secciones.perfil);
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor(TINTA)
    .text(cv.resumen, MARGEN, doc.y, { width: ANCHO, lineGap: 1 });

  if (cv.experiencia.length > 0) {
    seccion(doc, cv.secciones.experiencia);
    for (const etapa of cv.experiencia) {
      entrada(doc, {
        periodo: etapa.periodo,
        titulo: etapa.puesto,
        subtitulo: etapa.lugar ? `${etapa.entidad} · ${etapa.lugar}` : etapa.entidad,
        nota: etapa.detalle,
        puntos: etapa.puntos,
      });
    }
  }

  if (cv.estudios.length > 0) {
    seccion(doc, cv.secciones.estudios);
    for (const estudio of cv.estudios) {
      entrada(doc, {
        periodo: estudio.periodo,
        titulo: estudio.titulo,
        subtitulo: estudio.centro,
        nota: estudio.nota,
      });
    }
  }

  /* Las cuatro secciones cortas, de dos en dos. */
  const cortas: Bloque[] = [
    { titulo: cv.secciones.programas, elementos: cv.programas },
    { titulo: cv.secciones.habilidades, elementos: cv.habilidades },
    {
      titulo: cv.secciones.idiomas,
      elementos: cv.idiomas.map((lengua) => `${lengua.lengua} — ${lengua.nivel}`),
    },
    {
      titulo: cv.secciones.otros,
      elementos: cv.otros.map((dato) => `${dato.etiqueta}: ${dato.valor}`),
    },
  ].filter((bloque) => bloque.elementos.length > 0);

  for (let i = 0; i < cortas.length; i += 2) {
    parDeBloques(doc, cortas[i]!, cortas[i + 1]);
  }

  doc.end();
  return terminado;
}

export const GET: APIRoute = async ({ params }) => {
  const idioma = params.idioma as Idioma;
  const pdf = await construirPdf(curriculum(idioma));

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Benat-Errazkin-CV-${idioma}.pdf"`,
    },
  });
};
