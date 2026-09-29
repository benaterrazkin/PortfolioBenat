import type { Idioma } from './idiomas';

/* ------------------------------------------------------------------ *
 *  TEXTOS DE LA INTERFAZ
 *
 *  El español es el original: define qué textos existen. Los demás
 *  idiomas están obligados a tener exactamente los mismos, así que si
 *  se añade uno nuevo aquí arriba, TypeScript avisa de los que faltan.
 * ------------------------------------------------------------------ */

const es = {
  general: {
    menu: 'Menú',
    cambiarIdioma: 'Cambiar de idioma',
    saltarAlContenido: 'Saltar al contenido',
    cerrar: 'Cerrar',
    anterior: 'Anterior',
    siguiente: 'Siguiente',
    volver: 'Volver a proyectos',
    revisionPendiente: 'Esta traducción está pendiente de revisión.',
  },
  nav: {
    inicio: 'Inicio',
    proyectos: 'Proyectos',
    contacto: 'Contacto',
    privacidad: 'Aviso legal',
  },
  inicio: {
    rotulo: 'Arquitecto',
    entradilla:
      'Arquitecto recién titulado por la UPV/EHU, cursando el máster habilitante en la ETSAB. Trabajo el proyecto desde el dibujo, el modelado tridimensional y la construcción, con atención al lugar y al impacto de lo que se construye.',
    verProyectos: 'Ver proyectos',
    contacto: 'Contacto',
    cv: 'CV',
    ubicacion: 'Con base en',
  },
  proyectos: {
    titulo: 'Proyectos',
    entradilla: 'Selección de trabajos académicos y profesionales.',
    vacio: 'Todavía no hay proyectos publicados. Pronto habrá novedades.',
    ver: 'Ver proyecto',
    galeria: 'Imágenes del proyecto',
    ampliar: 'Ampliar imagen',
    imagenDe: 'Imagen {n} de {total}',
    unaImagen: '1 imagen',
    variasImagenes: '{n} imágenes',
    ficha: {
      anio: 'Año',
      lugar: 'Lugar',
      tipo: 'Tipo',
      contexto: 'Contexto',
      herramientas: 'Herramientas',
    },
  },
  cv: {
    abrir: 'CV',
    titulo: 'Currículum',
    idiomaDelCV: 'Idioma del currículum',
    imprimir: 'Imprimir',
    nota: 'Este currículum se genera desde la propia web, así que está siempre al día.',
  },
  contacto: {
    titulo: 'Contacto',
    entradilla:
      'Disponible para colaboraciones, prácticas y propuestas de trabajo. Escríbeme y te respondo.',
    formularioTitulo: 'Escríbeme',
    directoTitulo: 'Directo',
    correo: 'Correo',
    telefono: 'Teléfono',
    ubicacion: 'Ubicación',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    nombre: 'Nombre',
    email: 'Correo electrónico',
    organizacion: 'Estudio u organización',
    opcional: 'opcional',
    mensaje: 'Mensaje',
    enviar: 'Enviar mensaje',
    enviando: 'Enviando…',
    exito: 'Mensaje enviado. Gracias por escribir: te responderé lo antes posible.',
    error: 'No se ha podido enviar el mensaje. Escribe directamente a {correo}.',
    obligatorio: 'Este campo es obligatorio.',
    avisoDatos: 'Tus datos solo se usan para responderte.',
    leerPrivacidad: 'Leer el aviso legal',
  },
  pie: {
    derechos: 'Todos los derechos reservados.',
    rotulo: 'Portfolio de arquitectura',
  },
  meta: {
    inicio: {
      titulo: 'Arquitecto',
      descripcion:
        'Portfolio de Beñat Errazkin Bermejo, arquitecto por la UPV/EHU. Proyectos de arquitectura, dibujo y modelado tridimensional.',
    },
    proyectos: {
      titulo: 'Proyectos',
      descripcion: 'Proyectos de arquitectura de Beñat Errazkin Bermejo.',
    },
    contacto: {
      titulo: 'Contacto',
      descripcion: 'Escribe a Beñat Errazkin Bermejo, arquitecto con base en Barcelona.',
    },
    privacidad: {
      titulo: 'Aviso legal',
      descripcion: 'Aviso legal y tratamiento de datos de esta web.',
    },
  },
};

