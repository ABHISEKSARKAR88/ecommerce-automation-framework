
const { test, expect } = require('../../fixtures/test');
const path = require('path');

test('handle JavaScript alert dialog @regression', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'fixtures/dialogs.html');

  await page.goto(`file://${filePath}`);

  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).not.toBe('');

    console.log('Dialog type:', dialog.type());
    console.log('Dialog message:', dialog.message());

    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Show Alert' }).click();
});

test('handle JavaScript confirm dialog @regression', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'fixtures/dialogs.html');

  await page.goto(`file://${filePath}`);

  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    expect(dialog.message()).not.toBe('');

    console.log('Dialog type:', dialog.type());
    console.log('Dialog message:', dialog.message());

    await dialog.dismiss();
  });

  await page.getByRole('button', { name: 'Show Confirm' }).click();

  await expect(page.locator('#result')).toHaveText('false');
});

test('handle JavaScript prompt dialog @regression', async ({ page }) => {
  const filePath = path.resolve(__dirname, 'fixtures/dialogs.html');

  await page.goto(`file://${filePath}`);

  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('prompt');
    expect(dialog.message()).not.toBe('');

    console.log('Dialog type:', dialog.type());
    console.log('Dialog message:', dialog.message());

    await dialog.accept('Abhisek');
  });

  await page.getByRole('button', { name: 'Show Prompt' }).click();

  await expect(page.locator('#result')).toHaveText('Abhisek');
});
