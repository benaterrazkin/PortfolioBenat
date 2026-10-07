import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import PDFDocument from 'pdfkit';
import sharp, { type Region, type Sharp } from 'sharp';
import { IDIOMAS_PUBLICADOS, type Idioma } from '../../i18n/idiomas';
import { curriculum, imagen, proyecto, type Proyecto } from '../../data';
import { PORTFOLIO, type Pliego } from '../../data/portfolio';
import { textos } from '../../i18n/ui';
import { SITIO } from '../../config/sitio';

/* ------------------------------------------------------------------ *
 *  EL PORTFOLIO EN PDF
 *
 *  Se maqueta por PLIEGOS: cada página del PDF es una doble página de
 *  594×210 mm (dos A4 apaisados), salvo la portada, que va sola en A4.
 *  Así cualquier visor —el del navegador, el del móvil, el del correo—
 *  enseña la doble página entera y las imágenes que cruzan el pliegue
 *  no se parten.
 *
 *    portada · sobre mí · índice · y por cada proyecto: apertura + pliegos
 *
 *  Qué proyectos entran y qué va en cada pliego: src/data/portfolio.ts.
 *  Títulos, textos y fichas: los .json de cada proyecto, en su idioma.
 *
 *  Resultado: /portfolio/es.pdf, /portfolio/en.pdf, /eu.pdf, /ca.pdf
 * ------------------------------------------------------------------ */

export function getStaticPaths() {
  return IDIOMAS_PUBLICADOS.map((idioma) => ({ params: { idioma } }));
}

/* Se dibuja en "píxeles de maqueta" a 10 px/mm y se escala a puntos al
 * abrir cada página: así las medidas se leen como milímetros ×10. */
const P = 2970; // ancho de una página A4 apaisada
const H = 2100; // alto
const W = P * 2; // un pliego
const M = 130; // margen
const K = 595.28 / H; // de píxel de maqueta a punto PDF

/* Resolución de las imágenes respecto a la maqueta: 0,6 → unos 150 ppp,
 * nítido en pantalla sin que el PDF se dispare de peso. */
const RESOLUCION = 0.6;

const TINTA = '#14161a';
const GRIS = '#6a6c71';
const LINEA = '#cbc8c2';
const TRAZO = '#a8482f';

/** Los números de proyecto: finos, condensados y estirados en vertical. */
const ESTIRADO = 1.35;

type Doc = InstanceType<typeof PDFDocument>;

/* ------------------------------------------------------------------ *
 *  Tipografías
 *
 *  Las mismas de la web (Work Sans para títulos, Inter para texto) y una
 *  condensada fina para los números. Van dentro del PDF, así que se ven
 *  igual en cualquier ordenador.
 * ------------------------------------------------------------------ */
const fuente = (paquete: string, archivo: string) =>
  join(process.cwd(), 'node_modules/@fontsource', paquete, 'files', archivo);

const FUENTES = {
  grande: fuente('work-sans', 'work-sans-latin-700-normal.woff'),
  titulo: fuente('work-sans', 'work-sans-latin-600-normal.woff'),
  acento: fuente('work-sans', 'work-sans-latin-500-normal.woff'),
  cuerpo: fuente('inter', 'inter-latin-300-normal.woff'),
  rotulo: fuente('inter', 'inter-latin-400-normal.woff'),
  cifra: fuente('barlow-condensed', 'barlow-condensed-latin-300-normal.woff'),
} as const;
type Fuente = keyof typeof FUENTES;

/* ------------------------------------------------------------------ *
 *  Texto
 * ------------------------------------------------------------------ */

interface Estilo {
  fuente: Fuente;
  tam: number;
  color?: string;
  /** Espaciado entre letras, en píxeles de maqueta. */
  espacio?: number;
  alinear?: 'left' | 'right';
}

/** Una línea de texto. `y` es la línea base, como en un programa de maquetación. */
function texto(doc: Doc, s: string, x: number, y: number, e: Estilo) {
  doc.font(e.fuente).fontSize(e.tam).fillColor(e.color ?? TINTA);
  const opciones = { lineBreak: false, baseline: 'alphabetic' as const, characterSpacing: e.espacio ?? 0 };
  const xx = e.alinear === 'right' ? x - doc.widthOfString(s, opciones) : x;
  /* Sin `width`: con ancho, pdfkit maqueta el texto él solo y, como aquí se
   * dibuja a escala, creería que se sale de la hoja y abriría otra. */
  doc.text(s, xx, y, opciones);
  return doc.widthOfString(s, opciones);
}

