import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Vite dev server (npm run dev di frontend/)
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    // Timeout santai karena fetch data publik (masjid/kajian) butuh backend
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    // Jangan fail build/lint karena video & screenshot
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here if needed
    },
  },
});