type Textos = typeof es;

const en: Textos = {
  general: {
    menu: 'Menu',
    cambiarIdioma: 'Change language',
    saltarAlContenido: 'Skip to content',
    cerrar: 'Close',
    anterior: 'Previous',
    siguiente: 'Next',
    volver: 'Back to projects',
    revisionPendiente: 'This translation is pending review.',
  },
  nav: {
    inicio: 'Home',
    proyectos: 'Projects',
    contacto: 'Contact',
    privacidad: 'Legal notice',
  },
  inicio: {
    rotulo: 'Architect',
    entradilla:
      'Architect, recently graduated from the UPV/EHU and currently taking the professional master at ETSAB. I work on projects through drawing, three-dimensional modelling and construction, with attention to the site and to the impact of what gets built.',
    verProyectos: 'View projects',
    contacto: 'Contact',
    cv: 'CV',
    ubicacion: 'Based in',
  },
  proyectos: {
    titulo: 'Projects',
    entradilla: 'A selection of academic and professional work.',
    vacio: 'No projects published yet. New work coming soon.',
    ver: 'View project',
    galeria: 'Project images',
    ampliar: 'Enlarge image',
    imagenDe: 'Image {n} of {total}',
    unaImagen: '1 image',
    variasImagenes: '{n} images',
    ficha: {
      anio: 'Year',
      lugar: 'Location',
      tipo: 'Type',
      contexto: 'Context',
      herramientas: 'Tools',
    },
  },
  cv: {
    abrir: 'CV',
    titulo: 'Curriculum vitae',
    idiomaDelCV: 'CV language',
    imprimir: 'Print',
    nota: 'This CV is generated by the website itself, so it is always up to date.',
  },
  contacto: {
    titulo: 'Contact',
    entradilla:
      'Available for collaborations, internships and job offers. Write to me and I will get back to you.',
    formularioTitulo: 'Write to me',
    directoTitulo: 'Direct',
    correo: 'Email',
    telefono: 'Phone',
    ubicacion: 'Location',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    nombre: 'Name',
    email: 'Email address',
    organizacion: 'Studio or organisation',
    opcional: 'optional',
    mensaje: 'Message',
    enviar: 'Send message',
    enviando: 'Sending…',
    exito: 'Message sent. Thanks for writing: I will reply as soon as possible.',
    error: 'The message could not be sent. Please write directly to {correo}.',
    obligatorio: 'This field is required.',
    avisoDatos: 'Your details are only used to reply to you.',
    leerPrivacidad: 'Read the legal notice',
  },
  pie: {
    derechos: 'All rights reserved.',
    rotulo: 'Architecture portfolio',
  },
  meta: {
    inicio: {
      titulo: 'Architect',
      descripcion:
        'Portfolio of Beñat Errazkin Bermejo, architect (UPV/EHU). Architecture projects, drawing and three-dimensional modelling.',
    },
    proyectos: {
      titulo: 'Projects',
      descripcion: 'Architecture projects by Beñat Errazkin Bermejo.',
    },
    contacto: {
      titulo: 'Contact',
      descripcion: 'Write to Beñat Errazkin Bermejo, architect based in Barcelona.',
    },
    privacidad: {
      titulo: 'Legal notice',
      descripcion: 'Legal notice and data processing for this website.',
    },
  },
};

