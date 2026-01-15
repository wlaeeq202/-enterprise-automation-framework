// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Run tests in /src, but ignore Selenium folder
  testDir: './src',
  testIgnore: ['**/selenium/**'],

  timeout: 30 * 1000,
  expect: {
    timeout: 5 * 1000,
  },

  fullyParallel: true,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    }
  ],
});
