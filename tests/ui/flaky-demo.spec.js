
const { test, expect } = require('../../fixtures/test');

test('demonstrate a flaky test @regression', async ({ page }) => {
  const attempt = test.info().retry;

  console.log(`Current attempt: ${attempt}`);

  // Deliberately fail the first attempt.
  if (attempt === 0) {
    expect(1).toBe(2);
  }

  // Pass on the retry.
  expect(1).toBe(1);
});

test('demonstrate a permanently failing test @regression', async () => {
  expect(1).toBe(2);
});

test('debug locator failure using trace @regression', async ({ page }) => {
  await page.goto('/');

  // Intentionally use an incorrect locator.
  await page.getByRole('button', { name: 'Login' }).click();
});