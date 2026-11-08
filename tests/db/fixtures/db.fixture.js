
const { test: base, expect } = require('@playwright/test');
const { closePool } = require('../db');

const test = base.extend({
  dbLifecycle: [
    async ({}, use) => {
      await use();
      await closePool();
    },
    { scope: 'worker', auto: true },
  ],
});

module.exports = { test, expect };
