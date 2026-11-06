
const { test, expect } = require('../../fixtures/test');
const path = require('path');

test('interact with nested iframe @regression', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'fixtures/nested-iframe.html');

  await page.goto(`file://${filePath}`);

  const childFrame = page
    .frameLocator('#parent-frame')
    .frameLocator('#child-frame');

  await childFrame.getByLabel('Email').fill('test@example.com');

  await childFrame.getByRole('button', { name: 'Submit' }).click();

  await expect(childFrame.locator('#result'))
    .toHaveText('Form submitted successfully');
});
