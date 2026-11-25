import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const hero = (await readFile('public/images/hero-tarifpilot.jpg')).toString('base64');
const font = (await readFile('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2')).toString('base64');
const mark = `<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="42" height="42" rx="12" fill="#2563eb"/><path d="M30.5 12.8 25.2 29.9l-4.1-6.2-6.5-3.9 15.9-7Z" fill="white"/><path d="m20.9 23.5-3.6 3.6" stroke="white" stroke-width="2.2" stroke-linecap="round"/></svg>`;
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.setContent(`<!doctype html><html><head><style>
    @font-face{font-family:Manrope;src:url(data:font/woff2;base64,${font}) format('woff2');font-weight:200 800}
    *{box-sizing:border-box}body{margin:0;color:#10213d;font-family:Manrope,Arial,sans-serif}
    .canvas{width:1200px;height:630px;position:relative;overflow:hidden;background:#eaf1ff}
    .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
    .fade{position:absolute;inset:0;background:linear-gradient(90deg,#eef5fd 0%,rgba(238,245,253,.98) 31%,rgba(238,245,253,.76) 48%,rgba(238,245,253,0) 72%)}
    .content{position:relative;padding:58px 68px;width:720px}.brand{display:flex;align-items:center;gap:12px;font-weight:800;font-size:36px;letter-spacing:-1.8px}.brand svg{width:50px;height:50px}.brand em{font-style:normal;color:#2563eb}
    .label{margin-top:89px;color:#2563eb;font-size:13px;font-weight:800;letter-spacing:2px}.title{margin:14px 0 0;font-size:49px;font-weight:800;letter-spacing:-2.8px;line-height:1.18}.title span{color:#2563eb}.sub{margin-top:20px;color:#526781;font-size:18px;font-weight:600}
  </style></head><body><div class="canvas"><img class="photo" src="data:image/jpeg;base64,${hero}"/><div class="fade"></div><div class="content"><div class="brand">${mark}<span>Tarif<em>Pilot.</em></span></div><div class="label">DEIN KOMPASS IM TARIFDSCHUNGEL</div><div class="title">Finde den passenden Tarif.<br/><span>Vergleiche clever.</span><br/>Spare mehr.</div><div class="sub">Verständlich. Transparent. Für dich.</div></div></div></body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'public/images/og-tarifpilot.jpg', type: 'jpeg', quality: 86 });
  await page.setViewportSize({ width: 192, height: 192 });
  await page.setContent(`<html><body style="margin:0;width:192px;height:192px">${mark.replace('<svg ', '<svg width="192" height="192" ')}</body></html>`);
  await page.screenshot({ path: 'public/icon-192.png', omitBackground: true });
} finally {
  await browser.close();
}