/* ------------------------------------------------------------------ *
 *  VISTA PREVIA DE LA ORGANIZACIÓN DEL PORTFOLIO
 *
 *  Monta el portfolio por pliegos (dos A4 apaisados uno al lado del
 *  otro) con las láminas tal cual están: aquí solo se prueba la
 *  maquetación, no el color ni la plumilla. No toca la web: todo se
 *  escribe en vista-previa/.
 *
 *      npm run vista-previa
 *
 *  Salida:
 *    · pliego-XX-<nombre>.jpg → cada doble página, para verla abierta;
 *    · vista-previa.pdf       → una página por pliego, con la portada
 *                               sola en A4.
 * ------------------------------------------------------------------ */

import { mkdirSync, readFileSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';
import PDFDocument from 'pdfkit';

const RAIZ = process.cwd();
const IMG = join(RAIZ, 'src/assets/img/proyectos');
const SALIDA = join(RAIZ, 'vista-previa');
mkdirSync(SALIDA, { recursive: true });

const proyectos = JSON.parse(readFileSync(join(RAIZ, 'src/data/proyectos/es.json'), 'utf8'));
const ficha = (id) => proyectos.find((p) => p.id === id);
const CV = JSON.parse(readFileSync(join(RAIZ, 'src/data/cv/es.json'), 'utf8'));
const ui = readFileSync(join(RAIZ, 'src/i18n/ui.ts'), 'utf8');
const ENTRADILLA = /inicio:\s*\{[\s\S]*?entradilla:\s*'([^']+)'/.exec(ui)?.[1] ?? '';
const FOTO = join(RAIZ, '..', 'PORTFOLIO JULI', 'FotoBeñatMasGrande.jpeg');

/* A4 apaisado a 10 px/mm; un pliego son dos. */
const P = 2970;
const H = 2100;
const W = P * 2;
const M = 130;
const TINTA = '#14161a';
const GRIS = '#6a6c71';
const LINEA = '#cbc8c2';
const TRAZO = '#a8482f';

/* ------------------------------------------------------------------ *
 *  EL PORTFOLIO, PLIEGO A PLIEGO
 *
 *  formato:
 *    apertura      → texto y ficha | imagen a sangre
 *    pliego-sangre → una imagen a sangre sobre las dos páginas
 *    pliego-dibujo → un dibujo apaisado centrado sobre las dos páginas
 *    par           → una lámina por página; `sangre: true` la lleva al borde
 * ------------------------------------------------------------------ */
