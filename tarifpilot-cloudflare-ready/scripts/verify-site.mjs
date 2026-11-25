import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { access, mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const dist = path.resolve('dist');
let base = process.env.BASE_PATH || '/';
if (!base.startsWith('/')) base = `/${base}`;
if (!base.endsWith('/')) base += '/';
const mime = { '.html': 'text/html; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };

async function fileFor(pathname) {
  if (!pathname.startsWith(base)) return null;
  const relative = decodeURIComponent(pathname.slice(base.length));
  let file = path.resolve(dist, relative);
  if (file !== dist && !file.startsWith(`${dist}${path.sep}`)) return null;
  try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); } catch { return null; }
  try { await access(file); return file; } catch { return null; }
}

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const file = await fileFor(pathname);
  const target = file || path.join(dist, '404.html');
  try {
    const body = await readFile(target);
    response.writeHead(file ? 200 : 404, { 'Content-Type': mime[path.extname(target)] || 'application/octet-stream' });
    response.end(body);
  } catch { response.writeHead(500); response.end('Missing build'); }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const errors = [];

try {
  const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1].replaceAll('&amp;', '&')).pathname);
  paths.push(`${base}suche/`);
  assert.equal(paths.length, 41, 'Expected 41 statically rendered pages');
  const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const staticPage = await staticContext.newPage();
  const titles = new Set();
  const descriptions = new Set();
  for (const pathname of paths) {
    const response = await staticPage.goto(`${origin}${pathname}`, { waitUntil: 'domcontentloaded' });
    assert.equal(response?.status(), 200, `${pathname} should be a real static page`);
    const data = await staticPage.evaluate(() => ({
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      h1: document.querySelector('h1')?.textContent,
      links: [...document.querySelectorAll('a[href], img[src], link[rel="icon"], link[rel="apple-touch-icon"]')].map((element) => element.href || element.src),
      ogImage: document.querySelector('meta[property="og:image"]')?.getAttribute('content'),
      articleCover: document.querySelector('.article-cover img')?.getAttribute('src'),
      missingAnchors: [...document.querySelectorAll('a[href^="#"]')].map((element) => element.getAttribute('href').slice(1)).filter((id) => !document.getElementById(id)),
    }));
    assert.ok(data.h1, `${pathname} must contain a pre-rendered h1`);
    assert.ok(data.title && data.description && data.canonical, `${pathname} needs SEO metadata`);
    assert.equal(new URL(data.canonical).pathname, pathname, `${pathname} canonical path`);
    assert.ok(data.ogImage && await fileFor(new URL(data.ogImage).pathname), `${pathname} needs a working social image`);
    if (pathname.includes('/ratgeber/') && pathname !== `${base}ratgeber/`) assert.ok(data.articleCover, `${pathname} needs an article cover`);
    assert.equal(data.missingAnchors.length, 0, `${pathname} has missing in-page anchors`);
    assert.ok(!titles.has(data.title), `Duplicate title: ${data.title}`);
    assert.ok(!descriptions.has(data.description), `Duplicate description: ${data.description}`);
    titles.add(data.title); descriptions.add(data.description);
    for (const link of data.links) {
      const url = new URL(link, origin);
      if (url.origin === origin) assert.ok(await fileFor(url.pathname), `Broken internal link or asset ${url.pathname} on ${pathname}`);
    }
  }
  await staticContext.close();

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => { if (response.url().startsWith(origin) && response.status() >= 400 && !response.url().includes('unbekannte-seite')) errors.push(`${response.status()} ${response.url()}`); });
  await mkdir('.test-artifacts', { recursive: true });
  await page.goto(`${origin}${base}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: '.test-artifacts/home-desktop.png', animations: 'disabled' });
  await page.screenshot({ path: '.test-artifacts/home-desktop-full.png', fullPage: true, animations: 'disabled' });
  assert.match(await page.locator('h1').innerText(), /Finde den passenden Tarif\.\s*Vergleiche clever\.\s*Spare mehr\./);
  assert.equal(await page.locator('.category-card').count(), 7, 'Homepage should expose all seven categories');
  assert.equal(await page.locator('.hero-trust span').count(), 3, 'Homepage should show three trust highlights');
  await page.getByRole('button', { name: 'Mobilfunk', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Mobilfunk', exact: true }).getAttribute('aria-expanded'), 'true');
  await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'SIM-Only & Prepaid' }).focus();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Mobilfunk', exact: true }).getAttribute('aria-expanded'), 'false');
  assert.ok(await page.getByRole('button', { name: 'Mobilfunk', exact: true }).evaluate((element) => element === document.activeElement), 'Dropdown should return focus to its trigger');
  await page.locator('.faq-list summary').first().click();
  assert.equal(await page.locator('.faq-list details').first().getAttribute('open'), '');
  assert.ok(await page.locator('#newsletter-email').isDisabled(), 'Unconfigured newsletter must remain disabled');
  assert.ok(await page.locator('.newsletter-controls button').isDisabled(), 'Unconfigured subscription must remain disabled');
  for (const image of await page.locator('.feature-image img').all()) await image.scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');
  assert.ok(await page.locator('.feature-image img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0)), 'Editorial images should load');
  await page.getByRole('textbox', { name: 'Ratgeber durchsuchen' }).fill('Glasfaser');
  await page.getByRole('button', { name: 'Suchen' }).click();
  await page.waitForURL(/\/suche\/\?q=Glasfaser/);
  await page.getByRole('link', { name: /DSL oder Glasfaser/ }).first().click();
  await page.waitForURL(/ratgeber\/dsl-oder-glasfaser\//);
  await page.screenshot({ path: '.test-artifacts/article-desktop.png', animations: 'disabled' });
  await page.screenshot({ path: '.test-artifacts/article-desktop-full.png', fullPage: true, animations: 'disabled' });
  assert.equal(await page.locator('.article-body table').count(), 1, 'Article should show a comparison table');
  assert.ok((await page.locator('.article-body section').count()) >= 5, 'Article should have substantial sections');
  await page.goto(`${origin}${base}suche/?q=guenstig`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: /günstigen Internetanbieter/ }).first().waitFor();
  await page.goto(`${origin}${base}`, { waitUntil: 'networkidle' });
  assert.ok(await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Ratgeber' }).isVisible(), 'Ratgeber needs its own desktop menu item');
  assert.ok(await page.locator('.category-count').count() === 7, 'Category cards should advertise their article counts');
  await page.goto(`${origin}${base}ratgeber/`, { waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('checkbox').count(), 0, 'Blog hub has no hidden placeholder controls');
  assert.ok(await page.locator('.blog-grid .feature-card').count() >= 20, 'Blog archive should show the full article collection');
  await page.locator('.blog-filters').getByRole('button', { name: /Mobilfunk/ }).click();
  assert.equal(await page.locator('.blog-grid .feature-card').count(), 3, 'Blog topic filter should show all mobile guides');
  assert.equal(await page.locator('.blog-filters').getByRole('button', { name: /Mobilfunk/ }).getAttribute('aria-pressed'), 'true');
  await page.screenshot({ path: '.test-artifacts/blog-desktop-full.png', fullPage: true, animations: 'disabled' });
  await page.goto(`${origin}${base}vergleich/`, { waitUntil: 'networkidle' });
  assert.match(await page.locator('.comparison-disclaimer').innerText(), /frei erfunden/i);
  assert.equal(await page.locator('.comparison-table tbody tr').count(), 3, 'Comparison should start with three mobile sample offers');
  await page.getByLabel('Tarife sortieren').selectOption('price-asc');
  assert.match(await page.locator('.comparison-table tbody tr').first().innerText(), /9,99/);
  const checkboxes = page.locator('.comparison-table tbody input[type="checkbox"]');
  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();
  assert.match(await page.locator('.compare-toolbar').innerText(), /2 von 3/);
  await page.getByRole('button', { name: /Auswahl vergleichen/ }).click();
  assert.equal(await page.locator('.selected-compare-grid article').count(), 2, 'Selection should produce a two-tariff comparison');
  assert.match(await page.locator('.selected-comparison').innerText(), /Musterangebote im direkten Vergleich/);
  await page.getByRole('tab', { name: 'Internet' }).click();
  assert.equal(await page.locator('.comparison-table tbody tr').count(), 3);
  assert.match(await page.locator('.comparison-table thead').innerText(), /Download/);
  await page.getByLabel('Nur monatlich kündbar').check();
  assert.ok(await page.locator('.no-filter-results').isVisible(), 'Monthly filter should expose an empty state for sample internet tariffs');
  await page.getByRole('button', { name: 'Filter zurücksetzen' }).click();
  assert.equal(await page.locator('.comparison-table tbody tr').count(), 3);
  await page.getByLabel('1. Was möchtest du vergleichen?').selectOption('strom-gas');
  await page.getByLabel('2. Was ist dir besonders wichtig?').selectOption({ label: 'Flexibilität und kurze Bindung' });
  await page.getByRole('button', { name: /Meine Checkliste anzeigen/ }).click();
  assert.match(await page.locator('.comparison-result').innerText(), /Strom & Gas/);
  assert.match(await page.locator('.comparison-result').innerText(), /Mindestlaufzeit/);
  await page.screenshot({ path: '.test-artifacts/comparison-desktop-full.png', fullPage: true, animations: 'disabled' });
  await page.goto(`${origin}${base}cookie-einstellungen/`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: /Einstellung speichern/ }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem('tarifpilot-cookie-choice')), 'essential');
  await page.getByRole('button', { name: /Gespeicherte Auswahl löschen/ }).click();
  assert.equal(await page.evaluate(() => localStorage.getItem('tarifpilot-cookie-choice')), null);
  const notFound = await page.goto(`${origin}${base}unbekannte-seite/`, { waitUntil: 'networkidle' });
  assert.equal(notFound?.status(), 404);
  assert.match(await page.locator('h1').innerText(), /ins Leere/);
  await context.close();

  const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const mobile = await mobileContext.newPage();
  mobile.on('pageerror', (error) => errors.push(error.message));
  await mobile.goto(`${origin}${base}`, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: '.test-artifacts/home-mobile.png', animations: 'disabled' });
  await mobile.getByRole('button', { name: 'Menü öffnen' }).click();
  await mobile.keyboard.press('Escape');
  assert.equal(await mobile.getByRole('button', { name: 'Menü öffnen' }).getAttribute('aria-expanded'), 'false');
  await mobile.getByRole('button', { name: 'Menü öffnen' }).click();
  await mobile.getByRole('navigation', { name: 'Mobile Navigation' }).getByRole('link', { name: 'SIM-Only & Prepaid' }).click();
  await mobile.waitForURL(/themen\/sim-only-prepaid\//);
  await mobile.screenshot({ path: '.test-artifacts/category-mobile.png', fullPage: true, animations: 'disabled' });
  await mobile.goto(`${origin}${base}ratgeber/dsl-oder-glasfaser/`, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: '.test-artifacts/article-mobile.png', fullPage: true, animations: 'disabled' });
  await mobile.goto(`${origin}${base}vergleich/`, { waitUntil: 'networkidle' });
  assert.ok(await mobile.locator('.comparison-mobile-cards').isVisible(), 'Comparison should use readable cards on mobile');
  await mobile.locator('.comparison-mobile-card').first().getByRole('button', { name: /Zum Vergleich/ }).click();
  await mobile.locator('.comparison-mobile-card').nth(1).getByRole('button', { name: /Zum Vergleich/ }).click();
  await mobile.getByRole('button', { name: /Auswahl vergleichen/ }).click();
  assert.equal(await mobile.locator('.selected-compare-grid article').count(), 2);
  await mobile.screenshot({ path: '.test-artifacts/comparison-mobile.png', fullPage: true, animations: 'disabled' });
  await mobile.goto(`${origin}${base}ratgeber/`, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: '.test-artifacts/blog-mobile.png', fullPage: true, animations: 'disabled' });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await mobile.setViewportSize({ width, height: 844 });
    for (const pathname of paths) {
      await mobile.goto(`${origin}${pathname}`, { waitUntil: 'domcontentloaded' });
      const dimensions = await mobile.evaluate(() => ({ width: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth }));
      if (dimensions.scroll > dimensions.width + 1) {
        const offenders = await mobile.evaluate(() => [...document.querySelectorAll('body *')].filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 8).map((element) => `${element.tagName}.${element.className} (${Math.round(element.getBoundingClientRect().right)}px)`));
        assert.fail(`Horizontal overflow on ${pathname} at ${width}px: ${dimensions.scroll} > ${dimensions.width}. ${offenders.join(', ')}`);
      }
    }
  }
  await mobileContext.close();
  assert.deepEqual(errors, [], `Browser errors: ${errors.join(', ')}`);
  console.log(`Verified ${paths.length} static pages, unique SEO metadata, internal links, desktop/mobile layouts and interactive controls.`);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}