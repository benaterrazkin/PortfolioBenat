import { IDIOMAS_PUBLICADOS, type Idioma } from './i18n/idiomas';

/**
 * Cada página tiene una dirección propia en cada idioma, para que la URL se
 * lea de forma natural en el idioma de quien visita la web.
 *   proyectos → /es/proyectos · /en/projects · /eu/proiektuak · /ca/projectes
 *
 * La clave (izquierda) es interna y nunca cambia. Los valores son públicos.
 */
export const PAGINAS = {
  inicio: { es: '', en: '', eu: '', ca: '' },
  proyectos: { es: 'proyectos', en: 'projects', eu: 'proiektuak', ca: 'projectes' },
  contacto: { es: 'contacto', en: 'contact', eu: 'kontaktua', ca: 'contacte' },
  privacidad: { es: 'privacidad', en: 'privacy', eu: 'pribatutasuna', ca: 'privacitat' },
} as const satisfies Record<string, Record<Idioma, string>>;

export type ClavePagina = keyof typeof PAGINAS;

/** Secciones que aparecen en el menú, en este orden. */
export const MENU: ClavePagina[] = ['proyectos', 'contacto'];

const BASE = import.meta.env.BASE_URL;

/** Une la base de la web con un trozo de dirección, sin barras dobles. */
function juntar(...trozos: string[]): string {
  const camino = [BASE, ...trozos]
    .join('/')
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '');
  return `${camino}/`;
}

/** Dirección de una página en un idioma. Ej.: ruta('proyectos', 'eu') */
export function ruta(pagina: ClavePagina, idioma: Idioma): string {
  return juntar(idioma, PAGINAS[pagina][idioma]);
}

/** Dirección de la ficha de un proyecto. Ej.: rutaProyecto('casa-ur', 'en') */
export function rutaProyecto(id: string, idioma: Idioma): string {
  return juntar(idioma, PAGINAS.proyectos[idioma], id);
}

/** Dirección de un archivo de la carpeta public/. Ej.: recurso('favicon.svg') */
export function recurso(archivo: string): string {
  return `${BASE.replace(/\/$/, '')}/${archivo.replace(/^\/+/, '')}`;
}

/** Todas las combinaciones de idioma y sección que hay que generar. */
export function todasLasRutas() {
  const salida: { idioma: Idioma; pagina: ClavePagina; trozo: string }[] = [];
  for (const idioma of IDIOMAS_PUBLICADOS) {
    for (const pagina of Object.keys(PAGINAS) as ClavePagina[]) {
      salida.push({ idioma, pagina, trozo: PAGINAS[pagina][idioma] });
    }
  }
  return salida;
}
