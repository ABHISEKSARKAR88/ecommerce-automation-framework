
const { test: base, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { InventoryPage } = require('../pages/InventoryPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const { createCustomer } = require('../test-data/customerFactory');



const test = base.extend({
  standardUserPage: async ({ browser }, use) => {
  const context = await browser.newContext({
    storageState: 'playwright/.auth/standard-user.json',
  });

  try {
    const page = await context.newPage();
    await use(page);
  } finally {
    await context.close();
  }
},

problemUserPage: async ({ browser }, use) => {
  const context = await browser.newContext({
    storageState: 'playwright/.auth/problem-user.json',
  });

  try {
    const page = await context.newPage();
    await use(page);
  } finally {
    await context.close();
  }
},

authenticatedInventoryPage: async ({ standardUserPage }, use) => {
  await use(new InventoryPage(standardUserPage));
},

authenticatedCartPage: async ({ standardUserPage }, use) => {
  await use(new CartPage(standardUserPage));
},

authenticatedCheckoutPage: async ({ standardUserPage }, use) => {
  await use(new CheckoutPage(standardUserPage));
},

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  customerData: async ({}, use) => {
  // Setup
  const customer = createCustomer();
  console.log('Setup: Customer data generated:', customer.lastName);

  // Pass data to the test
  await use(customer);

  // Teardown
  console.log('Teardown: Customer data cleanup completed:', customer.lastName);
 },

 workerInfo: [
  async ({}, use) => {
    console.log('Worker fixture setup');

    await use();

    console.log('Worker fixture teardown');
  },
  { scope: 'worker' },
],

//Automatic Fixture
testLogger: [
  async ({}, use, testInfo) => {
    console.log(
      `Starting test: ${testInfo.title} | Retry: ${testInfo.retry}`
    );

    await use();

    console.log(
      `Finished test: ${testInfo.title} | Status: ${testInfo.status} | Retry: ${testInfo.retry}`
    );

    if (testInfo.status !== testInfo.expectedStatus) {
      console.log(
        `TEST NOT PASSED AS EXPECTED: ${testInfo.title}`
      );
    }
  },
  { auto: true },
],

});

module.exports = { test, expect };
