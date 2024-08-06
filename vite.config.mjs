/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';

import react from '@vitejs/plugin-react-swc';
import svgrPlugin from 'vite-plugin-svgr';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import { VitePWA } from 'vite-plugin-pwa';
import terser from '@rollup/plugin-terser';
import VitePluginReactRemoveAttributes from 'vite-plugin-react-remove-attributes';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import tsconfigPaths from 'vite-tsconfig-paths';

const manifest = require('./src/webmanifest.json');

const removeAttributes = VitePluginReactRemoveAttributes.default;

const envPrefix = 'REACT_APP_';

const isDevEnvironment = process.env.NODE_ENV === 'development';
const isProdEnvironment = process.env.NODE_ENV === 'production';

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
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.NO_DEVTOOLS': JSON.stringify(process.env.NO_DEVTOOLS || process.env.CI),
      'process.env.REACT_APP_VERSION': JSON.stringify(process.env.npm_package_version),
    },
    plugins: [
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
