# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Estudios de arquitectura** (socios, responsables de equipo) que reciben el CV o el portfolio de Beñat, o el enlace a la web, y deciden en pocos minutos si le llaman para una entrevista, unas prácticas o una colaboración.
- **Público general y posibles clientes** que buscan a un arquitecto o llegan a la web por un enlace compartido y quieren entender quién es, qué ha hecho y cómo contactarle.

Llegan sobre todo desde un enlace (correo, WhatsApp, LinkedIn) o desde el PDF del portfolio; muchas visitas serán desde el móvil.

## Product Purpose

Web personal y portfolio de Beñat Errazkin Bermejo, arquitecto recién titulado por la UPV/EHU que cursa el máster habilitante en la ETSAB (Barcelona). Sirve para:

- presentarse y dejar claro en segundos quién es (formación, ciudad, idiomas, programas);
- enseñar sus proyectos de forma ordenada y visual, uno por uno;
- compartir con facilidad el CV y el portfolio en PDF (descargables, en cuatro idiomas);
- recibir contacto (correo y formulario).

Lo que busca ahora mismo: **prácticas** durante el máster, **empleo como arquitecto junior**, **concursos y colaboraciones**, y tener un **archivo ordenado** de todo su trabajo, que irá creciendo con los proyectos profesionales.

Éxito: que un estudio o un cliente vea el trabajo, lo entienda y escriba o se descargue el portfolio.

## Positioning

Lo que Beñat quiere que se recuerde de él:

- **Rehabilitación y patrimonio:** dar nueva vida a lo existente entendiendo primero lo que hay (la iglesia en ruina de Gubin, la ikastola vacía de Urnieta en su TFG).
- **Del dibujo a la maqueta:** trabaja el proyecto en todas las escalas y herramientas, desde el plano y el modelado 3D hasta el render y la maqueta física (Astigarreta).

## Operating Context

- El visitante entra por un enlace, mira la portada, recorre el estante de proyectos, abre uno o dos cuadernos y, si le interesa, descarga el portfolio o el CV o escribe.
- El portfolio en PDF es el documento que se manda a los estudios: se genera desde la misma web y se maqueta por dobles páginas (pliegos de 594×210 mm).
- Cada proyecto tiene su propio enlace (`#cuaderno-<id>`) para mandarlo suelto.

## Capabilities and Constraints

- Sitio estático en **Astro 7 + Tailwind**, publicado en **GitHub Pages** (`https://benaterrazkin.github.io/PortfolioBenat/`), sin servidor propio ni dominio propio por ahora.
- **Cuatro idiomas:** español (original), inglés, euskera y catalán. Euskera y catalán están traducidos por máquina y pendientes de revisión; se quedan publicados.
- Contenido como datos: proyectos en `src/data/proyectos/<idioma>.json`, CV en `src/data/cv/<idioma>.json`, qué entra en el PDF en `src/data/portfolio.ts`, datos de contacto en `src/config/sitio.ts`.
- El CV y el portfolio en PDF se generan al compilar y no pueden quedarse desfasados respecto a la web.
- Formulario de contacto con Web3Forms (entrega a `benaterrazkin224@gmail.com`).
- **No se publican** el teléfono ni la dirección postal.
- Las láminas son provisionales: Beñat está haciendo la postproducción y **aplica él a mano los colores y plumillas**; la web no retoca sus imágenes.
- Los esquemas conceptuales de cinco proyectos son provisionales (el de Elorrieta es suyo); se sustituirán por los suyos.
- LinkedIn pendiente de añadir; Instagram no (solo tiene cuenta personal).

## Brand Commitments

- Nombre: **Beñat Errazkin** (firma completa: Beñat Errazkin Bermejo). Título: Arquitecto.
- Organización por **pliegos/temas** en el PDF y metáfora de **estante y cuadernos** en la web, decididas por Beñat.
- Números de proyecto finos, condensados y estirados en vertical; textos legibles sin zoom; nada repetido en cada página del PDF (solo número de proyecto y de página).
- Un color de acento por proyecto (el `lomo`).

## Evidence on Hand

- Seis proyectos académicos reales con láminas y textos: Urnieta (TFG, 2025), Astigarreta (2023), Piekary (Polonia, 2024), Gubin (Polonia, 2024), Hondarribia (2024), Elorrieta (2023). Imágenes en `src/assets/img/proyectos/`.
- Experiencia: arquitecto en el estudio LYMA (San Sebastián, jun–sep 2025) y trabajos no relacionados con la arquitectura (monitor, entrenador), todos en el CV.
- Foto de Beñat: `src/assets/img/foto-benat.jpg`.
- **No hay** testimonios, premios, publicaciones ni proyectos profesionales propios todavía: no se inventan.

## Product Principles

1. **El trabajo manda.** Lo primero que se ve y lo que más espacio ocupa son los proyectos; la interfaz se aparta.
2. **Valorar en segundos.** Quien entra tiene que saber quién es Beñat y ver su trabajo sin buscarlo; lo largo, a un clic.
3. **Fácil de compartir.** Web, CV, portfolio y cada proyecto, con su propio enlace o descarga, en cuatro idiomas.
4. **Crece sin rehacerse.** Añadir un proyecto es añadir datos, no maquetar; la estructura aguanta trabajos profesionales futuros.
5. **Honesto.** Solo hechos reales; lo provisional se marca como provisional.
