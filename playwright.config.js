
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  fullyParallel: true,

  forbidOnly: Boolean(process.env.CI),

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 2 : undefined,

  reporter: [
  ['list'],
  ['html', { open: 'never' }],
  ['junit', {
    outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME
      ? `test-results/${process.env.PLAYWRIGHT_JUNIT_OUTPUT_NAME}`
      : 'test-results/results.xml',
  }],
],

  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },


projects: [
  {
    name: 'setup',
    testMatch: '**/auth.setup.js',
  },

  {
    name: 'chromium',
    use: {
      browserName: 'chromium',
    },
    dependencies: ['setup'],
    testIgnore: [
      '**/auth.setup.js',
      '**/api/**',
      '**/flaky-demo.spec.js',
    ],
  },

  {
    name: 'firefox',
    use: {
      browserName: 'firefox',
    },
    dependencies: ['setup'],
    testIgnore: [
      '**/auth.setup.js',
      '**/api/**',
      '**/flaky-demo.spec.js',
    ],
  },

  {
    name: 'webkit',
    use: {
      browserName: 'webkit',
      viewport: {
        width: 1440,
        height: 900,
      },
    },
    dependencies: ['setup'],
    testIgnore: [
      '**/auth.setup.js',
      '**/api/**',
      '**/flaky-demo.spec.js',
    ],
  },

  {
    name: 'api',
    testMatch: '**/*.api.spec.js',
    use: {
      baseURL: 'https://dummyjson.com',
    },
  },
],

});
