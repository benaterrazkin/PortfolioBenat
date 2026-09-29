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
nombre de `benaterrazkin224@gmail.com`: ahí es donde llegan los mensajes.

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

### Borrar los proyectos de relleno

Ahora mismo hay tres proyectos de mentira —`proyecto-1`, `proyecto-2` y
`proyecto-3`— con imágenes grises de relleno, para ver cómo queda el cuaderno
antes de tener láminas de verdad. Cuando haya proyectos reales:

1. Borra los tres bloques de los cuatro `src/data/proyectos/*.json`.
2. Borra las carpetas `src/assets/img/proyectos/proyecto-1`, `-2` y `-3`.
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