/** Parte un texto en líneas que caben en `ancho`, midiendo con la fuente real. */
function partir(doc: Doc, s: string, ancho: number, e: Estilo): string[] {
  doc.font(e.fuente).fontSize(e.tam);
  const lineas: string[] = [];
  let actual = '';
  for (const palabra of s.split(/\s+/)) {
    const prueba = actual ? `${actual} ${palabra}` : palabra;
    if (actual && doc.widthOfString(prueba, { characterSpacing: e.espacio ?? 0 }) > ancho) {
      lineas.push(actual);
      actual = palabra;
    } else actual = prueba;
  }
  if (actual) lineas.push(actual);
  return lineas;
}

/** Un párrafo: devuelve la línea base que queda libre debajo. */
function parrafo(doc: Doc, s: string, x: number, y: number, ancho: number, interlinea: number, e: Estilo) {
  const lineas = partir(doc, s, ancho, e);
  lineas.forEach((l, i) => texto(doc, l, x, y + i * interlinea, e));
  return y + lineas.length * interlinea;
}

function cifra(doc: Doc, n: string, x: number, y: number, tam: number) {
  doc.save();
  doc.translate(x, y).scale(1, ESTIRADO);
  texto(doc, n, 0, 0, { fuente: 'cifra', tam, espacio: -tam * 0.02 });
  doc.restore();
}

function linea(doc: Doc, x1: number, y1: number, x2: number, y2: number, color = LINEA) {
  doc.moveTo(x1, y1).lineTo(x2, y2).lineWidth(2).strokeColor(color).stroke();
}

/* ------------------------------------------------------------------ *
 *  Imágenes
 *
 *  pdfkit no lee WebP: se pasan a JPEG con sharp, al tamaño justo de la
 *  caja. Se guardan en memoria porque las mismas sirven a los cuatro
 *  idiomas.
 * ------------------------------------------------------------------ */
const cache = new Map<string, Buffer>();

interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** La ruta del archivo en disco. Pasa antes por imagen() para fallar con un mensaje claro si no existe. */
function ruta(archivo: string) {
  imagen(archivo);
  /* Desde la raíz del proyecto y no con import.meta.url: al compilar, este
   * módulo acaba dentro de dist/ y las rutas relativas ya no llevan a src/. */
  return join(process.cwd(), 'src/assets/img', archivo);
}

async function jpeg(clave: string, hacer: () => Sharp) {
  const guardado = cache.get(clave);
  if (guardado) return guardado;
  const datos = await hacer().jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  cache.set(clave, datos);
  return datos;
}

/** Imagen recortada hasta llenar la caja. */
async function aSangre(doc: Doc, archivo: string, caja: Caja, recorte?: Region) {
  const w = Math.round(caja.w * RESOLUCION);
  const h = Math.round(caja.h * RESOLUCION);
  const datos = await jpeg(`${archivo}|${w}x${h}|${JSON.stringify(recorte ?? '')}`, () => {
    const base = sharp(readFileSync(ruta(archivo))).flatten({ background: '#ffffff' });
    return (recorte ? base.extract(recorte) : base).resize(w, h, { fit: 'cover', position: 'centre' });
  });
  doc.image(datos, caja.x, caja.y, { width: caja.w, height: caja.h });
}

/** Imagen entera dentro de la caja, centrada. Devuelve lo que ocupa. */
async function enCaja(doc: Doc, archivo: string, caja: Caja): Promise<Caja> {
  const meta = await sharp(ruta(archivo)).metadata();
  const k = Math.min(caja.w / (meta.width ?? 1), caja.h / (meta.height ?? 1));
  const w = Math.round((meta.width ?? 1) * k);
  const h = Math.round((meta.height ?? 1) * k);
  const datos = await jpeg(`${archivo}|caja|${w}x${h}`, () =>
    sharp(readFileSync(ruta(archivo)))
      .flatten({ background: '#ffffff' })
      .resize(Math.round(w * RESOLUCION), Math.round(h * RESOLUCION)),
  );
  const x = caja.x + Math.round((caja.w - w) / 2);
  const y = caja.y + Math.round((caja.h - h) / 2);
  doc.image(datos, x, y, { width: w, height: h });
  return { x, y, w, h };
}

/* ------------------------------------------------------------------ *
 *  Piezas de página
 * ------------------------------------------------------------------ */

function nuevaPagina(doc: Doc, ancho: number) {
  doc.addPage({ size: [ancho * K, H * K], margin: 0 });
  doc.scale(K);
}