const PORTFOLIO = [
  {
    numero: '01',
    id: 'tfg',
    acento: '#9c6b14',
    herramientas: ['AutoCAD', 'Rhinoceros', 'Lumion', 'Photoshop'],
    pliegos: [
      { formato: 'apertura', imagen: 'portada.webp' },
      { formato: 'par', izq: { archivo: 'emplazamiento.webp', titulo: 'Emplazamiento' }, der: { archivo: 'situacion.webp', titulo: 'Situación' } },
      { formato: 'par', izq: { archivo: 'axonometrica.webp', titulo: 'Axonometría explotada' }, der: { archivo: 'lamina-12.webp', titulo: 'Programa' } },
      { formato: 'par', izq: { archivo: 'lamina-13.webp', titulo: 'Plantas' }, der: { archivo: 'seccion-1.webp', titulo: 'Sección' } },
      { formato: 'par', izq: { archivo: 'lamina-09.webp', titulo: 'Antes y después' }, der: { archivo: 'lamina-11.webp', titulo: 'Vista desde la plaza' } },
      /* Rejilla de 2×2 vistas: el pliegue cae entre las dos columnas. */
      { formato: 'pliego-dibujo', archivo: 'vistas-interiores.webp', titulo: 'Vistas interiores' },
    ],
  },
  {
    numero: '02',
    id: 'astigarreta',
    acento: '#b5501c',
    herramientas: ['AutoCAD', 'Rhinoceros', 'Maqueta física', 'Photoshop'],
    pliegos: [
      { formato: 'apertura', imagen: 'portada.webp' },
      { formato: 'par', izq: { archivo: 'emplazamiento.webp', titulo: 'Emplazamiento' }, der: { archivo: 'planta-conjunto.webp', titulo: 'Planta de conjunto' } },
      { formato: 'pliego-dibujo', archivo: 'seccion-bb.webp', titulo: "Sección BB'" },
      { formato: 'pliego-dibujo', archivo: 'seccion-aa.webp', titulo: "Sección AA'" },
    ],
  },
  {
    numero: '03',
    id: 'urbanismo',
    acento: '#2e6b5e',
    herramientas: ['AutoCAD', 'Lumion', 'Photoshop'],
    pliegos: [
      { formato: 'apertura', imagen: 'portada.webp' },
      { formato: 'par', izq: { archivo: 'analisis-1.webp', titulo: 'Análisis de la zona' }, der: { archivo: 'analisis-2.webp', titulo: 'Arquitectura y paisaje' } },
      { formato: 'par', izq: { archivo: 'referencias.webp', titulo: 'Planta de la propuesta' }, der: { archivo: 'vista-2.webp', titulo: 'Vista de la plataforma' } },
      { formato: 'pliego-sangre', archivo: 'vista-3.webp', titulo: 'Vista de las pistas' },
    ],
  },
  {
    numero: '04',
    id: 'eliza-reforma',
    acento: '#97313e',
    herramientas: ['AutoCAD', 'Rhinoceros', 'Lumion', 'Photoshop'],
    pliegos: [
      { formato: 'apertura', imagen: 'portada.webp' },
      { formato: 'pliego-sangre', archivo: 'vista-general.webp', titulo: 'Vista general', entera: true },
      { formato: 'par', izq: { archivo: 'planta-1.webp', titulo: 'Planta 1', escala: '1:100' }, der: { archivo: 'planta-4.webp', titulo: 'Planta 4', escala: '1:100' } },
      { formato: 'par', izq: { archivo: 'seccion-1.webp', titulo: 'Sección longitudinal', escala: '1:150' }, der: { archivo: 'seccion-2.webp', titulo: 'Sección transversal', escala: '1:150' } },
      { formato: 'par', izq: { archivo: 'vista-1.webp', titulo: 'Cafetería bajo la cubierta' }, der: { archivo: 'vista-5.webp', titulo: 'Concierto en la nave' } },
    ],
  },
];

/* ------------------------------------------------------------------ *
 *  Piezas
 * ------------------------------------------------------------------ */

const esc = (t) =>
  String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/'/g, '&#39;');

function lineas(texto, n) {
  const salida = [];
  let actual = '';
  for (const palabra of String(texto).split(/\s+/)) {
    if ((actual + ' ' + palabra).trim().length > n) {
      salida.push(actual.trim());
      actual = palabra;
    } else actual += ' ' + palabra;
  }
  if (actual.trim()) salida.push(actual.trim());
  return salida;
}

const ESTILO = `<style>
  .num { font-family: Bahnschrift, 'Segoe UI'; font-weight: 700; fill: ${TINTA}; }
  .tit { font-family: Bahnschrift, 'Segoe UI'; font-weight: 700; fill: ${TINTA}; }
  .acento { font-family: Bahnschrift, 'Segoe UI'; font-weight: 600; }
  .cuerpo { font-family: 'Segoe UI'; font-weight: 300; fill: ${TINTA}; }
  .cab { font-family: 'Segoe UI'; font-style: italic; font-size: 40px; fill: ${TINTA}; }
  .rotulo { font-family: 'Segoe UI'; font-size: 36px; fill: ${TINTA}; letter-spacing: 5px; }
  .pie { font-family: 'Segoe UI'; font-size: 32px; fill: ${GRIS}; letter-spacing: 2px; }
  .cifra { font-family: Bahnschrift, 'Segoe UI'; font-weight: 300; font-stretch: condensed; fill: ${TINTA}; }
</style>`;

/* Los textos se dibujan a 10 px/mm: 44 px de cuerpo son ~12 pt impresos,
 * y se leen sin zoom con la doble página entera en pantalla. */

/**
 * Número de proyecto: fino, condensado, con las cifras juntas y estirado
 * en vertical. `y` es la línea base; `alto` el tamaño antes de estirar.
 */
const ESTIRADO = 1.35;
const cifra = (x, y, alto, texto, extra = '') =>
  `<text class="cifra" transform="translate(${x} ${y}) scale(1 ${ESTIRADO})" font-size="${alto}" letter-spacing="${-alto * 0.04}" ${extra}>${texto}</text>`;

