
const { test, expect } = require('../../fixtures/test');

test('customer data fixture generates unique customer data', async ({ customerData }) => {
  expect(customerData.firstName).toBe('Test');
  expect(customerData.lastName).toMatch(/^User_[0-9a-f-]{36}$/);
  expect(customerData.postalCode).toBe('560001');
  

  console.log('Generated customer:', customerData);
});

test('verify worker fixture @regression', async ({ workerInfo }) => {
  console.log('Executing test using worker fixture');
});

test('worker fixture test 1 @regression', async ({ workerInfo, customerData }) => {
  console.log('Executing worker test 1');
});

test('worker fixture test 2 @regression', async ({ workerInfo, customerData }) => {
  console.log('Executing worker test 2');
});

test('verify fixture dependency @regression', async ({
  standardUserPage,
  authenticatedInventoryPage,
}) => {
  await standardUserPage.goto('/inventory.html');

  await authenticatedInventoryPage.expectLoaded();
});