/** El folio, solo, en la esquina exterior de abajo, como en un libro. */
function folio(doc: Doc, lado: 0 | 1, n: number) {
  const s = String(n).padStart(2, '0');
  if (lado === 0) texto(doc, s, M, H - 70, { fuente: 'rotulo', tam: 32, color: GRIS, espacio: 2 });
  else texto(doc, s, W - M, H - 70, { fuente: 'rotulo', tam: 32, color: GRIS, espacio: 2, alinear: 'right' });
}

/** Título de la lámina y escala, bajo el dibujo. */
function cajetin(doc: Doc, x: number, ancho: number, titulo?: string, escala?: string) {
  if (!titulo && !escala) return;
  const y = 1890;
  linea(doc, x, y, x + ancho, y);
  const estilo: Estilo = { fuente: 'rotulo', tam: 36, espacio: 5 };
  if (titulo) texto(doc, titulo.toUpperCase(), x, y + 54, estilo);
  if (escala) texto(doc, `E ${escala}`, x + ancho, y + 54, { ...estilo, alinear: 'right' });
}

/** El número del proyecto, mediano, arriba a la izquierda del pliego. */
const numeroMediano = (doc: Doc, n: string) => cifra(doc, n, M, 330, 140);

/** Bloque del currículum: rótulo en el color de trazo con una línea debajo. */
function bloque(doc: Doc, x: number, y: number, ancho: number, s: string) {
  texto(doc, s.toUpperCase(), x, y, { fuente: 'acento', tam: 44, color: TRAZO });
  linea(doc, x, y + 26, x + ancho, y + 26);
}

/* ------------------------------------------------------------------ *
 *  Datos
 * ------------------------------------------------------------------ */

interface Entrada {
  numero: string;
  p: Proyecto;
  pliegos: Pliego[];
  /** La primera página del proyecto. */
  comienzo: number;
}

/** El título y la escala de una lámina salen del .json del proyecto. */
function lamina(p: Proyecto, archivo: string) {
  const completo = `proyectos/${p.id}/${archivo}`;
  const hoja = p.paginas.find((h) => h.tipo === 'lamina' && h.archivo === completo);
  if (!hoja || hoja.tipo !== 'lamina') {
    throw new Error(
      `\n\nsrc/data/portfolio.ts pide la lámina "${completo}", pero no está en las "paginas" del proyecto "${p.id}".\n`,
    );
  }
  return { archivo: completo, titulo: hoja.titulo, escala: hoja.escala };
}

/* ------------------------------------------------------------------ *
 *  Pliegos
 * ------------------------------------------------------------------ */

async function portada(doc: Doc, idioma: Idioma, primera: Proyecto, anio: string) {
  const t = textos(idioma);
  nuevaPagina(doc, P);
  await aSangre(doc, primera.portada.archivo, { x: 0, y: 0, w: P, h: 1480 });
  texto(doc, t.portfolio.titulo.toLowerCase(), M - 16, 1840, { fuente: 'grande', tam: 330, espacio: -6 });
  const estilo: Estilo = { fuente: 'rotulo', tam: 46, espacio: 5 };
  const ancho = texto(doc, `${SITIO.nombre.toUpperCase()}  ·  ${anio}  ·  `, M, 1990, estilo);
  texto(doc, t.portfolio.seleccion.toUpperCase(), M + ancho, 1990, { ...estilo, color: TRAZO });
}