/** Una imagen dentro de una caja: entera (`caja`) o recortada hasta llenarla (`sangre`). */
async function colocar(ruta, caja, sangre) {
  const img = sharp(ruta).flatten({ background: '#ffffff' });
  if (sangre) {
    const input = await img.resize(caja.w, caja.h, { fit: 'cover', position: 'centre' }).png().toBuffer();
    return { input, left: caja.x, top: caja.y, w: caja.w, h: caja.h };
  }
  const meta = await sharp(ruta).metadata();
  const k = Math.min(caja.w / meta.width, caja.h / meta.height);
  const w = Math.round(meta.width * k);
  const h = Math.round(meta.height * k);
  const input = await img.resize(w, h).png().toBuffer();
  return { input, left: caja.x + Math.round((caja.w - w) / 2), top: caja.y + Math.round((caja.h - h) / 2), w, h };
}

/**
 * El folio, solo, en la esquina exterior de abajo: a la izquierda en la
 * página izquierda y a la derecha en la derecha, como en un libro. Nada
 * más se repite: el nombre, "portfolio", el título y los programas ya
 * están en la portada y en la apertura de cada proyecto.
 */
function marco(lado, folio) {
  return lado === 0
    ? `<text x="${M}" y="${H - 70}" class="pie">${folio}</text>`
    : `<text x="${W - M}" y="${H - 70}" class="pie" text-anchor="end">${folio}</text>`;
}

/** Cajetín bajo una lámina: título a la izquierda, escala a la derecha. */
function cajetin(x, w, y, titulo, escala) {
  if (!titulo && !escala) return '';
  return `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${LINEA}" stroke-width="2"/>
    <text x="${x}" y="${y + 54}" class="rotulo">${esc((titulo ?? '').toUpperCase())}</text>
    ${escala ? `<text x="${x + w}" y="${y + 54}" class="rotulo" text-anchor="end">E ${esc(escala)}</text>` : ''}`;
}

const numeroMediano = (numero) => cifra(M, 330, 140, numero);

