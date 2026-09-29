/**
 * Genera las imágenes de relleno de los tres proyectos de prueba.
 *
 *   npm run imagenes-ejemplo
 *
 * Son dibujos vacíos con una retícula y un rótulo, para ver cómo queda el
 * cuaderno antes de tener las láminas de verdad. En cuanto haya proyectos
 * reales, estas carpetas (src/assets/img/proyectos/proyecto-1, -2 y -3) y
 * este script se pueden borrar.
 *
 * Las imágenes son grandes a propósito: en el cuaderno una hoja ocupa media
 * pantalla, así que Astro necesita originales de al menos 2000 px de ancho
 * para que no se vean blandas en una pantalla buena.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '../src/assets/img/proyectos');

const PAPEL = '#f2f0ec';
const LINEA = '#cbc8c2';
const TINTA = '#14161a';
const GRIS = '#6a6c71';

const PROYECTOS = [
  {
    carpeta: 'proyecto-1',
    rotulo: 'PROYECTO 1',
    imagenes: [
      { archivo: 'portada.jpg', ancho: 2400, alto: 1600, titulo: 'PORTADA' },
      { archivo: 'emplazamiento.jpg', ancho: 2000, alto: 1414, titulo: 'EMPLAZAMIENTO' },
      { archivo: 'planta-baja.jpg', ancho: 2000, alto: 1414, titulo: 'PLANTA BAJA' },
      { archivo: 'planta-alta.jpg', ancho: 2000, alto: 1414, titulo: 'PLANTA ALTA' },
      { archivo: 'seccion.jpg', ancho: 2400, alto: 1200, titulo: 'SECCIÓN' },
      { archivo: 'alzado.jpg', ancho: 2400, alto: 1100, titulo: 'ALZADO' },
      { archivo: 'axonometrica.jpg', ancho: 1800, alto: 1800, titulo: 'AXONOMÉTRICA' },
      { archivo: 'maqueta.jpg', ancho: 2000, alto: 1500, titulo: 'MAQUETA' },
    ],
  },
  {
    carpeta: 'proyecto-2',
    rotulo: 'PROYECTO 2',
    imagenes: [
      { archivo: 'portada.jpg', ancho: 2400, alto: 1600, titulo: 'PORTADA' },
      { archivo: 'implantacion.jpg', ancho: 2000, alto: 1414, titulo: 'IMPLANTACIÓN' },
      { archivo: 'planta-tipo.jpg', ancho: 2000, alto: 1414, titulo: 'PLANTA TIPO' },
      { archivo: 'seccion-transversal.jpg', ancho: 2400, alto: 1150, titulo: 'SECCIÓN' },
      { archivo: 'vivienda.jpg', ancho: 1500, alto: 2000, titulo: 'VIVIENDA TIPO' },
      { archivo: 'paso.jpg', ancho: 2000, alto: 1500, titulo: 'EL PASO' },
      { archivo: 'constructivo.jpg', ancho: 1600, alto: 2100, titulo: 'DETALLE' },
    ],
  },
  {
    carpeta: 'proyecto-3',
    rotulo: 'PROYECTO 3',
    imagenes: [
      { archivo: 'portada.jpg', ancho: 2400, alto: 1600, titulo: 'PORTADA' },
      { archivo: 'manzana.jpg', ancho: 2000, alto: 2000, titulo: 'LA MANZANA' },
      { archivo: 'planta.jpg', ancho: 2000, alto: 1414, titulo: 'PLANTA GENERAL' },
      { archivo: 'seccion-patio.jpg', ancho: 2400, alto: 1100, titulo: 'SECCIÓN' },
      { archivo: 'luz.jpg', ancho: 1600, alto: 2100, titulo: 'SOLEAMIENTO' },
      { archivo: 'interior.jpg', ancho: 2200, alto: 1466, titulo: 'LOS TALLERES' },
    ],
  },
];

function dibujo({ ancho, alto, titulo, proyecto }) {
  /* Todo se mide contra el lado menor, para que una imagen de 2400 px y otra
   * de 1500 px se vean con el mismo peso de línea y de letra. */
  const menor = Math.min(ancho, alto);
  const paso = Math.round(menor / 14);
  const m = Math.round(menor / 24);
  const cuerpo = Math.round(menor / 15);
  const pie = Math.round(menor / 36);

  const reticula = [];
  for (let x = paso; x < ancho; x += paso) {
    reticula.push(`<line x1="${x}" y1="0" x2="${x}" y2="${alto}" stroke="${LINEA}" stroke-width="1.5"/>`);
  }
  for (let y = paso; y < alto; y += paso) {
    reticula.push(`<line x1="0" y1="${y}" x2="${ancho}" y2="${y}" stroke="${LINEA}" stroke-width="1.5"/>`);
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">
    <rect width="${ancho}" height="${alto}" fill="${PAPEL}"/>
    <g opacity="0.5">${reticula.join('')}</g>
    <rect x="${m}" y="${m}" width="${ancho - m * 2}" height="${alto - m * 2}"
          fill="none" stroke="${TINTA}" stroke-width="2"/>
    <line x1="${m}" y1="${m}" x2="${ancho - m}" y2="${alto - m}" stroke="${LINEA}" stroke-width="1.5"/>
    <line x1="${ancho - m}" y1="${m}" x2="${m}" y2="${alto - m}" stroke="${LINEA}" stroke-width="1.5"/>
    <text x="${ancho / 2}" y="${alto / 2 + cuerpo / 3}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="${cuerpo}"
          letter-spacing="${cuerpo / 5}" fill="${TINTA}">${titulo}</text>
    <text x="${ancho / 2}" y="${alto / 2 + cuerpo * 1.4}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="${pie}"
          letter-spacing="${pie / 4}" fill="${GRIS}">${proyecto} · IMAGEN DE RELLENO · ${ancho}×${alto}</text>
  </svg>`;
}

let total = 0;
for (const proyecto of PROYECTOS) {
  const destino = resolve(RAIZ, proyecto.carpeta);
  await mkdir(destino, { recursive: true });
  console.log(`\n${proyecto.carpeta}`);
  for (const im of proyecto.imagenes) {
    const svg = Buffer.from(dibujo({ ...im, proyecto: proyecto.rotulo }));
    const jpg = await sharp(svg).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    await writeFile(resolve(destino, im.archivo), jpg);
    console.log(`  · ${im.archivo}  ${im.ancho}×${im.alto}`);
    total++;
  }
}

console.log(`\nListo: ${total} imágenes en src/assets/img/proyectos/`);
