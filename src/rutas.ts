import type { Idioma } from './i18n/idiomas';

/**
 * La web es una sola página por idioma: se baja desde el nombre de Beñat
 * hasta los proyectos y, al final, el contacto. Solo el aviso legal vive
 * aparte, con su dirección traducida para que se lea de forma natural.
 *
 *   /es/ · /en/ · /eu/ · /ca/
 *   /es/privacidad/ · /en/privacy/ · /eu/pribatutasuna/ · /ca/privacitat/
 *
 * La clave (izquierda) es interna y nunca cambia. Los valores son públicos.
 */
export const PAGINAS = {
  inicio: { es: '', en: '', eu: '', ca: '' },
  privacidad: { es: 'privacidad', en: 'privacy', eu: 'pribatutasuna', ca: 'privacitat' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type ClavePagina = keyof typeof PAGINAS;

/**
 * Las secciones de la portada a las que lleva el menú.
 *
 * El nombre del ancla NO se traduce, a propósito: así, al cambiar de
 * idioma, se puede arrastrar tal cual sin ninguna tabla de equivalencias.
 * Las anclas no salen en buscadores, así que no se pierde nada.
 */
export const SECCIONES = ['proyectos', 'contacto'] as const;
export type ClaveSeccion = (typeof SECCIONES)[number];

const BASE = import.meta.env.BASE_URL;

/** Une la base de la web con un trozo de dirección, sin barras dobles. */
function juntar(...trozos: string[]): string {
  const camino = [BASE, ...trozos]
    .join('/')
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '');
  return `${camino}/`;
}

/** Dirección de una página en un idioma. Ej.: ruta('privacidad', 'eu') */
export function ruta(pagina: ClavePagina, idioma: Idioma): string {
  return juntar(idioma, PAGINAS[pagina][idioma]);
}

/**
 * Dirección de una sección de la portada. Devuelve la dirección completa
 * (/es/#contacto) y no solo el ancla, para que el menú también funcione
 * desde la página del aviso legal.
 */
export function rutaSeccion(seccion: ClaveSeccion, idioma: Idioma): string {
  return `${ruta('inicio', idioma)}#${seccion}`;
}

/** Identificador del ancla de un proyecto. Se escribe en un solo sitio. */
export function anclaProyecto(id: string): string {
  return `cuaderno-${id}`;
}

/** Dirección de un archivo de la carpeta public/. Ej.: recurso('favicon.svg') */
export function recurso(archivo: string): string {
  return `${BASE.replace(/\/$/, '')}/${archivo.replace(/^\/+/, '')}`;
}
