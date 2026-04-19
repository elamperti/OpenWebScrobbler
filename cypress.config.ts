import { CypressEsm } from '@cypress/vite-plugin-cypress-esm';
import { defineConfig } from 'cypress';
import { mergeConfig } from 'vite';

import viteConfig from './vite.config.mjs';

import type { UserConfig } from 'vite';

export default defineConfig({
  projectId: 'b19z84',
  e2e: {
    async setupNodeEvents(on, config) {
      return (await import('./cypress/plugins/index.js')).default(on, config);
    },
    baseUrl: 'http://127.0.0.1:3030',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
    experimentalRunAllSpecs: true,
  },
  component: {
    devServer: {
      bundler: 'vite',
      framework: 'react',
      viteConfig: () => {
        return mergeConfig(viteConfig as UserConfig, {
          plugins: [CypressEsm()],
        });
      },
    },
  },
});
