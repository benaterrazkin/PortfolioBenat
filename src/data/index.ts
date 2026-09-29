import { z } from 'zod';
import type { ImageMetadata } from 'astro';
import { IDIOMAS_PUBLICADOS, type Idioma } from '../i18n/idiomas';

/* ------------------------------------------------------------------ *
 *  CONTENIDO DE LA WEB
 *
 *  Todo el contenido vive en archivos .json dentro de esta carpeta,
 *  uno por idioma. Cada archivo se comprueba al compilar: si falta un
 *  dato obligatorio o una foto no existe, la web NO se publica y el
 *  error dice exactamente qué archivo y qué campo hay que arreglar.
 * ------------------------------------------------------------------ */

const Imagen = z.object({
  /** Ruta dentro de src/assets/img/, por ejemplo "proyectos/casa-ur/planta.jpg". */
  archivo: z.string().min(1),
  /** Descripción de la imagen para quien no puede verla. Obligatoria. */
  alt: z.string().min(3),
  /** Pie de imagen visible. Opcional. */
  pie: z.string().optional(),
});
export type Imagen = z.infer<typeof Imagen>;

const Proyecto = z.object({
  /**
   * Identificador del proyecto. Es lo que aparece en la dirección de la
   * ficha (/es/proyectos/<id>/) y DEBE ser idéntico en los cuatro idiomas:
   * así el selector de idioma no pierde la página en la que estabas.
   * Solo minúsculas, números y guiones.
   */
  id: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  /** Frase corta que acompaña al título en el listado. */
  subtitulo: z.string().optional(),
  anio: z.string().min(4),
  lugar: z.string().optional(),
  tipo: z.string().optional(),
  /** Asignatura, estudio o concurso en el que se hizo. */
  contexto: z.string().optional(),
  herramientas: z.array(z.string()).default([]),
  /** El texto breve del proyecto. Un párrafo por elemento de la lista. */
  texto: z.array(z.string()).default([]),
  /** Imagen que representa al proyecto en el listado. */
  portada: Imagen,
  /** Las demás imágenes, en el orden en el que se quieren ver. */
  imagenes: z.array(Imagen).default([]),
  /** Los proyectos se ordenan por este número, de menor a mayor. */
  orden: z.number().int().default(99),
});
export type Proyecto = z.infer<typeof Proyecto>;

/* ------------------------------------------------------------------ *
 *  Currículum
 *
 *  Se escribe entero en cada idioma, incluidas las fechas, para que la
 *  traducción sea un simple "copiar el archivo y traducir el texto".
 *  Los datos de contacto NO se repiten aquí: salen de config/sitio.ts.
 * ------------------------------------------------------------------ */

const EtapaCV = z.object({
  periodo: z.string().min(1),
  puesto: z.string().min(1),
  entidad: z.string().min(1),
  lugar: z.string().optional(),
  detalle: z.string().optional(),
  puntos: z.array(z.string()).default([]),
});
export type EtapaCV = z.infer<typeof EtapaCV>;

const EstudioCV = z.object({
  periodo: z.string().min(1),
  titulo: z.string().min(1),
  centro: z.string().min(1),
  nota: z.string().optional(),
});
export type EstudioCV = z.infer<typeof EstudioCV>;

const DatosCV = z.object({
  titular: z.string().min(1),
  resumen: z.string().min(1),
  secciones: z.object({
    perfil: z.string().min(1),
    experiencia: z.string().min(1),
    estudios: z.string().min(1),
    programas: z.string().min(1),
    habilidades: z.string().min(1),
    idiomas: z.string().min(1),
    otros: z.string().min(1),
    contacto: z.string().min(1),
  }),
  experiencia: z.array(EtapaCV).default([]),
  estudios: z.array(EstudioCV).default([]),
  programas: z.array(z.string()).default([]),
  habilidades: z.array(z.string()).default([]),
  idiomas: z.array(z.object({ lengua: z.string().min(1), nivel: z.string().min(1) })).default([]),
  otros: z.array(z.object({ etiqueta: z.string().min(1), valor: z.string().min(1) })).default([]),
});
export type DatosCV = z.infer<typeof DatosCV>;

/* ------------------------------------------------------------------ *
 *  Carga y comprobación
 * ------------------------------------------------------------------ */

type Mapa = Record<string, unknown>;

