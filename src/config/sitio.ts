/* ------------------------------------------------------------------ *
 *  DATOS DE CONTACTO Y AJUSTES GENERALES
 *  Este es el archivo que hay que revisar antes de publicar.
 * ------------------------------------------------------------------ */

interface DatosSitio {
  nombre: string;
  /** Cómo firma profesionalmente; se usa en el currículum. */
  nombreCompleto: string;
  correo: string;
  telefono: string;
  telefonoEnlace: string;
  instagram: string;
  linkedin: string;
  ubicacion: string;
  claveFormulario: string;
  /** Programas que maneja; salen en la portada de la web y en el portfolio. */
  programas: string[];
  anioInicio: number;
  /** Quién ha hecho la web. Aparece en el pie. */
  creadora: { nombre: string; correo: string };
}

export const SITIO: DatosSitio = {
  nombre: 'Beñat Errazkin',
  nombreCompleto: 'Beñat Errazkin Bermejo',

  /**
   * Correo de contacto. Se usa en toda la web: página de contacto, pie y
   * currículum. Cambiarlo aquí lo cambia en los cuatro idiomas de golpe.
   *
   * (El PDF antiguo del currículum llevaba benaterrazkin2@gmail.com; el bueno
   *  es este.)
   */
  correo: 'benaterrazkin224@gmail.com',

  /**
   * Teléfono. Se deja vacío a propósito: Beñat no quiere su número a la vista
   * en una web pública, donde lo recogen los rastreadores de spam. Mientras
   * esté vacío no aparece en ningún sitio: ni en la página de contacto, ni en
   * el pie, ni en el currículum.
   *
   * Para volver a mostrarlo basta con escribirlo en las dos líneas de abajo:
   *     telefono: '+34 688 89 02 66',
   *     telefonoEnlace: '+34688890266',
   */
  telefono: '',
  /** El mismo teléfono sin espacios: es lo que marca el móvil al pulsarlo. */
  telefonoEnlace: '',

  /** PENDIENTE: dirección de su perfil de Instagram. Déjalo vacío para ocultarlo. */
  instagram: '',

  /** PENDIENTE: dirección de su perfil de LinkedIn. Déjalo vacío para ocultarlo. */
  linkedin: '',

  /** Ciudad y país de residencia actual. */
  ubicacion: 'Barcelona, España',

  /**
   * Clave del formulario de contacto (Web3Forms, gratuito).
   *
   * Es pública a propósito: viaja en el HTML de la web y lo único que permite
   * es enviar un mensaje al correo de arriba. Si se deja vacía, el formulario
   * avisa de que no está configurado y ofrece escribir directamente al correo.
   *
   * Web3Forms entrega SOLO a la dirección con la que se creó la clave.
   * Esta está dada de alta con benaterrazkin224@gmail.com (confirmado por
   * Beñat), así que los mensajes llegan al correo de arriba.
   */
  claveFormulario: 'bf8d2e16-9538-4132-82c9-5d3ce0c37ecd',

  programas: ['AutoCAD', 'Rhino', 'Revit', 'D5', 'Adobe'],

  /** Primer año de actividad; se usa en el pie de página. */
  anioInicio: 2025,

  /** Quién ha hecho la web. Aparece en el pie. */
  creadora: {
    nombre: 'Julia Fernández Bermejo',
    correo: 'juliafernandezbermejo@gmail.com',
  },
};