async function lienzo(ancho, capas, svg) {
  return sharp({ create: { width: ancho, height: H, channels: 3, background: '#ffffff' } })
    .composite([...capas.map(({ input, left, top }) => ({ input, left, top })), { input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${H}">${ESTILO}${svg}</svg>`), left: 0, top: 0 }])
    .png()
    .toBuffer();
}

/* ------------------------------------------------------------------ *
 *  Plantillas
 * ------------------------------------------------------------------ */

async function apertura(pr, pl, folios) {
  const p = ficha(pr.id);
  const derecha = await colocar(join(IMG, pr.id, pl.imagen), { x: P, y: 0, w: P, h: H }, true);

  const texto = p.texto
    .flatMap((parrafo, i) => [...lineas(parrafo, 66), ...(i < p.texto.length - 1 ? [''] : [])])
    .map((l, i) => `<text x="${M}" y="${930 + i * 60}" class="cuerpo" font-size="42">${esc(l)}</text>`)
    .join('');

  const datos = [
    ['LUGAR', p.lugar],
    ['TIPO', p.tipo],
    ['CONTEXTO', p.contexto],
    ['AÑO', p.anio],
    ['PROGRAMAS', pr.herramientas.join(' · ')],
  ];
  const xF = 2050;
  /* Cada dato baja lo que ocupe: si el valor parte en dos líneas, el
   * siguiente se aparta en vez de pegarse. */
  let yFicha = 930;
  let tabla = '';
  for (const [k, v] of datos) {
    const valor = lineas(v, 30);
    tabla += `<text x="${xF}" y="${yFicha}" class="pie">${k}</text>
      ${valor.map((l, j) => `<text x="${xF}" y="${yFicha + 52 + j * 50}" class="cuerpo" font-size="38">${esc(l)}</text>`).join('')}`;
    yFicha += 52 + valor.length * 50 + 70;
  }

  const svg = `
    ${cifra(M, 500, 290, pr.numero)}
    <text x="${M}" y="640" class="tit" font-size="72">${esc(p.titulo.toUpperCase())}</text>
    <text x="${M}" y="720" class="acento" font-size="52" fill="${pr.acento}">${esc(p.lugar.toUpperCase())}</text>
    <text x="${M}" y="810" class="cuerpo" font-size="46" fill="${GRIS}">${esc(p.subtitulo)}</text>
    ${texto}
    <line x1="${xF - 60}" y1="880" x2="${xF - 60}" y2="1800" stroke="${LINEA}" stroke-width="2"/>
    ${tabla}
    ${marco(0, folios[0], p, pr)}`;
  return lienzo(W, [derecha], svg);
}

async function pliegoSangre(pr, pl, folios) {
  /* `entera: true` → la imagen no se recorta: ocupa todo el alto, pegada
   * al borde derecho y cruzando el pliegue, y el blanco que sobra a la
   * izquierda lleva el número y el título. Para vistas en las que no se
   * puede perder nada de arriba ni de abajo (la iglesia con su torre). */
  if (pl.entera) {
    const meta = await sharp(join(IMG, pr.id, pl.archivo)).metadata();
    const ancho = Math.round((H * meta.width) / meta.height);
    const input = await sharp(join(IMG, pr.id, pl.archivo)).resize(ancho, H).png().toBuffer();
    const p = ficha(pr.id);
    const svg = `${numeroMediano(pr.numero)}
      <text x="${M}" y="${H - 200}" class="rotulo">${esc((pl.titulo ?? '').toUpperCase())}</text>
      <line x1="${M}" y1="${H - 250}" x2="${W - ancho - 80}" y2="${H - 250}" stroke="${LINEA}" stroke-width="2"/>
      ${marco(0, folios[0], p, pr)}`;
    return lienzo(W, [{ input, left: W - ancho, top: 0 }], svg);
  }
  const img = await colocar(join(IMG, pr.id, pl.archivo), { x: 0, y: 0, w: W, h: H }, true);
  /* El rótulo, blanco con contorno oscuro para que se lea sobre cualquier imagen. */
  const svg = `<text x="${M}" y="${H - 80}" class="rotulo" style="fill:#fff; stroke:rgba(0,0,0,.55); stroke-width:6px; paint-order:stroke">${esc(`${pr.numero}  ·  ${pl.titulo ?? ''}`.toUpperCase())}</text>`;
  return lienzo(W, [img], svg);
}

async function pliegoDibujo(pr, pl, folios) {
  const p = ficha(pr.id);
  const caja = { x: M, y: 380, w: W - 2 * M, h: 1860 - 380 };
  const img = await colocar(join(IMG, pr.id, pl.archivo), caja, false);
  const svg = `${numeroMediano(pr.numero)}
    ${cajetin(M, W - 2 * M, 1890, pl.titulo, pl.escala)}
    ${marco(0, folios[0], p, pr)}${marco(1, folios[1], p, pr)}`;
  return lienzo(W, [img], svg);
}

async function par(pr, pl, folios) {
  const p = ficha(pr.id);
  const capas = [];
  let svg = '';
  for (const [lado, lam] of [[0, pl.izq], [1, pl.der]]) {
    const x0 = lado * P;
    if (lam.sangre) {
      capas.push(await colocar(join(IMG, pr.id, lam.archivo), { x: x0, y: 0, w: P, h: H }, true));
      continue;
    }
    const caja = { x: x0 + (lado === 0 ? M : 80), y: 380, w: P - M - 80, h: 1860 - 380 };
    capas.push(await colocar(join(IMG, pr.id, lam.archivo), caja, false));
    svg += cajetin(caja.x, caja.w, 1890, lam.titulo, lam.escala) + marco(lado, folios[lado], p, pr);
  }
  if (!pl.izq.sangre) svg = numeroMediano(pr.numero) + svg;
  return lienzo(W, capas, svg);
}

/* ------------------------------------------------------------------ *
 *  Portada, sobre mí e índice
 * ------------------------------------------------------------------ */

async function portada() {
  const img = await colocar(join(IMG, 'tfg', 'portada.webp'), { x: 0, y: 0, w: P, h: 1480 }, true);
  const svg = `
    <text x="${M - 20}" y="1840" class="num" font-size="330" letter-spacing="-6">portfolio</text>
    <text x="${M}" y="1990" class="rotulo" font-size="46">BEÑAT ERRAZKIN  ·  2025  ·  <tspan fill="${TRAZO}">SELECCIÓN DE TRABAJOS</tspan></text>`;
  return lienzo(P, [img], svg);
}

/** Título de bloque: rótulo en el color de trazo con una línea debajo. */
const bloque = (x, y, ancho, texto) =>
  `<text x="${x}" y="${y}" class="acento" font-size="44" fill="${TRAZO}">${esc(texto.toUpperCase())}</text>
   <line x1="${x}" y1="${y + 26}" x2="${x + ancho}" y2="${y + 26}" stroke="${LINEA}" stroke-width="2"/>`;

/* Sobre mí: todo el texto en la página izquierda (presentación y un
 * currículum breve con los mismos datos que el CV de la web) y la foto
 * sola en la derecha. */
async function sobreMi() {
  /* Foto vertical recortada por los dos lados: por abajo, para que no
   * se vean tanto las piernas (se queda en la cintura), y por arriba,
   * para que la cabeza no quede tan baja. Centrada en la página. */
  const alto = 1350;
  const corte = { left: 0, top: 380, width: 996, height: 920 };
  const recorte = await sharp(FOTO).extract(corte).toBuffer();
  const ancho = Math.round((alto * corte.width) / corte.height);
  const foto = {
    input: await sharp(recorte).resize(ancho, alto).png().toBuffer(),
    left: P + Math.round((P - ancho) / 2),
    top: Math.round((H - alto) / 2),
  };

  /* Columna 1: presentación. */
  const entradilla = lineas(ENTRADILLA, 40)
    .map((l, i) => `<text x="${M}" y="${680 + i * 64}" class="cuerpo" font-size="46">${esc(l)}</text>`)
    .join('');
  const rapidos = [
    'ARQUITECTO · UPV/EHU 2025',
    'MÁSTER HABILITANTE ETSAB',
    'BARCELONA · EUSKERA · CASTELLANO · INGLÉS',
    'AUTOCAD · RHINO · REVIT · D5 · ADOBE',
  ]
    .map((l, i) => `<text x="${M}" y="${1480 + i * 60}" class="rotulo">${esc(l)}</text>`)
    .join('');

  /* Columna 2: currículum breve. Cada entrada en dos líneas: el puesto
   * con la fecha a la derecha, y debajo dónde. */
  const c = 1560;
  const anchoCol = P - M - c;
  const entrada = (y, titulo, fecha, detalle) => {
    const lineasDetalle = lineas(detalle, 58);
    const svg = `<text x="${c}" y="${y}" class="tit" font-size="38">${esc(titulo)}</text>
      <text x="${c + anchoCol}" y="${y}" class="pie" text-anchor="end">${esc(fecha.toUpperCase())}</text>
      ${lineasDetalle.map((l, j) => `<text x="${c}" y="${y + 48 + j * 44}" class="cuerpo" font-size="34">${esc(l)}</text>`).join('')}`;
    return { svg, alto: 48 + lineasDetalle.length * 44 + 40 };
  };

  let y = 380;
  let cv = bloque(c, y, anchoCol, CV.secciones.estudios);
  y += 100;
  for (const e of CV.estudios) {
    const { svg, alto } = entrada(y, e.titulo, e.periodo, e.centro);
    cv += svg;
    y += alto;
  }
  y += 20;
  cv += bloque(c, y, anchoCol, CV.secciones.idiomas);
  y += 90;
  for (const i of CV.idiomas) {
    cv += `<text x="${c}" y="${y}" class="cuerpo" font-size="34">${esc(i.lengua)}</text>
      <text x="${c + anchoCol}" y="${y}" class="pie" text-anchor="end">${esc(i.nivel.toUpperCase())}</text>`;
    y += 50;
  }
  y += 40;
  cv += bloque(c, y, anchoCol, CV.secciones.experiencia);
  y += 100;
  for (const e of CV.experiencia) {
    const { svg, alto } = entrada(y, e.puesto, e.periodo, [e.entidad, e.lugar].filter(Boolean).join(' · '));
    cv += svg;
    y += alto;
  }

  const svg = `
    <text x="${M}" y="440" class="tit" font-size="96">BEÑAT ERRAZKIN</text>
    <text x="${M}" y="530" class="acento" font-size="52" fill="${TRAZO}">ARQUITECTO</text>
    ${entradilla}
    ${rapidos}
    <text x="${M}" y="1790" class="cuerpo" font-size="40">benaterrazkin224@gmail.com</text>
    <line x1="${c - 70}" y1="380" x2="${c - 70}" y2="1800" stroke="${LINEA}" stroke-width="2"/>
    ${cv}
    ${marco(0, '02')}${marco(1, '03')}`;
  return lienzo(W, [foto], svg);
}

/* Índice a doble página: una columna por proyecto. Las cuatro columnas
 * se reparten de modo que el pliegue caiga entre la segunda y la tercera. */
async function indice(comienzos) {
  const capas = [];
  const hueco = 80;
  const ancho = Math.floor((W - 2 * M - 3 * hueco) / 4);
  let svg = `<text x="${M}" y="420" class="num" font-size="160">índice</text>
    <text x="${M}" y="510" class="acento" font-size="50" fill="${TRAZO}">SELECCIÓN DE TRABAJOS</text>`;
  for (const [i, pr] of PORTFOLIO.entries()) {
    const p = ficha(pr.id);
    const x = M + i * (ancho + hueco);
    capas.push(await colocar(join(IMG, pr.id, pr.pliegos[0].imagen), { x, y: 600, w: ancho, h: 760 }, true));
    const titulo = lineas(p.titulo.toUpperCase(), 28);
    const yLugar = 1720 + titulo.length * 58 + 10;
    svg += `${cifra(x - 6, 1650, 210, pr.numero)}
      ${titulo.map((l, j) => `<text x="${x}" y="${1720 + j * 58}" class="tit" font-size="48">${esc(l)}</text>`).join('')}
      <text x="${x}" y="${yLugar}" class="acento" font-size="40" fill="${pr.acento}">${esc(p.lugar.toUpperCase())}</text>
      <text x="${x}" y="${yLugar + 60}" class="pie">${esc(`P. ${comienzos[i]}`)}</text>`;
  }
  svg += marco(0, '04') + marco(1, '05');
  return lienzo(W, capas, svg);
}

/* ------------------------------------------------------------------ *
 *  Montaje
 * ------------------------------------------------------------------ */

const PLANTILLAS = { apertura, 'pliego-sangre': pliegoSangre, 'pliego-dibujo': pliegoDibujo, par };
const dos = (n) => String(n).padStart(2, '0');

/* Portada = página 1, sobre mí = 2-3, índice = 4-5; cada pliego suma dos. */
const PRIMERA = 6;
let pagina = PRIMERA;
const comienzos = PORTFOLIO.map((pr) => {
  const inicio = pagina;
  pagina += pr.pliegos.length * 2;
  return inicio;
});

console.log('Vista previa de la organización:');
const pliegos = [];
pliegos.push({ nombre: '00-portada', png: await portada(), suelta: true });
pliegos.push({ nombre: '01-sobre-mi', png: await sobreMi() });
pliegos.push({ nombre: '02-indice', png: await indice(comienzos) });

let n = 3;
pagina = PRIMERA;
for (const pr of PORTFOLIO) {
  for (const pl of pr.pliegos) {
    const folios = [dos(pagina), dos(pagina + 1)];
    const png = await PLANTILLAS[pl.formato](pr, pl, folios);
    pliegos.push({ nombre: `${dos(n)}-${pr.id}-${pl.formato}`, png });
    console.log(`  ✓ pliego ${dos(n)}  ${pr.numero} ${pl.formato}`);
    n++;
    pagina += 2;
  }
}

for (const { nombre, png } of pliegos) {
  await sharp(png).jpeg({ quality: 85 }).toFile(join(SALIDA, `pliego-${nombre}.jpg`));
}

/* El PDF, una página por pliego (594×210 mm) y la portada sola en A4:
 * así cualquier visor enseña la doble página entera, sin partir las
 * imágenes que cruzan el pliegue. A media resolución para que pese poco. */
const A4 = [841.89, 595.28];
const doc = new PDFDocument({ margin: 0, autoFirstPage: false, info: { Title: 'Beñat Errazkin — portfolio (vista previa)' } });
doc.pipe(createWriteStream(join(SALIDA, 'vista-previa.pdf')));
for (const { png, suelta } of pliegos) {
  const ancho = suelta ? A4[0] : A4[0] * 2;
  const jpg = await sharp(png).resize(suelta ? P / 2 : P).jpeg({ quality: 82 }).toBuffer();
  doc.addPage({ size: [ancho, A4[1]] });
  doc.image(jpg, 0, 0, { width: ancho, height: A4[1] });
}
doc.end();
console.log(`Listo: ${pliegos.length} páginas de PDF (${pagina - 1} si se imprimiera) en ${SALIDA}`);
