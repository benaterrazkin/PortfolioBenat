// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/* ------------------------------------------------------------------ *
 *  DIRECCIÓN DE LA WEB
 *
 *  Al publicar desde GitHub, la dirección se calcula sola a partir del
 *  nombre de la cuenta y del repositorio: no hay que tocar nada.
 *
 *  Si algún día se compra un dominio propio, basta con escribirlo aquí:
 *      const DOMINIO_PROPIO = 'https://benaterrazkin.com';
 *  (y añadir un archivo public/CNAME con "benaterrazkin.com" dentro).
 * ------------------------------------------------------------------ */
const DOMINIO_PROPIO = '';

/** GitHub Actions rellena esta variable con "cuenta/repositorio". */
const REPOSITORIO = process.env.GITHUB_REPOSITORY ?? '';
const [cuentaOriginal = '', repositorio = ''] = REPOSITORIO.split('/');

/*
 * El nombre del servidor va siempre en minúsculas, pero la subcarpeta
 * conserva las mayúsculas del repositorio: GitHub distingue entre
 * "/PortfolioBenat" y "/portfoliobenat", y solo sirve la primera.
 */
const cuenta = cuentaOriginal.toLowerCase();
const esSitioDeCuenta = repositorio.toLowerCase() === `${cuenta}.github.io`;

const sitioGitHub = cuenta ? `https://${cuenta}.github.io` : 'https://ejemplo.github.io';
const baseGitHub = repositorio && !esSitioDeCuenta ? `/${repositorio}` : '/';

const SITIO = DOMINIO_PROPIO || process.env.SITE_URL || sitioGitHub;
const BASE = DOMINIO_PROPIO ? '/' : (process.env.BASE_PATH ?? baseGitHub);

export default defineConfig({
  site: SITIO,
  base: BASE,
  trailingSlash: 'always',
  i18n: {
    locales: ['es', 'en', 'eu', 'ca'],
    defaultLocale: 'es',
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
