# Portfolio de Beñat Errazkin

Web personal de Beñat Errazkin Bermejo, arquitecto. Está en cuatro idiomas
(español, inglés, euskera y catalán) y se publica sola en GitHub Pages cada vez
que se sube un cambio.

---

## Decisiones ya tomadas sobre los datos de Beñat

Quedan aquí anotadas para que nadie las «corrija» de vuelta más adelante:

- **El correo bueno es `benaterrazkin224@gmail.com`**, no el
  `benaterrazkin2@gmail.com` que llevaba el PDF antiguo del currículum. Sale de
  `src/config/sitio.ts` y desde ahí se reparte a la web y al currículum.
- **El carnet es «A1 y B»**. El PDF ponía «B1», que en España no existe: era
  una errata y está corregida en los cuatro `src/data/cv/*.json`.
- **El teléfono no se publica.** Beñat prefiere que su número no esté a la
  vista en una web pública. El campo `telefono` de `src/config/sitio.ts` está
  vacío y, mientras lo esté, el número no sale ni en contacto, ni en el pie, ni
  en el currículum. Para recuperarlo solo hay que volver a escribirlo ahí.
- **La dirección postal no se publica.** El PDF incluía la calle («Avinguda de
  Roma 43»); en la web aparece solo «Barcelona, España».
- **El español se lista como lengua nativa** en el currículum, aunque el PDF
  solo nombrara euskera e inglés.

## El formulario de contacto

