const {test , expect} = require('@playwright/test');

test('framework smoke test, SauceDemo is accessible', async ({ page }) => {

    await page.goto('/');
    await expect(page).toHaveTitle(/Swag Labs/);
    await expect(page.getByText('Swag Labs')).toBeVisible();
})