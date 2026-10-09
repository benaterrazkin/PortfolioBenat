import type { ImageMetadata } from 'astro';
import type { Idioma } from '../i18n/idiomas';
import { anclaProyecto } from '../rutas';
import { imagen, proyectos, type Proyecto } from './index';

/* ------------------------------------------------------------------ *
 *  DE UN PROYECTO A UN CUADERNO
 *
 *  Cada proyecto trae sus hojas escritas una a una (ver "paginas" en
 *  src/data/proyectos/<idioma>.json). Aquí solo se numeran y se
 *  emparejan de dos en dos, porque el cuaderno se lee a doble página.
 *
 *  Las dos hojas de los extremos no giran nunca —son el fondo del
 *  cuaderno— y las de en medio se agrupan formando HOJAS de papel, con
 *  su anverso y su reverso:
 *
 *    caras[0]        guarda        (fija, mitad izquierda)
 *    caras[2i+1]     anverso de la hoja i
 *    caras[2i+2]     reverso de la hoja i
 *    caras[2H+1]     contraguarda  (fija, mitad derecha)
 *
 *  Con k hojas pasadas se ve: izquierda = caras[2k] · derecha = caras[2k+1].
 *  De ahí que el número de caras tenga que ser PAR.
 * ------------------------------------------------------------------ */

/** Una imagen ya resuelta, lista para <Image src={...} />. */
export interface LaminaDeCara {
  fuente: ImageMetadata;
  alt: string;
  titulo?: string;
  escala?: string;
  orientacion?: string;
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
  /**
   * El número que se escribe en la esquina de la hoja. Solo lo llevan las
   * hojas con contenido: las tapas, el cartón y las hojas en blanco no se
   * numeran, igual que en cualquier libro.
   */
  folio?: number;
}

export type Cara =
  | (Comun & {
      tipo: 'tapa';
      titulo: string;
      /** Lugar, tipo, contexto y año, en una línea. */
      claves: string[];
      /** Los programas con los que se hizo, en otra. */
      herramientas: string[];
      lamina?: LaminaDeCara;
    })
  /** La tapa trasera, por fuera: cartón y cinta, sin nada escrito. */
  | (Comun & { tipo: 'contratapa' })
  /** El cartón por dentro, en cualquiera de las dos tapas. */
  | (Comun & { tipo: 'tapa-interior' })
  | (Comun & { tipo: 'presentacion'; titulo: string; parrafos: string[] })
  | (Comun & { tipo: 'lamina'; lamina: LaminaDeCara })
  /** Hoja de papel sin nada: existe, es blanca y se pasa. */
  | (Comun & { tipo: 'blanca' })
  /**
   * No hay hoja: se ve la mesa. Es lo que hace que el libro parezca
   * cerrado. La del final lleva el botón de volver al principio, y como
   * las caras que no se ven están inertes, el botón solo existe para
   * quien de verdad ha llegado hasta ahí.
   */
  | (Comun & { tipo: 'mesa'; final?: boolean });

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
  /** El color de la cinta del lomo de este cuaderno. */
  lomo?: string;
  /** Nombre corto para los atajos del lateral: el lugar, sin más. */
  nombreCorto: string;
  portada: { fuente: ImageMetadata; alt: string };
  /** El esquema conceptual: la tapa del libro en el estante. */
  diagrama?: { fuente: ImageMetadata; alt: string };
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

/**
 * Los datos de la tapa, uno por línea. El contexto suele venir escrito
 * como "Proyectos IV · UPV/EHU", así que se parte en sus dos partes, y el
 * año se pega a la última línea en vez de ocupar una para él solo.
 */
function clavesDe(p: Proyecto): string[] {
  const lineas = [p.lugar, p.tipo, ...(p.contexto?.split('·') ?? [])]
    .filter(Boolean)
    .map((c) => (c as string).trim());

  if (lineas.length === 0) return [p.anio];
  lineas[lineas.length - 1] += ` · ${p.anio}`;
  return lineas;
}

/** Convierte un proyecto en su cuaderno. */
export function cuaderno(p: Proyecto, numero: number): Cuaderno {
  const resolver = (l: {
    archivo: string;
    alt: string;
    titulo?: string;
    escala?: string;
    orientacion?: string;
  }): LaminaDeCara => ({
    fuente: imagen(l.archivo),
    alt: l.alt,
    titulo: l.titulo,
    escala: l.escala,
    orientacion: l.orientacion,
  });

  /* Solo el contenido: lo que viene escrito en el .json del proyecto. */
  const contenido: Borrador[] = p.paginas.map((pagina) => {
    if (pagina.tipo === 'blanca') return { tipo: 'blanca' };
    if (pagina.tipo === 'presentacion') {
      return { tipo: 'presentacion', titulo: p.titulo, parrafos: p.texto };
    }
    return { tipo: 'lamina', lamina: resolver(pagina) };
  });

  /* El contenido tiene que ocupar un número par de caras para que las
   * tapas caigan donde deben. Si sale impar se añade UNA hoja en blanco
   * al final del contenido: en un cuaderno de verdad también la hay. */
  if (contenido.length % 2 !== 0) contenido.push({ tipo: 'blanca' });

  /* Y alrededor, el cuaderno: se abre enseñando la tapa sola a la derecha
   * y se cierra enseñando la tapa trasera sola a la izquierda, igual que
   * un cuaderno de verdad encima de la mesa. */
  const borrador: Borrador[] = [
    { tipo: 'mesa' },
    {
      tipo: 'tapa',
      titulo: p.titulo,
      /* Estos datos salen aquí y en ningún otro sitio del cuaderno. */
      claves: clavesDe(p),
      herramientas: p.herramientas,
      lamina: p.diagrama ? resolver(p.diagrama) : undefined,
    },
    { tipo: 'tapa-interior' },
    ...contenido,
    { tipo: 'tapa-interior' },
    { tipo: 'contratapa' },
    { tipo: 'mesa', final: true },
  ];

  /* Se numeran solo las hojas con contenido, y se cuentan desde la
   * primera: la tapa y el cartón no llevan número. */
  let folio = 0;
  const caras: Cara[] = borrador.map((b, indice) => {
    const seNumera = b.tipo === 'presentacion' || b.tipo === 'lamina';
    return { ...b, indice, folio: seNumera ? ++folio : undefined } as Cara;
  });

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
    lomo: p.lomo,
    /* El lugar hasta la primera coma: "Astigarreta, Goierri (Gipuzkoa)"
     * se queda en "Astigarreta". Es lo que hace falta en un atajo. */
    nombreCorto: p.lugar?.split(',')[0]?.trim() || p.titulo,
    portada: { fuente: imagen(p.portada.archivo), alt: p.portada.alt },
    diagrama: p.diagrama ? { fuente: imagen(p.diagrama.archivo), alt: p.diagrama.alt } : undefined,
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