const eu: Textos = {
  general: {
    menu: 'Menua',
    cambiarIdioma: 'Hizkuntza aldatu',
    saltarAlContenido: 'Edukira joan',
    cerrar: 'Itxi',
    anterior: 'Aurrekoa',
    siguiente: 'Hurrengoa',
    volver: 'Proiektuetara itzuli',
    revisionPendiente: 'Itzulpen hau berrikusteke dago.',
  },
  nav: {
    inicio: 'Hasiera',
    proyectos: 'Proiektuak',
    contacto: 'Kontaktua',
    privacidad: 'Lege oharra',
  },
  inicio: {
    rotulo: 'Arkitektoa',
    entradilla:
      'UPV/EHUn arkitektura ikasi berri duen arkitektoa, gaur egun ETSABeko master gaitzailea egiten. Proiektua marrazketatik, hiru dimentsioko modelizaziotik eta eraikuntzatik lantzen dut, lekuari eta eraikitzen denaren eraginari arreta jarrita.',
    verProyectos: 'Ikusi proiektuak',
    contacto: 'Kontaktua',
    cv: 'CVa',
    ubicacion: 'Non bizi den',
  },
  proyectos: {
    titulo: 'Proiektuak',
    entradilla: 'Lan akademiko eta profesionalen hautaketa.',
    vacio: 'Oraindik ez dago proiekturik argitaratuta. Laster izango dira berriak.',
    ver: 'Ikusi proiektua',
    galeria: 'Proiektuaren irudiak',
    ampliar: 'Handitu irudia',
    imagenDe: '{total} irudietatik {n}.a',
    unaImagen: 'Irudi 1',
    variasImagenes: '{n} irudi',
    ficha: {
      anio: 'Urtea',
      lugar: 'Lekua',
      tipo: 'Mota',
      contexto: 'Testuingurua',
      herramientas: 'Tresnak',
    },
  },
  cv: {
    abrir: 'CVa',
    titulo: 'Curriculuma',
    idiomaDelCV: 'Curriculumaren hizkuntza',
    imprimir: 'Inprimatu',
    nota: 'Curriculum hau webgunetik bertatik sortzen da; beraz, beti dago egunean.',
  },
  contacto: {
    titulo: 'Kontaktua',
    entradilla:
      'Lankidetzetarako, praktiketarako eta lan eskaintzetarako prest. Idatzi eta erantzungo dizut.',
    formularioTitulo: 'Idatzi niri',
    directoTitulo: 'Zuzenean',
    correo: 'Posta elektronikoa',
    telefono: 'Telefonoa',
    ubicacion: 'Kokapena',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    nombre: 'Izena',
    email: 'Helbide elektronikoa',
    organizacion: 'Estudioa edo erakundea',
    opcional: 'aukerakoa',
    mensaje: 'Mezua',
    enviar: 'Bidali mezua',
    enviando: 'Bidaltzen…',
    exito: 'Mezua bidali da. Eskerrik asko idazteagatik: ahalik eta azkarren erantzungo dizut.',
    error: 'Ezin izan da mezua bidali. Idatzi zuzenean {correo} helbidera.',
    obligatorio: 'Eremu hau bete beharrekoa da.',
    avisoDatos: 'Zure datuak erantzuteko soilik erabiltzen dira.',
    leerPrivacidad: 'Irakurri lege oharra',
  },
  pie: {
    derechos: 'Eskubide guztiak erreserbatuta.',
    rotulo: 'Arkitektura portfolioa',
  },
  meta: {
    inicio: {
      titulo: 'Arkitektoa',
      descripcion:
        'Beñat Errazkin Bermejoren portfolioa, UPV/EHUko arkitektoa. Arkitektura proiektuak, marrazketa eta hiru dimentsioko modelizazioa.',
    },
    proyectos: {
      titulo: 'Proiektuak',
      descripcion: 'Beñat Errazkin Bermejoren arkitektura proiektuak.',
    },
    contacto: {
      titulo: 'Kontaktua',
      descripcion: 'Idatzi Beñat Errazkin Bermejori, Bartzelonan bizi den arkitektoari.',
    },
    privacidad: {
      titulo: 'Lege oharra',
      descripcion: 'Webgune honen lege oharra eta datuen tratamendua.',
    },
  },
};