Funciona con [Web3Forms](https://web3forms.com), un servicio gratuito que hace
de intermediario: recoge el mensaje y lo entrega por correo. La clave está en
`claveFormulario`, dentro de `src/config/sitio.ts`, y está dada de alta a
nombre de `benaterrazkin224@gmail.com` (confirmado por Beñat): ahí es donde
llegan los mensajes. Web3Forms solo entrega a la dirección con la que se creó
la clave.

Esa clave se ve en el código fuente de la web, y es así a propósito: lo único
que permite hacer es enviar un mensaje a ese buzón. No da acceso a nada.

Si algún día deja de funcionar, se saca una clave nueva en web3forms.com con
ese mismo correo y se sustituye. Si se deja el campo vacío, el formulario no se
rompe: avisa de que no está conectado y ofrece escribir directamente al correo.

---

## Cómo se trabaja con la web

Hace falta tener [Node.js](https://nodejs.org) instalado (versión 22 o
superior). La primera vez:

```powershell
npm install
```

Para verla en el ordenador mientras se cambia algo:

```powershell
npm run dev
```

Abre la dirección que aparece en pantalla (normalmente
`http://localhost:4321`). Cada vez que se guarda un archivo, la web se
actualiza sola.

Para comprobar que todo está bien antes de subirlo:

```powershell
npm run build
```

Si algo falla (una foto que no existe, un idioma sin traducir), este comando lo
dice con un mensaje claro y **no publica nada roto**.

---

## Dónde está cada cosa

| Qué quiero cambiar | Archivo |
| --- | --- |
| Correo, teléfono, ciudad, redes sociales, programas | `src/config/sitio.ts` |
| Los proyectos | `src/data/proyectos/es.json` (y `en`, `eu`, `ca`) |
| Qué proyectos van al portfolio en PDF y cómo se maqueta | `src/data/portfolio.ts` |
| La foto (web, PDF y al compartir) | `src/assets/img/foto-benat.jpg` y `retrato.jpg` |
| El currículum | `src/data/cv/es.json` (y `en`, `eu`, `ca`) |
| Los textos de los botones y menús | `src/i18n/ui.ts` |
| El aviso legal | `src/paginas/Privacidad.astro` |
| Los colores y las tipografías | `src/styles/global.css` |
| Las imágenes | `src/assets/img/` |

---

## Añadir un proyecto

1. **Las imágenes.** Crea una carpeta con el nombre del proyecto dentro de
   `src/assets/img/proyectos/`, por ejemplo
   `src/assets/img/proyectos/casa-ur/`, y mete ahí las imágenes (`.jpg`,
   `.png` o `.webp`). No hace falta reducirlas: la web genera sola los tamaños
   que necesita para el móvil y para el ordenador.

2. **La ficha.** Abre `src/data/proyectos/es.json` y copia el bloque que ya
   hay, cambiando lo que haga falta:

   ```json
   {
     "id": "casa-ur",
     "orden": 1,
     "titulo": "Casa UR",
     "subtitulo": "Una frase corta que acompaña al título",
     "anio": "2024",
     "lugar": "Hernani",
     "tipo": "Vivienda unifamiliar",
     "contexto": "Proyectos V · UPV/EHU",
     "herramientas": ["Rhinoceros", "AutoCAD"],
     "lomo": "#97313e",
     "texto": ["Primer párrafo.", "Segundo párrafo."],
     "portada": {
       "archivo": "proyectos/casa-ur/portada.jpg",
       "alt": "Vista exterior de la casa desde el camino"
     },
     "paginas": [
       { "tipo": "presentacion" },
       {
         "tipo": "lamina",
         "archivo": "proyectos/casa-ur/planta.jpg",
         "alt": "Planta baja de la vivienda, con el patio y la cocina",
         "titulo": "Planta baja",
         "escala": "1:100"
       }
     ]
   }
   ```

3. **Los otros tres idiomas.** Repite el bloque en `en.json`, `eu.json` y
   `ca.json` traduciendo los textos. **El `id` tiene que ser idéntico en los
   cuatro**: es lo que hace que al cambiar de idioma no se pierda el proyecto
   que estabas viendo. Si falta en alguno, `npm run build` avisa.

Detalles que importan:

- **`orden`** decide en qué posición sale el proyecto: los números pequeños van
  primero.
- **`alt`** es la descripción de la imagen para quien no puede verla (lectores
  de pantalla, buscadores). Es obligatoria, y tiene que decir lo que se VE en
  esa lámina, no repetir el título del proyecto.
- **`titulo`** y **`escala`** de cada lámina salen en su cajetín, en la web y
  en el PDF. Por eso no hay que escribirlos dentro de la imagen.
- **`lomo`** es el color del proyecto: la cinta del cuaderno, el lomo del
  estante y el lugar en el PDF.
- **`herramientas`**: tres o cuatro, las de verdad de ese proyecto.

### El estante

La sección Proyectos es un estante con los libros **de frente**, como el
escaparate de una librería (`src/components/Estante.astro`). Cada tapa enseña el
**esquema conceptual** del proyecto (`diagrama` en el `.json`) con el lomo del
color de `lomo`, y debajo el número, el título y lugar · año. Al pasar por
encima, el libro se levanta y deja ver la imagen del proyecto (`portada`). Sale
solo de los `.json`: no hay que tocar nada para que aparezca un proyecto nuevo.

**Los cuadernos ya no están en la página.** Al pulsar un libro, su cuaderno se
abre en grande encima de la web (`src/components/VisorCuaderno.astro`), con
botones de proyecto anterior / siguiente y la ✕ (o Esc) para cerrar. Cada
cuaderno tiene su dirección propia, `…/es/#cuaderno-<id>`: quien abre ese
enlace entra con el cuaderno ya abierto, y "atrás" en el navegador lo cierra.

### Los esquemas conceptuales

Van en `src/assets/img/proyectos/<id>/diagrama.png`, **con fondo
transparente**, y salen en la tapa del libro y en la tapa del cuaderno. El de
Elorrieta es el de Beñat (sacado del PDF de la entrega); los otros cinco son
**provisionales**, volúmenes sencillos dibujados para ir dando forma. Para poner
el definitivo, basta con sustituir el `diagrama.png` de ese proyecto por uno
nuevo con el mismo nombre (PNG con fondo transparente).

### Cómo se reparte un proyecto en el cuaderno

Cada proyecto se enseña como un cuaderno abierto que se pasa hoja a hoja. El
reparto lo hace sola la web (`src/data/cuaderno.ts`) y siempre igual, así que
**no hay que maquetar nada**:

| Cara | Qué lleva |
| --- | --- |
| Guarda (izquierda) | el número, el título, el subtítulo y la ficha |
| 1 | la portada |
| 2 | los párrafos de `texto` |
| 3 y siguientes | una imagen por cara, con su pie y su número |
| Contraguarda (derecha) | el cierre y el salto al siguiente proyecto |

Lo único que decide quien escribe el contenido es **el orden de las imágenes**.
Si al final las cuentas no cuadran, la web añade una hoja en blanco: en un
cuaderno de verdad también la hay, así que no desentona.

Por dentro, las hojas son papeles con dos caras y girar una avanza dos páginas.
Si el número de caras no sale par, es que falta o sobra algo: la web lo cuadra
sola, pero conviene saberlo si algún día se toca `src/data/cuaderno.ts`.

---

## El portfolio en PDF

Se genera solo al compilar, uno por idioma (`/portfolio/es.pdf`…), con el mismo
contenido que la web. **No entran todos los proyectos**: solo los de
`src/data/portfolio.ts`, en ese orden (ahora: Urnieta, Astigarreta, Piekary y
Gubin). La web sigue enseñando los seis.

Se maqueta por **dobles páginas**: cada página del PDF es un pliego de
594×210 mm (dos A4 apaisados), salvo la portada, que va sola. Así cualquier
visor enseña la doble página entera y las imágenes grandes no se parten.

| Pliego | Qué lleva |
| --- | --- |
| Portada (página suelta) | la portada del primer proyecto, "portfolio" y el nombre |
| Sobre mí | la presentación y un currículum breve · la foto |
| Índice | una columna por proyecto: imagen, número, título, lugar y página |
| Apertura de cada proyecto | número, título, texto y ficha · la portada a sangre |
| El resto | lo que diga `src/data/portfolio.ts`, pliego a pliego |

En `src/data/portfolio.ts` cada pliego es de uno de estos tipos:

- `par`: una lámina en cada página, en caja y con su cajetín.
- `dibujo`: un dibujo muy alargado sobre las dos páginas (secciones largas).
- `sangre`: una imagen a sangre sobre las dos páginas. Con `entera: true` no se
  recorta (para vistas en las que no se puede perder nada).

Regla que se ha seguido: además de la apertura, **como mucho una imagen
grande por proyecto**; el resto, en caja. Las láminas se nombran por su
archivo; el título y la escala salen del `.json` en cada idioma.

En cada página solo se repiten el número del proyecto (arriba a la izquierda)
y el número de página (en la esquina exterior). El nombre, "portfolio" y los
programas salen solo en la portada y en la apertura de cada proyecto.

Las tipografías son las de la web (Work Sans e Inter) y Barlow Condensed para
los números grandes; van dentro del PDF.

### Al preparar láminas nuevas

- Renders: unos 6000 px de ancho, sin la marca de agua de Lumion. Si van a
  doble página, sin nada importante en el centro (ahí cae el pliegue).
- Planos: sin margen blanco alrededor y sin el título dentro de la imagen.
- Basta con sustituir el archivo en `src/assets/img/proyectos/<proyecto>/` con
  el mismo nombre: la web y el PDF se actualizan solos.

## La imagen al compartir el enlace

Al mandar la web por WhatsApp, LinkedIn o correo sale una imagen de
1200×630: la foto de Beñat y la portada del primer proyecto del portfolio. La
genera `src/pages/compartir.jpg.ts` a partir de `src/assets/img/foto-benat.jpg`.
Para cambiar la foto, se sustituye ese archivo (y `retrato.jpg`, que es el
recorte que sale en la portada de la web).

---

## El currículum

El currículum **no está guardado a mano en ningún sitio**: se escribe una sola
vez, como datos, en `src/data/cv/<idioma>.json`, y de ahí salen las dos formas
en que se puede leer.

- **En la web**, dibujado dentro de una ventana que se abre con el botón «CV».
  Dentro se puede cambiar el idioma del currículum sin que cambie el de la web.
- **En PDF**, en `/cv/es.pdf`, `/cv/en.pdf`, `/cv/eu.pdf` y `/cv/ca.pdf`. Los
  genera `src/pages/cv/[idioma].pdf.ts` al compilar, con el mismo contenido y
  los mismos colores. El botón de descarga entrega el del idioma que se esté
  viendo en ese momento.

Por eso las dos versiones no pueden contradecirse: traducir el currículum es
traducir un archivo de texto, y los datos de contacto salen siempre de
`src/config/sitio.ts`.

El PDF está pensado para caber en **una sola hoja**: las secciones cortas
(programas, habilidades, idiomas y otros datos) van a dos columnas. Si algún día
crece el contenido y se va a dos páginas, se recorta el espaciado en las
constantes de arriba de ese archivo.

---

## Idiomas

Los cuatro idiomas están en `src/i18n/idiomas.ts`. Cada página tiene su
dirección traducida:

| | Español | Inglés | Euskera | Catalán |
| --- | --- | --- | --- | --- |
| Toda la web | `/es/` | `/en/` | `/eu/` | `/ca/` |
| Aviso legal | `/es/privacidad/` | `/en/privacy/` | `/eu/pribatutasuna/` | `/ca/privacitat/` |

La web es **una sola página por idioma**: el nombre y la foto, los proyectos y
el contacto van seguidos en el mismo scroll. Dentro de esa página hay anclas,
que son iguales en los cuatro idiomas para que al cambiar de idioma no se
pierda el sitio: `#proyectos`, `#contacto` y `#cuaderno-<id>` para cada
proyecto.

Quien entra en la dirección raíz va al idioma de su navegador si está entre
esos cuatro, y si no, al inglés.

**Las traducciones de euskera y catalán las ha hecho una máquina y no las ha
revisado nadie.** Conviene que las lea alguien antes de darle publicidad a la
web. Si hay que retirar un idioma mientras tanto, se quita de la lista
`IDIOMAS_PUBLICADOS` en `src/i18n/idiomas.ts` y desaparece del selector.

---

## Publicar

Cada vez que se suben cambios a la rama `main`, GitHub reconstruye la web y la
publica solo (ver `.github/workflows/deploy.yml`). Solo hay que hacerlo una vez
a mano: en GitHub, **Settings → Pages → Source: GitHub Actions**.

La dirección será `https://benaterrazkin.github.io/PortfolioBenat/`.

Si algún día se compra un dominio propio, se escribe en `astro.config.mjs`
(arriba del todo, en `DOMINIO_PROPIO`) y se añade un archivo `public/CNAME` con
el dominio dentro.

---

## Estética

Es provisional, pendiente de concretar con Beñat. Ahora mismo es una lectura
arquitectónica: papel claro, tinta casi negra, líneas de un píxel, rótulos en
versales espaciadas y una retícula muy tenue de fondo, como un plano. El único
color es un rojo de lápiz (`--color-trazo`) reservado para marcas pequeñas:
numeración, subrayados y el estado activo del menú.

Todo eso se cambia desde `src/styles/global.css`, en el bloque `@theme` de
arriba: tocar un color ahí lo cambia en toda la web.