async function sobreMi(doc: Doc, idioma: Idioma) {
  const t = textos(idioma);
  const cv = curriculum(idioma);
  nuevaPagina(doc, W);

  /* Página izquierda, columna 1: la presentación. */
  texto(doc, SITIO.nombre.toUpperCase(), M, 440, { fuente: 'titulo', tam: 96 });
  texto(doc, t.inicio.rotulo.toUpperCase(), M, 530, { fuente: 'acento', tam: 52, color: TRAZO });
  parrafo(doc, t.inicio.entradilla, M, 680, 1240, 64, { fuente: 'cuerpo', tam: 46 });

  const datos = [...t.inicio.datos, SITIO.programas.join(' · ')];
  datos.forEach((d, i) =>
    texto(doc, d.toUpperCase(), M, 1480 + i * 60, { fuente: 'rotulo', tam: 34, espacio: 5 }),
  );
  texto(doc, SITIO.correo, M, 1790, { fuente: 'cuerpo', tam: 40 });

  /* Columna 2: un currículum breve, con los mismos datos que el de la web. */
  const c = 1560;
  const ancho = P - M - c;
  linea(doc, c - 70, 380, c - 70, 1800);
  const entrada = (y: number, titulo: string, fecha: string, detalle: string) => {
    texto(doc, titulo, c, y, { fuente: 'titulo', tam: 38 });
    texto(doc, fecha.toUpperCase(), c + ancho, y, { fuente: 'rotulo', tam: 32, color: GRIS, espacio: 2, alinear: 'right' });
    return parrafo(doc, detalle, c, y + 48, ancho, 44, { fuente: 'cuerpo', tam: 34 }) - 4 + 40;
  };

  let y = 380;
  bloque(doc, c, y, ancho, cv.secciones.estudios);
  y += 100;
  for (const e of cv.estudios) y = entrada(y, e.titulo, e.periodo, e.centro);
  y += 20;
  bloque(doc, c, y, ancho, cv.secciones.idiomas);
  y += 90;
  for (const i of cv.idiomas) {
    texto(doc, i.lengua, c, y, { fuente: 'cuerpo', tam: 34 });
    texto(doc, i.nivel.toUpperCase(), c + ancho, y, { fuente: 'rotulo', tam: 32, color: GRIS, espacio: 2, alinear: 'right' });
    y += 50;
  }
  y += 40;
  bloque(doc, c, y, ancho, cv.secciones.experiencia);
  y += 100;
  for (const e of cv.experiencia) y = entrada(y, e.puesto, e.periodo, [e.entidad, e.lugar].filter(Boolean).join(' · '));

  /* Página derecha: la foto sola, recortada por la cintura y centrada. */
  const alto = 1350;
  const recorte = { left: 0, top: 380, width: 996, height: 920 };
  const anchoFoto = Math.round((alto * recorte.width) / recorte.height);
  await aSangre(doc, 'foto-benat.jpg', { x: P + Math.round((P - anchoFoto) / 2), y: Math.round((H - alto) / 2), w: anchoFoto, h: alto }, recorte);

  folio(doc, 0, 2);
  folio(doc, 1, 3);
}

async function indice(doc: Doc, idioma: Idioma, entradas: Entrada[]) {
  const t = textos(idioma);
  nuevaPagina(doc, W);
  texto(doc, t.portfolio.indice, M, 420, { fuente: 'grande', tam: 160 });
  texto(doc, t.portfolio.seleccion.toUpperCase(), M, 510, { fuente: 'acento', tam: 50, color: TRAZO });

  /* Una columna por proyecto; con cuatro, el pliegue cae entre la 2.ª y la 3.ª. */
  const hueco = 80;
  const ancho = Math.floor((W - 2 * M - (entradas.length - 1) * hueco) / entradas.length);
  for (const [i, { numero, p, comienzo }] of entradas.entries()) {
    const x = M + i * (ancho + hueco);
    await aSangre(doc, p.portada.archivo, { x, y: 600, w: ancho, h: 760 });
    cifra(doc, numero, x - 6, 1650, 210);
    let y = parrafo(doc, p.titulo.toUpperCase(), x, 1720, ancho, 58, { fuente: 'titulo', tam: 48 });
    y += 10;
    texto(doc, (p.lugar ?? '').toUpperCase(), x, y, { fuente: 'acento', tam: 40, color: p.lomo ?? TRAZO });
    texto(doc, `${t.portfolio.pagina} ${comienzo}`, x, y + 60, { fuente: 'rotulo', tam: 32, color: GRIS, espacio: 2 });
  }
  folio(doc, 0, 4);
  folio(doc, 1, 5);
}

/** Texto y ficha a la izquierda; la portada del proyecto a sangre a la derecha. */
async function apertura(doc: Doc, idioma: Idioma, { numero, p, comienzo }: Entrada) {
  const t = textos(idioma);
  nuevaPagina(doc, W);
  await aSangre(doc, p.portada.archivo, { x: P, y: 0, w: P, h: H });

  cifra(doc, numero, M, 500, 290);
  texto(doc, p.titulo.toUpperCase(), M, 640, { fuente: 'titulo', tam: 72 });
  texto(doc, (p.lugar ?? '').toUpperCase(), M, 720, { fuente: 'acento', tam: 52, color: p.lomo ?? TRAZO });
  if (p.subtitulo) texto(doc, p.subtitulo, M, 810, { fuente: 'cuerpo', tam: 46, color: GRIS });

  let y = 930;
  for (const s of p.texto) y = parrafo(doc, s, M, y, 1720, 60, { fuente: 'cuerpo', tam: 42 }) + 60;

  /* La ficha: los datos del proyecto y los programas, solo aquí. */
  const xF = 2050;
  linea(doc, xF - 60, 880, xF - 60, 1800);
  const ficha: [string, string | undefined][] = [
    [t.proyectos.ficha.lugar, p.lugar],
    [t.proyectos.ficha.tipo, p.tipo],
    [t.proyectos.ficha.contexto, p.contexto],
    [t.proyectos.ficha.anio, p.anio],
    [t.portfolio.programas, p.herramientas.join(' · ')],
  ];
  let yF = 930;
  for (const [clave, valor] of ficha) {
    if (!valor) continue;
    texto(doc, clave.toUpperCase(), xF, yF, { fuente: 'rotulo', tam: 32, color: GRIS, espacio: 2 });
    yF = parrafo(doc, valor, xF, yF + 52, P - M - xF, 50, { fuente: 'cuerpo', tam: 38 }) + 70;
  }
  folio(doc, 0, comienzo);
}

