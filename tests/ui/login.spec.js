
const { test, expect } = require('../../fixtures/test');
// const { test, expect } = require('./../pages/LoginPage')
// const { LoginPage } = require('../../pages/LoginPage');

test.describe('Login functionality' , () =>{
test('valid user can log in successfully @smoke', async ({ page, loginPage }) => {
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('login fails with invalid credentials @regression', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('invalid_user', 'wrong_password');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText(
    'Username and password do not match'
  );
});

test('login fails when username and password are empty @regression', async ({ loginPage }) => {
  await loginPage.goto();
  await loginPage.login('', '');

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toContainText('Username is required');
});
});
