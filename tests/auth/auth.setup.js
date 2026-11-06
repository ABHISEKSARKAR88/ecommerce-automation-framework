const { test: setup, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { users } = require('../../test-data/testData');

setup('authenticate standard user', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(
    users.standard.username,
    users.standard.password
  );

  await expect(page).toHaveURL(/inventory\.html/);

  await page.context().storageState({
    path: 'playwright/.auth/standard-user.json',
  });
});

setup('authenticate problem user', async ({ browser }) => {
  const context = await browser.newContext();

try {
  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(
    users.problem.username,
    users.problem.password
  );

  await expect(page).toHaveURL(/inventory\.html/);

  await context.storageState({
    path: 'playwright/.auth/problem-user.json',
  });
} finally {
  await context.close();
}
});