async function pliego(doc: Doc, { numero, p }: Entrada, pl: Pliego, pagina: number) {
  nuevaPagina(doc, W);

  if (pl.formato === 'sangre') {
    const l = lamina(p, pl.archivo);
    if (!pl.entera) {
      await aSangre(doc, l.archivo, { x: 0, y: 0, w: W, h: H });
      return;
    }
    /* Entera: todo el alto, pegada a la derecha; el título en el blanco. */
    const meta = await sharp(ruta(l.archivo)).metadata();
    const ancho = Math.min(W, Math.round((H * (meta.width ?? 1)) / (meta.height ?? 1)));
    await aSangre(doc, l.archivo, { x: W - ancho, y: 0, w: ancho, h: H });
    numeroMediano(doc, numero);
    linea(doc, M, H - 250, W - ancho - 80, H - 250);
    if (l.titulo) texto(doc, l.titulo.toUpperCase(), M, H - 200, { fuente: 'rotulo', tam: 36, espacio: 5 });
    folio(doc, 0, pagina);
    return;
  }

  numeroMediano(doc, numero);

  if (pl.formato === 'dibujo') {
    const l = lamina(p, pl.archivo);
    await enCaja(doc, l.archivo, { x: M, y: 380, w: W - 2 * M, h: 1860 - 380 });
    cajetin(doc, M, W - 2 * M, l.titulo, l.escala);
  } else {
    for (const [lado, archivo] of [[0, pl.izq], [1, pl.der]] as const) {
      const l = lamina(p, archivo);
      const caja = { x: lado * P + (lado === 0 ? M : 80), y: 380, w: P - M - 80, h: 1860 - 380 };
      await enCaja(doc, l.archivo, caja);
      cajetin(doc, caja.x, caja.w, l.titulo, l.escala);
    }
  }
  folio(doc, 0, pagina);
  folio(doc, 1, pagina + 1);
}

/* ------------------------------------------------------------------ *
 *  El documento
 * ------------------------------------------------------------------ */

async function construir(idioma: Idioma): Promise<Buffer> {
  const t = textos(idioma);

  /* Portada = 1, sobre mí = 2-3, índice = 4-5; cada pliego suma dos. */
  let pagina = 6;
  const entradas: Entrada[] = PORTFOLIO.map(({ id, pliegos }, i) => {
    const comienzo = pagina;
    pagina += 2 * (1 + pliegos.length);
    return { numero: String(i + 1).padStart(2, '0'), p: proyecto(id, idioma), pliegos, comienzo };
  });
  const anio = entradas.map((e) => e.p.anio).sort().at(-1) ?? '';

  const doc = new PDFDocument({
    autoFirstPage: false,
    margin: 0,
    info: {
      Title: `${SITIO.nombreCompleto} — ${t.portfolio.titulo}`,
      Author: SITIO.nombreCompleto,
      Subject: t.meta.inicio.titulo,
      Creator: SITIO.nombreCompleto,
    },
  });
  for (const [nombre, archivo] of Object.entries(FUENTES)) doc.registerFont(nombre, archivo);

  const trozos: Buffer[] = [];
  const terminado = new Promise<Buffer>((resolver) => {
    doc.on('data', (c: Buffer) => trozos.push(c));
    doc.on('end', () => resolver(Buffer.concat(trozos)));
  });

  await portada(doc, idioma, entradas[0]!.p, anio);
  await sobreMi(doc, idioma);
  await indice(doc, idioma, entradas);
  for (const entrada of entradas) {
    await apertura(doc, idioma, entrada);
    let n = entrada.comienzo + 2;
    for (const pl of entrada.pliegos) {
      await pliego(doc, entrada, pl, n);
      n += 2;
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
