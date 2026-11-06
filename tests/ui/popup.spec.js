
const { test, expect } = require('../../fixtures/test');
const path = require('path');

test('handle a new tab popup @regression', async ({ page, context }) => {
  const filePath = path.resolve(__dirname, 'fixtures/popup.html');

  await page.goto(`file://${filePath}`);

  const popupPromise = page.waitForEvent('popup');

  await page.getByRole('button', { name: 'Open New Tab' }).click();

  const popup = await popupPromise;

  expect(popup.context()).toBe(context);

  await expect(popup).toHaveURL('https://example.com/');
  await expect(popup).toHaveTitle('Example Domain');
});

test('handle a new page using browser context @regression', async ({ page, context }) => {
  const filePath = path.resolve(__dirname, 'fixtures/popup.html');

  await page.goto(`file://${filePath}`);

  const newPagePromise = context.waitForEvent('page');

  await page.getByRole('button', { name: 'Open New Tab' }).click();

  const newPage = await newPagePromise;

  expect(newPage.context()).toBe(context);

  await expect(newPage).toHaveURL('https://example.com/');
  await expect(newPage).toHaveTitle('Example Domain');
});

test('work with multiple tabs @regression', async ({ page, context }) => {
  await page.goto('https://example.com');

  const firstTab = page;

  const secondTab = await context.newPage();

  try {
    await secondTab.goto('https://www.wikipedia.org');

    const pages = context.pages();

    console.log('Open tabs:', pages.length);

    expect(pages).toHaveLength(2);

    await expect(firstTab).toHaveTitle('Example Domain');
    await expect(secondTab).toHaveTitle(/Wikipedia/);

    // Bring the first tab to the foreground
    await firstTab.bringToFront();

    // Bring the second tab to the foreground
    await secondTab.bringToFront();

  } finally {
    // Always close the manually created second tab
    await secondTab.close();
  }

  await expect(firstTab).toHaveTitle('Example Domain');
});
