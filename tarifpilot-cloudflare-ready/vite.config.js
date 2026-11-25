import { execFileSync } from 'node:child_process';
import { defineConfig, mergeConfig } from 'vite';
import originalConfig from './vite.config.ts';

// Cloudflare Pages / custom-domain configuration.
// Set SITE_URL in the Cloudflare Pages build environment to the final public URL.
const siteUrl = process.env.SITE_URL || 'https://YOUR-DOMAIN/';

export default mergeConfig(
  originalConfig,
  defineConfig({
    base: '/',
    plugins: [
      {
        name: 'tarifpilot-static-pages',
        apply: 'build',
        closeBundle() {
          execFileSync(process.execPath, ['scripts/postbuild.mjs'], {
            stdio: 'inherit',
            env: { ...process.env, SITE_URL: siteUrl },
          });
        },
      },
    ],
  })
);
