/* ------------------------------------------------------------------ *
 *  EL PORTFOLIO EN PDF: QUÉ ENTRA Y CÓMO SE MAQUETA
 *
 *  La web enseña todos los proyectos; el PDF que se manda a los estudios
 *  solo los de esta lista, en este orden. Se maqueta por PLIEGOS (dos A4
 *  apaisados uno al lado del otro), y aquí se dice qué va en cada uno.
 *
 *  Las láminas se nombran por su archivo, dentro de la carpeta del
 *  proyecto. El título, la escala y el texto alternativo salen del .json
 *  del proyecto en cada idioma: aquí no se traduce nada.
 *
 *  Formatos de pliego:
 *    · apertura       → texto y ficha a la izquierda; la portada del
 *                       proyecto a sangre a la derecha. Va siempre primero
 *                       y la pone el generador solo: no hay que escribirla.
 *    · sangre         → una imagen a sangre sobre las dos páginas. Con
 *                       `entera: true` no se recorta: ocupa todo el alto,
 *                       pegada a la derecha, y deja un margen blanco con el
 *                       título a la izquierda (para vistas que no se pueden
 *                       cortar, como la iglesia de Gubin con su torre).
 *    · dibujo         → un dibujo muy apaisado centrado sobre las dos
 *                       páginas, con márgenes y cajetín (secciones largas).
 *    · par            → una lámina en cada página, en caja con cajetín.
 *
 *  Regla de la casa: además de la apertura, como mucho UNA imagen grande
 *  (sangre) por proyecto. El resto, en caja.
 * ------------------------------------------------------------------ */

export type Pliego =
  | { formato: 'sangre'; archivo: string; entera?: boolean }
  | { formato: 'dibujo'; archivo: string }
  | { formato: 'par'; izq: string; der: string };

export interface ProyectoPortfolio {
  /** El "id" del proyecto en src/data/proyectos/*.json. */
  id: string;
  pliegos: Pliego[];
}

export const PORTFOLIO: ProyectoPortfolio[] = [
  {
    id: 'tfg',
    pliegos: [
      { formato: 'par', izq: 'emplazamiento.webp', der: 'situacion.webp' },
      { formato: 'par', izq: 'axonometrica.webp', der: 'lamina-12.webp' },
      { formato: 'par', izq: 'lamina-13.webp', der: 'seccion-1.webp' },
      { formato: 'par', izq: 'lamina-09.webp', der: 'lamina-11.webp' },
      /* Rejilla de 2×2 vistas: el pliegue cae entre las dos columnas. */
      { formato: 'dibujo', archivo: 'vistas-interiores.webp' },
    ],
  },
  {
    id: 'astigarreta',
    pliegos: [
      { formato: 'par', izq: 'emplazamiento.webp', der: 'planta-conjunto.webp' },
      { formato: 'dibujo', archivo: 'seccion-bb.webp' },
      { formato: 'dibujo', archivo: 'seccion-aa.webp' },
    ],
  },
  {
    id: 'urbanismo',
    pliegos: [
      { formato: 'par', izq: 'analisis-1.webp', der: 'analisis-2.webp' },
      { formato: 'par', izq: 'referencias.webp', der: 'vista-2.webp' },
      { formato: 'sangre', archivo: 'vista-3.webp' },
    ],
  },
  {
    id: 'eliza-reforma',
    pliegos: [
      { formato: 'sangre', archivo: 'vista-general.webp', entera: true },
      { formato: 'par', izq: 'planta-1.webp', der: 'planta-4.webp' },
      { formato: 'par', izq: 'seccion-1.webp', der: 'seccion-2.webp' },
      { formato: 'par', izq: 'vista-1.webp', der: 'vista-5.webp' },
    ],
  },
];
