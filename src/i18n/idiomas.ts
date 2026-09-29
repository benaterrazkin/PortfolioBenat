export const IDIOMAS = ['es', 'en', 'eu', 'ca'] as const;
export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_POR_DEFECTO: Idioma = 'es';

/* ------------------------------------------------------------------ *
 *  IDIOMAS PUBLICADOS
 *
 *  Solo los idiomas de esta lista se generan y aparecen en el selector.
 *  Para publicar un idioma nuevo cuando sus textos estén revisados,
 *  basta con añadirlo aquí. Nada más.
 * ------------------------------------------------------------------ */
export const IDIOMAS_PUBLICADOS: readonly Idioma[] = ['es', 'en', 'eu', 'ca'];

/** Idioma al que se envía a quien llega sin idioma en la dirección. */
export const IDIOMA_DE_RESERVA: Idioma = 'en';

export const NOMBRE_IDIOMA: Record<Idioma, string> = {
  es: 'Español',
  en: 'English',
  eu: 'Euskara',
  ca: 'Català',
};

/** Etiqueta corta para el selector compacto. */
export const SIGLA_IDIOMA: Record<Idioma, string> = {
  es: 'ES',
  en: 'EN',
  eu: 'EU',
  ca: 'CA',
};

/** Código completo para el atributo lang y para hreflang. */
export const CODIGO_HREFLANG: Record<Idioma, string> = {
  es: 'es-ES',
  en: 'en',
  eu: 'eu-ES',
  ca: 'ca-ES',
};

export function esIdioma(valor: string | undefined): valor is Idioma {
  return !!valor && (IDIOMAS as readonly string[]).includes(valor);
}
