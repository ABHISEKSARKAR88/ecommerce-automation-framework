
const { test, expect } = require('../../fixtures/test');
const path = require('path');

test('interact with iframe using frameLocator @regression', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'fixtures/iframe.html');

  await page.goto(`file://${filePath}`);

  const paymentFrame = page.frameLocator('#payment-frame');

  await paymentFrame.getByLabel('Card Number').fill('4111111111111111');

  await paymentFrame.getByRole('button', { name: 'Pay Now' }).click();

  await expect(paymentFrame.locator('#result'))
    .toHaveText('Payment submitted successfully');
});
