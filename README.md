# Portfolio de Beñat Errazkin

Web personal de Beñat Errazkin Bermejo, arquitecto. Está en cuatro idiomas
(español, inglés, euskera y catalán) y se publica sola en GitHub Pages cada vez
que se sube un cambio.

---

## Antes de publicar: cosas pendientes de confirmar

Hay cinco puntos que dependen de Beñat y que conviene resolver antes de enseñar
la web a nadie:

1. **El correo.** En las instrucciones del portfolio aparece
   `benaterrazkin224@gmail.com` y en el PDF del currículum
   `benaterrazkin2@gmail.com`. La web usa el primero. Si el bueno es el otro,
   se cambia en `src/config/sitio.ts`.
2. **El carnet de conducir.** El currículum original dice «A1 y B1». En España
   las categorías son A1 y **B** (B1 no existe). Está copiado tal cual del PDF:
   si es una errata, se corrige en los cuatro archivos `src/data/cv/*.json`.
3. **El teléfono.** El currículum lo incluye y la web también, en la página de
   contacto y en el currículum. Si no quiere que su teléfono esté en una web
   pública, basta con dejar `telefono: ''` en `src/config/sitio.ts` y desaparece
   de todas partes.
4. **La dirección postal.** El PDF del currículum incluye la calle («Avinguda de
   Roma 43»). En la web solo aparece «Barcelona, España»: una dirección completa
   en una página pública no aporta nada y se puede usar mal.
5. **El español en la lista de idiomas del currículum.** El PDF solo listaba
   euskera e inglés. Se ha añadido el español como lengua nativa porque parecía
   un olvido; si no es así, se quita de los cuatro `src/data/cv/*.json`.

Y una cosa más, sin la cual el formulario de contacto no envía nada:

6. **La clave del formulario.** Hay que darse de alta gratis en
   [web3forms.com](https://web3forms.com) con el correo de Beñat y pegar la
   clave que llega por email en `claveFormulario`, dentro de
   `src/config/sitio.ts`. Mientras esté vacía, el formulario avisa de que no
   está conectado y ofrece escribir directamente al correo.

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
| Correo, teléfono, ciudad, redes sociales | `src/config/sitio.ts` |
| Los proyectos | `src/data/proyectos/es.json` (y `en`, `eu`, `ca`) |
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
     "texto": ["Primer párrafo.", "Segundo párrafo."],
     "portada": {
       "archivo": "proyectos/casa-ur/portada.jpg",
       "alt": "Vista exterior de la casa desde el camino"
     },
     "imagenes": [
       {
         "archivo": "proyectos/casa-ur/planta.jpg",
         "alt": "Planta baja de la vivienda",
         "pie": "Planta baja. E 1:100"
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
  de pantalla, buscadores). Es obligatoria.
- **`pie`** es el texto que se lee debajo de la imagen. Es opcional.

### Borrar el proyecto de ejemplo

Ahora mismo hay un proyecto de mentira, `"ejemplo"`, con imágenes de relleno,
para que se vea cómo queda la web antes de tener proyectos de verdad. Cuando
haya uno real:

1. Borra el bloque `"ejemplo"` de los cuatro `src/data/proyectos/*.json`.
2. Borra la carpeta `src/assets/img/proyectos/ejemplo/`.
3. Borra `scripts/placeholders.mjs` y la línea `"imagenes-ejemplo"` de
   `package.json`.

---

## El currículum

El currículum **no es un PDF**: se dibuja dentro de la propia web, con los datos
de `src/data/cv/<idioma>.json`. Se abre con el botón «CV» de la portada y de la
página de contacto, y dentro se puede cambiar de idioma sin que cambie el idioma
de la web.

Esto tiene dos ventajas: traducirlo es traducir un archivo de texto, y los datos
de contacto salen siempre de `src/config/sitio.ts`, así que no puede quedarse
desfasado respecto al resto de la web.

Quien lo quiera en papel usa el botón «Imprimir», que también sirve para
guardarlo como PDF desde el navegador. Al imprimir se imprime solo el
currículum, sin el menú ni el resto de la página.

---

## Idiomas

Los cuatro idiomas están en `src/i18n/idiomas.ts`. Cada página tiene su
dirección traducida:

| | Español | Inglés | Euskera | Catalán |
| --- | --- | --- | --- | --- |
| Portada | `/es/` | `/en/` | `/eu/` | `/ca/` |
| Proyectos | `/es/proyectos/` | `/en/projects/` | `/eu/proiektuak/` | `/ca/projectes/` |
| Contacto | `/es/contacto/` | `/en/contact/` | `/eu/kontaktua/` | `/ca/contacte/` |
| Aviso legal | `/es/privacidad/` | `/en/privacy/` | `/eu/pribatutasuna/` | `/ca/privacitat/` |

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
