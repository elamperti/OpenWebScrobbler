/// <reference types="vitest" />
import terser from '@rollup/plugin-terser';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { VitePWA } from 'vite-plugin-pwa';
import VitePluginReactRemoveAttributes from 'vite-plugin-react-remove-attributes';
import svgrPlugin from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import manifest from './src/webmanifest.json' with { type: 'json' };

const removeAttributes = VitePluginReactRemoveAttributes.default;

const envPrefix = 'REACT_APP_';

const isDevEnvironment = process.env.NODE_ENV === 'development';
const isProdEnvironment = process.env.NODE_ENV === 'production';

const showCurrentEnvPlugin = () => ({
  name: 'show-current-env',
  configureServer(server) {
    const originalPrintUrls = server.printUrls;
    server.printUrls = () => {
      originalPrintUrls();
      const env = process.env.NODE_ENV || 'development';
      const bold = '\x1b[1m';
      let color = '\x1b[33m'; // yellow
      if (env === 'development') color = '\x1b[32m';
      else if (env === 'test') color = '\x1b[36m';
      else if (env === 'production') color = '\x1b[31m';
      const reset = '\x1b[0m';
      // eslint-disable-next-line no-console
      console.log(`  ➜  Current environment: ${color}${bold}${env}${reset}`);
    };
  },
});

const defineReactAppEnv = (mode) => {
  const env = loadEnv(mode, process.cwd(), '');
  return Object.keys(env).reduce((acc, key) => {
    if (key.startsWith(envPrefix)) {
      acc[`process.env.${key}`] = JSON.stringify(env[key]);
    }
    return acc;
  }, {});
};

const reactCompilerConfig = {};

// https://vitejs.dev/config/
const viteConfig = ({ mode }) =>
  defineConfig({
    base: '/',
    server: {
      host: true,
      // port: 3000,
      strictPort: true,
      clearScreen: false,
      proxy: {
        '/api': {
          target: 'http://localhost:3274/',
          changeOrigin: true,
        },
      },
    },
    envPrefix,
    define: {
      ...defineReactAppEnv(mode),
      // Allow this var to be set dynamically in frontend
      'process.env.REACT_APP_LASTFM_API_KEY': 'window.__env.REACT_APP_LASTFM_API_KEY',
      'process.env.REACT_APP_HOST': 'window.location.host',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NO_DEVTOOLS': JSON.stringify(process.env.NO_DEVTOOLS || process.env.CI),
      'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
      showCurrentEnvPlugin(),
      tsconfigPaths(),
      react({
        babel: {
          plugins: [
            ['babel-plugin-react-compiler', reactCompilerConfig], // must run first!
            [
              '@locator/babel-jsx/dist',
              {
                env: 'development',
              },
            ],
          ],
        },
      }),
      svgrPlugin(),
      removeAttributes({
        attributes: ['data-cy'],
      }),
      viteExternalsPlugin({
        'redux-logger': isDevEnvironment ? 'redux-logger' : 'window',
      }),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        srcDir: 'build',
        filename: 'service-worker.js',
        manifest,
        manifestFilename: 'site.webmanifest',
        minify: false, // Applies to manifest
        workbox: {
          navigateFallbackDenylist: [/^\/api/],
        },
      }),
      sentryVitePlugin({
        disable: process.env.NODE_ENV !== 'production',
        bundleSizeOptimizations: {
          excludeDebugStatements: true,
          excludeReplayIframe: true,
        },
      }),
    ],
    build: {
      outDir: 'build',
      assetsDir: 'static',
      sourcemap: true,
      minify: 'terser',
      rollupOptions: {
        plugins: [
          terser({
            format: {
              comments: false,
            },
          }),
        ],
        mangle: {
          keep_classnames: false,
          reserved: [],
        },
      },
    },
    test: {
      coverage: {
        provider: 'v8',
        enabled: true,
        reporter: ['lcov', 'html'],
        reportsDirectory: './coverage',
        thresholds: {
          statements: 10,
          branches: 50,
          functions: 10,
          lines: 10,
        },
        include: ['src/**'],
        exclude: ['src/**/*.test.*', 'src/**/*.d.ts'],
      },
      globals: true,
      environment: 'jsdom',
      setupFiles: 'src/setupTests.ts',
    },
  });

export default viteConfig;
