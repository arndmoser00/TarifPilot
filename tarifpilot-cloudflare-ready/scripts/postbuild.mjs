import { build } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

// SITE_URL includes the repository path, for example https://name.github.io/tarifpilot/.
const site = new URL(process.env.SITE_URL || 'https://arndmoser00.github.io/TarifPilot/');
site.search = '';
site.hash = '';
if (!site.pathname.endsWith('/')) site.pathname += '/';
const siteUrl = site.href;
const basePath = site.pathname;
const outputDir = path.resolve('dist');
const bundlePath = path.resolve('.tarifpilot-ssr.cjs');

const result = await build({
  entryPoints: ['src/ssr.tsx'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  packages: 'external',
  write: false,
  define: { 'import.meta.env.BASE_URL': JSON.stringify(basePath) },
});
await writeFile(bundlePath, result.outputFiles[0].contents);

const escapeHtml = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageUrl = (route) => new URL(route ? `${route}/` : '', siteUrl).href;
const seo = (metadata, route, noindex = false) => {
  const title = escapeHtml(metadata.title);
  const description = escapeHtml(metadata.description);
  const url = escapeHtml(pageUrl(route));
  const image = escapeHtml(new URL('images/og-tarifpilot.jpg', siteUrl).href);
  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="${route.startsWith('ratgeber/') ? 'article' : 'website'}" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:site_name" content="TarifPilot" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="TarifPilot: Finde den passenden Tarif. Vergleiche clever. Spare mehr." />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:card" content="summary_large_image" />`;
};

try {
  const require = createRequire(import.meta.url);
  const { renderPage, articles, categories, pageMetadata } = require(bundlePath);
  const routes = [
    ...Object.entries(pageMetadata).map(([route, metadata]) => ({ route, metadata, noindex: route === 'suche' })),
    ...categories.map((category) => ({ route: `themen/${category.slug}`, metadata: { title: `${category.name}: Ratgeber & Tipps | TarifPilot`, description: category.intro } })),
    ...articles.map((article) => ({ route: `ratgeber/${article.slug}`, metadata: { title: `${article.title} | TarifPilot`, description: article.description } })),
  ];
  const builtIndex = await readFile(path.join(outputDir, 'index.html'), 'utf8');
  const templatePath = path.resolve('.tarifpilot-template.html');
  let template;
  if (builtIndex.includes('<div id="root"></div>')) {
    template = builtIndex;
    await writeFile(templatePath, template);
  } else {
    template = await readFile(templatePath, 'utf8');
  }
  const marker = /<meta name="tarifpilot-seo-start"[^>]*>[\s\S]*?<meta name="tarifpilot-seo-end"[^>]*>/;
  if (!marker.test(template) || !template.includes('<div id="root"></div>')) throw new Error('Build template markers not found. Run npm run build first.');

  async function writePage({ route, metadata, noindex = false }, file) {
    globalThis.window = { location: new URL(pageUrl(route)) };
    const markup = renderPage();
    const html = template
      .replace(marker, seo(metadata, route, noindex))
      .replace(/(<meta name="tarifpilot-base" content=")[^"]*(")/, `$1${basePath}$2`)
      .replace(/(<link\b[^>]*\brel="icon"[^>]*\bhref=")[^"]*(")/, `$1${basePath}favicon.svg$2`)
      .replace(/(<link\b[^>]*\brel="apple-touch-icon"[^>]*\bhref=")[^"]*(")/, `$1${basePath}icon-192.png$2`)
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    const target = path.join(outputDir, file || (route ? `${route}/index.html` : 'index.html'));
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, html);
  }

  for (const route of routes) await writePage(route);
  await writePage({ route: '404', noindex: true, metadata: { title: 'Seite nicht gefunden | TarifPilot', description: 'Die gesuchte Seite wurde nicht gefunden. Entdecke die Ratgeber von TarifPilot.' } }, '404.html');
  const urls = routes.filter((route) => !route.noindex).map(({ route }) => `  <url><loc>${escapeHtml(pageUrl(route))}</loc></url>`).join('\n');
  await writeFile(path.join(outputDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  await writeFile(path.join(outputDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', siteUrl).href}\n`);
  await writeFile(path.join(outputDir, '.nojekyll'), '');
  console.log(`Generated ${routes.length} static pages, 404.html, sitemap.xml and robots.txt for ${siteUrl}`);
} finally {
  await rm(bundlePath, { force: true });
}