function idiomaDelArchivo(ruta: string): string {
  return ruta.split('/').pop()!.replace('.json', '');
}

function cargar<T>(mapa: Mapa, esquema: z.ZodType<T>, carpeta: string): Record<Idioma, T> {
  const salida = {} as Record<Idioma, T>;

  for (const [ruta, contenido] of Object.entries(mapa)) {
    const idioma = idiomaDelArchivo(ruta) as Idioma;
    const revisado = esquema.safeParse(contenido);
    if (!revisado.success) {
      const detalles = revisado.error.issues
        .map((p) => `  · ${p.path.join(' → ') || '(raíz)'}: ${p.message}`)
        .join('\n');
      throw new Error(
        `\n\nHay un error en el archivo de contenido src/data/${carpeta}/${idioma}.json:\n${detalles}\n`,
      );
    }
    salida[idioma] = revisado.data;
  }

  for (const idioma of IDIOMAS_PUBLICADOS) {
    if (!(idioma in salida)) {
      throw new Error(
        `\n\nFalta el archivo src/data/${carpeta}/${idioma}.json. ` +
          `El idioma "${idioma}" está en la lista de idiomas publicados, así que necesita su contenido.\n`,
      );
    }
  }

  return salida;
}

const cargarJson = (patron: Mapa) => patron;

export const PROYECTOS = cargar(
  cargarJson(import.meta.glob('./proyectos/*.json', { eager: true, import: 'default' })),
  z.array(Proyecto),
  'proyectos',
);

export const CV = cargar(
  cargarJson(import.meta.glob('./cv/*.json', { eager: true, import: 'default' })),
  DatosCV,
  'cv',
);

/* Los proyectos tienen que ser los mismos en todos los idiomas: si no, el
 * selector de idioma llevaría a una dirección que no existe. */
{
  const referencia = PROYECTOS[IDIOMAS_PUBLICADOS[0]].map((p) => p.id).sort();
  for (const idioma of IDIOMAS_PUBLICADOS) {
    const suyos = PROYECTOS[idioma].map((p) => p.id).sort();
    if (suyos.join('|') !== referencia.join('|')) {
      throw new Error(
        `\n\nLos proyectos de src/data/proyectos/${idioma}.json no coinciden con los de ` +
          `${IDIOMAS_PUBLICADOS[0]}.json.\n` +
          `  ${IDIOMAS_PUBLICADOS[0]}: ${referencia.join(', ') || '(ninguno)'}\n` +
          `  ${idioma}: ${suyos.join(', ') || '(ninguno)'}\n` +
          `Cada proyecto debe existir en los cuatro idiomas y con el mismo "id".\n`,
      );
    }
  }
}

/* ------------------------------------------------------------------ *
 *  Imágenes
 *  Se guardan en src/assets/img/ y en los .json se escribe solo su
 *  nombre. Astro las optimiza y genera los tamaños necesarios.
 * ------------------------------------------------------------------ */

const IMAGENES = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/img/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export function imagen(archivo: string): ImageMetadata {
  const clave = `../assets/img/${archivo.replace(/^\/+/, '')}`;
  const encontrada = IMAGENES[clave];
  if (!encontrada) {
    const disponibles = Object.keys(IMAGENES)
      .map((r) => `  · ${r.replace('../assets/img/', '')}`)
      .sort()
      .join('\n');
    throw new Error(
      `\n\nNo existe la imagen "src/assets/img/${archivo}".\n` +
        `Revisa que el nombre del archivo esté bien escrito.\nImágenes disponibles:\n${disponibles}\n`,
    );
  }
  return encontrada.default;
}

/** Proyectos de un idioma, ya ordenados. */
export function proyectos(idioma: Idioma): Proyecto[] {
  return [...PROYECTOS[idioma]].sort((a, b) => a.orden - b.orden || a.titulo.localeCompare(b.titulo));
}

/** Un proyecto concreto. */
export function proyecto(id: string, idioma: Idioma): Proyecto {
  const encontrado = PROYECTOS[idioma].find((p) => p.id === id);
  if (!encontrado) throw new Error(`No existe el proyecto "${id}" en el idioma "${idioma}".`);
  return encontrado;
}

/** Currículum de un idioma. */
export function curriculum(idioma: Idioma): DatosCV {
  return CV[idioma];
}
