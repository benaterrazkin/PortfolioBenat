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
    ficha: {
      anio: 'Año',
      lugar: 'Lugar',
      tipo: 'Tipo',
      contexto: 'Contexto',
      herramientas: 'Herramientas',
    },
  },
  cuaderno: {
    rotulo: 'Cuaderno de {titulo}',
    hojaAnterior: 'Hoja anterior',
    hojaSiguiente: 'Hoja siguiente',
    hojaDe: 'Hoja {n} de {total}',
    fin: 'Fin del cuaderno',
    siguienteProyecto: 'Siguiente proyecto',
    indice: 'Índice',
    irA: 'Ir a {titulo}',
    ayuda: 'Pulsa a los lados del cuaderno, o usa las flechas del teclado, para pasar las hojas.',
    enBlanco: 'Hoja en blanco',
    diagrama: 'Diagrama conceptual',
    volverAlPrincipio: 'Volver al principio',
  },
  cv: {
    abrir: 'CV',
    titulo: 'Currículum',
    idiomaDelCV: 'Idioma del currículum',
    descargar: 'Descargar',
    nota: 'El PDF se genera desde esta misma web, con este mismo contenido: no puede quedarse desfasado.',
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
    creadora: 'Diseño y desarrollo',
  },
  meta: {
    inicio: {
      titulo: 'Arquitecto',
      descripcion:
        'Portfolio de Beñat Errazkin Bermejo, arquitecto por la UPV/EHU: proyectos de arquitectura, dibujo y modelado tridimensional, y forma de ponerse en contacto.',
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
    ficha: {
      anio: 'Year',
      lugar: 'Location',
      tipo: 'Type',
      contexto: 'Context',
      herramientas: 'Tools',
    },
  },
  cuaderno: {
    rotulo: '{titulo} — notebook',
    hojaAnterior: 'Previous page',
    hojaSiguiente: 'Next page',
    hojaDe: 'Page {n} of {total}',
    fin: 'End of the notebook',
    siguienteProyecto: 'Next project',
    indice: 'Index',
    irA: 'Go to {titulo}',
    ayuda: 'Click either side of the notebook, or use the arrow keys, to turn the pages.',
    enBlanco: 'Blank page',
    diagrama: 'Concept diagram',
    volverAlPrincipio: 'Back to the start',
  },
  cv: {
    abrir: 'CV',
    titulo: 'Curriculum vitae',
    idiomaDelCV: 'CV language',
    descargar: 'Download',
    nota: 'The PDF is generated by this same website, from this same content: it cannot fall out of date.',
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
    creadora: 'Design and development',
  },
  meta: {
    inicio: {
      titulo: 'Architect',
      descripcion:
        'Portfolio of Beñat Errazkin Bermejo, architect (UPV/EHU): architecture projects, drawing and three-dimensional modelling, and how to get in touch.',
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
    ficha: {
      anio: 'Urtea',
      lugar: 'Lekua',
      tipo: 'Mota',
      contexto: 'Testuingurua',
      herramientas: 'Tresnak',
    },
  },
  cuaderno: {
    rotulo: '{titulo} proiektuaren koadernoa',
    hojaAnterior: 'Aurreko orria',
    hojaSiguiente: 'Hurrengo orria',
    hojaDe: '{total} orritatik {n}.a',
    fin: 'Koadernoaren amaiera',
    siguienteProyecto: 'Hurrengo proiektua',
    indice: 'Aurkibidea',
    irA: 'Joan {titulo} atalera',
    ayuda: 'Sakatu koadernoaren alboetan, edo erabili teklatuko geziak, orriak pasatzeko.',
    enBlanco: 'Orri zuria',
    diagrama: 'Kontzeptu diagrama',
    volverAlPrincipio: 'Hasierara itzuli',
  },
  cv: {
    abrir: 'CVa',
    titulo: 'Curriculuma',
    idiomaDelCV: 'Curriculumaren hizkuntza',
    descargar: 'Deskargatu',
    nota: 'PDFa webgune honetatik bertatik sortzen da, eduki honekin berarekin: ezin da zaharkitu.',
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
    creadora: 'Diseinua eta garapena',
  },
  meta: {
    inicio: {
      titulo: 'Arkitektoa',
      descripcion:
        'Beñat Errazkin Bermejoren portfolioa, UPV/EHUko arkitektoa: arkitektura proiektuak, marrazketa eta hiru dimentsioko modelizazioa, eta harremanetan jartzeko modua.',
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
    ficha: {
      anio: 'Any',
      lugar: 'Lloc',
      tipo: 'Tipus',
      contexto: 'Context',
      herramientas: 'Eines',
    },
  },
  cuaderno: {
    rotulo: 'Quadern de {titulo}',
    hojaAnterior: 'Pàgina anterior',
    hojaSiguiente: 'Pàgina següent',
    hojaDe: 'Pàgina {n} de {total}',
    fin: 'Final del quadern',
    siguienteProyecto: 'Projecte següent',
    indice: 'Índex',
    irA: 'Vés a {titulo}',
    ayuda: 'Prem als costats del quadern, o fes servir les fletxes del teclat, per passar les pàgines.',
    enBlanco: 'Pàgina en blanc',
    diagrama: 'Diagrama conceptual',
    volverAlPrincipio: 'Torna al principi',
  },
  cv: {
    abrir: 'CV',
    titulo: 'Currículum',
    idiomaDelCV: 'Idioma del currículum',
    descargar: 'Descarrega',
    nota: "El PDF es genera des d'aquesta mateixa web, amb aquest mateix contingut: no pot quedar desfasat.",
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
    creadora: 'Disseny i desenvolupament',
  },
  meta: {
    inicio: {
      titulo: 'Arquitecte',
      descripcion:
        "Portfolio de Beñat Errazkin Bermejo, arquitecte per la UPV/EHU: projectes d'arquitectura, dibuix i modelatge tridimensional, i com posar-s'hi en contacte.",
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
