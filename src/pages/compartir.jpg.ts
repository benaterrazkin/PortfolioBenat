import type { APIRoute } from 'astro';
import { join } from 'node:path';
import sharp from 'sharp';
import { PORTFOLIO } from '../data/portfolio';
import { proyecto } from '../data';

/* ------------------------------------------------------------------ *
 *  LA IMAGEN QUE SALE AL COMPARTIR EL ENLACE
 *
 *  WhatsApp, LinkedIn, el correo… enseñan esta imagen junto al título de
 *  la web. 1200×630, el tamaño que piden todos: a la izquierda la foto de
 *  Beñat y a la derecha la portada del primer proyecto del portfolio.
 *
 *  Va sin texto a propósito: el nombre y "Arquitecto" ya los pone cada
 *  aplicación debajo, con el título de la página.
 *
 *  Resultado: /compartir.jpg
 * ------------------------------------------------------------------ */

const ANCHO = 1200;
const ALTO = 630;
const FOTO = 520;

const img = (archivo: string) => join(process.cwd(), 'src/assets/img', archivo);

export const GET: APIRoute = async () => {
  const foto = await sharp(img('foto-benat.jpg'))
    .extract({ left: 0, top: 330, width: 996, height: 1100 })
    .resize(FOTO, ALTO, { fit: 'cover', position: 'top' })
    .toBuffer();

  const primero = proyecto(PORTFOLIO[0]!.id, 'es');
  const obra = await sharp(img(primero.portada.archivo))
    .resize(ANCHO - FOTO, ALTO, { fit: 'cover' })
    .toBuffer();

  const salida = await sharp({ create: { width: ANCHO, height: ALTO, channels: 3, background: '#fbfaf8' } })
    .composite([
      { input: foto, left: 0, top: 0 },
      { input: obra, left: FOTO, top: 0 },
    ])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();

  return new Response(new Uint8Array(salida), { headers: { 'Content-Type': 'image/jpeg' } });
};
