/**
 * Genera las imágenes de relleno del proyecto de ejemplo.
 *
 *   npm run imagenes-ejemplo
 *
 * Son dibujos vacíos con una retícula, para ver cómo queda la web antes de
 * tener las imágenes de verdad. En cuanto haya proyectos reales, esta carpeta
 * (src/assets/img/proyectos/ejemplo/) y el script se pueden borrar.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const AQUI = dirname(fileURLToPath(import.meta.url));
const DESTINO = resolve(AQUI, '../src/assets/img/proyectos/ejemplo');

const PAPEL = '#f2f0ec';
const LINEA = '#cbc8c2';
const TINTA = '#14161a';

const IMAGENES = [
  { archivo: 'portada.jpg', ancho: 1800, alto: 1200, rotulo: 'PORTADA' },
  { archivo: 'planta.jpg', ancho: 1800, alto: 1273, rotulo: 'PLANTA' },
  { archivo: 'seccion.jpg', ancho: 1800, alto: 900, rotulo: 'SECCIÓN' },
  { archivo: 'alzado.jpg', ancho: 1800, alto: 900, rotulo: 'ALZADO' },
  { archivo: 'axonometrica.jpg', ancho: 1400, alto: 1400, rotulo: 'AXONOMÉTRICA' },
  { archivo: 'maqueta.jpg', ancho: 1600, alto: 1067, rotulo: 'MAQUETA' },
];

function dibujo({ ancho, alto, rotulo }) {
  const paso = 60;
  const verticales = [];
  for (let x = paso; x < ancho; x += paso) {
    verticales.push(`<line x1="${x}" y1="0" x2="${x}" y2="${alto}" stroke="${LINEA}" stroke-width="1"/>`);
  }
  const horizontales = [];
  for (let y = paso; y < alto; y += paso) {
    horizontales.push(`<line x1="0" y1="${y}" x2="${ancho}" y2="${y}" stroke="${LINEA}" stroke-width="1"/>`);
  }
  const m = 40;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">
    <rect width="${ancho}" height="${alto}" fill="${PAPEL}"/>
    <g opacity="0.55">${verticales.join('')}${horizontales.join('')}</g>
    <rect x="${m}" y="${m}" width="${ancho - m * 2}" height="${alto - m * 2}"
          fill="none" stroke="${TINTA}" stroke-width="1.5"/>
    <line x1="${m}" y1="${m}" x2="${ancho - m}" y2="${alto - m}" stroke="${LINEA}" stroke-width="1"/>
    <line x1="${ancho - m}" y1="${m}" x2="${m}" y2="${alto - m}" stroke="${LINEA}" stroke-width="1"/>
    <text x="${ancho / 2}" y="${alto / 2 + 14}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="40" letter-spacing="10"
          fill="${TINTA}">${rotulo}</text>
    <text x="${ancho / 2}" y="${alto / 2 + 60}" text-anchor="middle"
          font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="4"
          fill="#6a6c71">IMAGEN DE EJEMPLO · ${ancho}×${alto}</text>
  </svg>`;
}

await mkdir(DESTINO, { recursive: true });

for (const imagen of IMAGENES) {
  const svg = Buffer.from(dibujo(imagen));
  const jpg = await sharp(svg).jpeg({ quality: 82 }).toBuffer();
  await writeFile(resolve(DESTINO, imagen.archivo), jpg);
  console.log(`  · ${imagen.archivo}  ${imagen.ancho}×${imagen.alto}`);
}

console.log(`\nListo: ${IMAGENES.length} imágenes en src/assets/img/proyectos/ejemplo/`);
