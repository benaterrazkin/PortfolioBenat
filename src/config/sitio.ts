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
  anioInicio: number;
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
   * PENDIENTE: darse de alta en https://web3forms.com con el correo de Beñat
   * y pegar aquí la clave que llega por email.
   */
  claveFormulario: '',

  /** Primer año de actividad; se usa en el pie de página. */
  anioInicio: 2025,
};