const ca: Textos = {
  general: {
    menu: 'Menú',
    cambiarIdioma: "Canviar d'idioma",
    saltarAlContenido: 'Vés al contingut',
    cerrar: 'Tanca',
    anterior: 'Anterior',
    siguiente: 'Següent',
    volver: 'Torna als projectes',
    revisionPendiente: 'Aquesta traducció està pendent de revisió.',
  },
  nav: {
    inicio: 'Inici',
    proyectos: 'Projectes',
    contacto: 'Contacte',
    privacidad: 'Avís legal',
  },
  inicio: {
    rotulo: 'Arquitecte',
    entradilla:
      "Arquitecte acabat de titular per la UPV/EHU, cursant el màster habilitant a l'ETSAB. Treballo el projecte des del dibuix, el modelatge tridimensional i la construcció, amb atenció al lloc i a l'impacte del que es construeix.",
    verProyectos: 'Veure projectes',
    contacto: 'Contacte',
    cv: 'CV',
    ubicacion: 'Amb base a',
  },
  proyectos: {
    titulo: 'Projectes',
    entradilla: 'Selecció de treballs acadèmics i professionals.',
    vacio: 'Encara no hi ha projectes publicats. Aviat hi haurà novetats.',
    ver: 'Veure projecte',
    galeria: 'Imatges del projecte',
    ampliar: 'Amplia la imatge',
    imagenDe: 'Imatge {n} de {total}',
    unaImagen: '1 imatge',
    variasImagenes: '{n} imatges',
    ficha: {
      anio: 'Any',
      lugar: 'Lloc',
      tipo: 'Tipus',
      contexto: 'Context',
      herramientas: 'Eines',
    },
  },
  cv: {
    abrir: 'CV',
    titulo: 'Currículum',
    idiomaDelCV: 'Idioma del currículum',
    imprimir: 'Imprimeix',
    nota: 'Aquest currículum es genera des de la mateixa web, així que sempre està al dia.',
  },
  contacto: {
    titulo: 'Contacte',
    entradilla:
      'Disponible per a col·laboracions, pràctiques i propostes de feina. Escriu-me i et respondré.',
    formularioTitulo: 'Escriu-me',
    directoTitulo: 'Directe',
    correo: 'Correu',
    telefono: 'Telèfon',
    ubicacion: 'Ubicació',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    nombre: 'Nom',
    email: 'Correu electrònic',
    organizacion: 'Estudi o organització',
    opcional: 'opcional',
    mensaje: 'Missatge',
    enviar: 'Envia el missatge',
    enviando: 'Enviant…',
    exito: 'Missatge enviat. Gràcies per escriure: et respondré al més aviat possible.',
    error: "No s'ha pogut enviar el missatge. Escriu directament a {correo}.",
    obligatorio: 'Aquest camp és obligatori.',
    avisoDatos: "Les teves dades només s'utilitzen per respondre't.",
    leerPrivacidad: "Llegeix l'avís legal",
  },
  pie: {
    derechos: 'Tots els drets reservats.',
    rotulo: "Portfolio d'arquitectura",
  },
  meta: {
    inicio: {
      titulo: 'Arquitecte',
      descripcion:
        "Portfolio de Beñat Errazkin Bermejo, arquitecte per la UPV/EHU. Projectes d'arquitectura, dibuix i modelatge tridimensional.",
    },
    proyectos: {
      titulo: 'Projectes',
      descripcion: "Projectes d'arquitectura de Beñat Errazkin Bermejo.",
    },
    contacto: {
      titulo: 'Contacte',
      descripcion: 'Escriu a Beñat Errazkin Bermejo, arquitecte amb base a Barcelona.',
    },
    privacidad: {
      titulo: 'Avís legal',
      descripcion: "Avís legal i tractament de dades d'aquesta web.",
    },
  },
};

const TEXTOS: Record<Idioma, Textos> = { es, en, eu, ca };

export function textos(idioma: Idioma): Textos {
  return TEXTOS[idioma];
}

/** Sustituye {marcas} por valores. formatear('Imagen {n}', { n: 3 }) */
export function formatear(plantilla: string, valores: Record<string, string | number>): string {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) => String(valores[clave] ?? ''));
}
