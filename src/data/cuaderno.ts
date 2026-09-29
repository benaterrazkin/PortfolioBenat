import type { ImageMetadata } from 'astro';
import type { Idioma } from '../i18n/idiomas';
import { anclaProyecto } from '../rutas';
import { imagen, proyectos, type Proyecto } from './index';

/* ------------------------------------------------------------------ *
 *  DE UN PROYECTO A UN CUADERNO
 *
 *  Los proyectos se enseñan como cuadernos abiertos que se pasan hoja a
 *  hoja. Aquí se decide, siempre de la misma manera, qué va en cada cara.
 *  Quien escribe el contenido no tiene que pensar en esto: le basta con
 *  poner las imágenes en el orden en que quiere que se vean.
 *
 *  Un cuaderno es una lista de CARAS. Las dos de los extremos no giran
 *  nunca —son el fondo del cuaderno— y las de en medio se agrupan de dos
 *  en dos formando HOJAS de papel, con su anverso y su reverso:
 *
 *    caras[0]        guarda        (fija, mitad izquierda)
 *    caras[2i+1]     anverso de la hoja i
 *    caras[2i+2]     reverso de la hoja i
 *    caras[2H+1]     contraguarda  (fija, mitad derecha)
 *
 *  Con k hojas pasadas se ve: izquierda = caras[2k] · derecha = caras[2k+1].
 *  De ahí que el número de caras tenga que ser PAR.
 * ------------------------------------------------------------------ */

/** Cuántas letras de texto caben, como mucho, en una cara. */
const LETRAS_POR_CARA = 1400;

/** Una imagen ya resuelta, lista para <Image src={...} />. */
export interface ImagenDeCara {
  fuente: ImageMetadata;
  alt: string;
  pie?: string;
}

/** Los datos del cajetín. Mismos nombres que t.proyectos.ficha. */
export interface Ficha {
  anio: string;
  lugar?: string;
  tipo?: string;
  contexto?: string;
  herramientas: string[];
}

interface Comun {
  /** Posición dentro del cuaderno, empezando en 0 por la guarda. */
  indice: number;
}

export type Cara =
  | (Comun & { tipo: 'portadilla'; titulo: string; subtitulo?: string; ficha: Ficha })
  | (Comun & { tipo: 'texto'; parrafos: string[] })
  | (Comun & { tipo: 'imagen'; imagen: ImagenDeCara; numero: number; esPortada: boolean })
  | (Comun & { tipo: 'blanca' })
  | (Comun & { tipo: 'cierre'; titulo: string; anio: string });

export interface Hoja {
  /** Número de hoja, empezando en 0. Es lo que el CSS usa como --i. */
  numero: number;
  anverso: Cara;
  reverso: Cara;
}

export interface Cuaderno {
  id: string;
  /** Posición del cuaderno dentro del scroll, empezando en 1. */
  numero: number;
  titulo: string;
  subtitulo?: string;
  anio: string;
  /** Identificador del ancla: #cuaderno-<id> */
  ancla: string;
  portada: ImagenDeCara;
  /** Todas las caras en orden de lectura. Siempre son un número par. */
  caras: Cara[];
  guarda: Cara;
  contraguarda: Cara;
  /** Las caras de en medio, emparejadas en hojas de papel. */
  hojas: Hoja[];
}

/* Cara es una unión, y Omit sobre una unión la aplasta: hay que repartirlo
 * a mano para que cada variante conserve sus campos. */
type SinIndice<T> = T extends unknown ? Omit<T, 'indice'> : never;
type Borrador = SinIndice<Cara>;

/** Agrupa los párrafos en tandas que quepan en una cara. */
function trocearTexto(parrafos: string[]): string[][] {
  const tandas: string[][] = [];
  let actual: string[] = [];
  let letras = 0;

  for (const parrafo of parrafos) {
    if (actual.length > 0 && letras + parrafo.length > LETRAS_POR_CARA) {
      tandas.push(actual);
      actual = [];
      letras = 0;
    }
    actual.push(parrafo);
    letras += parrafo.length;
  }
  if (actual.length > 0) tandas.push(actual);
  return tandas;
}

/** Convierte un proyecto en su cuaderno. */
export function cuaderno(p: Proyecto, numero: number): Cuaderno {
  const portada: ImagenDeCara = {
    fuente: imagen(p.portada.archivo),
    alt: p.portada.alt,
    pie: p.portada.pie,
  };

  /* Primero, qué caras hay y en qué orden. */
  const borrador: Borrador[] = [
    {
      tipo: 'portadilla',
      titulo: p.titulo,
      subtitulo: p.subtitulo,
      ficha: {
        anio: p.anio,
        lugar: p.lugar,
        tipo: p.tipo,
        contexto: p.contexto,
        herramientas: p.herramientas,
      },
    },
    { tipo: 'imagen', imagen: portada, numero: 0, esPortada: true },
    ...trocearTexto(p.texto).map((parrafos) => ({ tipo: 'texto' as const, parrafos })),
    ...p.imagenes.map((im, i) => ({
      tipo: 'imagen' as const,
      imagen: { fuente: imagen(im.archivo), alt: im.alt, pie: im.pie },
      numero: i + 1,
      esPortada: false,
    })),
  ];

  /* El cierre va siempre el último, y entre medias puede hacer falta una
   * cara en blanco para que las cuentas cuadren: un cuaderno no puede
   * acabar a media doble página. En un cuaderno de verdad esa página
   * vacía también existe, así que no desentona. */
  const cierre: Borrador = { tipo: 'cierre', titulo: p.titulo, anio: p.anio };
  if ((borrador.length + 1) % 2 !== 0) borrador.push({ tipo: 'blanca' });
  borrador.push(cierre);

  const caras: Cara[] = borrador.map((b, indice) => ({ ...b, indice }) as Cara);

  /* Las caras de en medio se emparejan: cada pareja es una hoja de papel. */
  const hojas: Hoja[] = [];
  for (let i = 1; i < caras.length - 1; i += 2) {
    hojas.push({ numero: hojas.length, anverso: caras[i]!, reverso: caras[i + 1]! });
  }

  return {
    id: p.id,
    numero,
    titulo: p.titulo,
    subtitulo: p.subtitulo,
    anio: p.anio,
    ancla: anclaProyecto(p.id),
    portada,
    caras,
    guarda: caras[0]!,
    contraguarda: caras[caras.length - 1]!,
    hojas,
  };
}

/** Todos los cuadernos de un idioma, en el orden en que se ven. */
export function cuadernos(idioma: Idioma): Cuaderno[] {
  return proyectos(idioma).map((p, i) => cuaderno(p, i + 1));
}
