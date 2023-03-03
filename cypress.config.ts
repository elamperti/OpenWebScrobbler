import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: 'b19z84',
  e2e: {
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config);
    },
    baseUrl: 'http://localhost:3030',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
