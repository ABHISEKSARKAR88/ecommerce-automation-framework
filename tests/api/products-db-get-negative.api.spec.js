
const { test, expect } = require('../db/fixtures/db.fixture');

test.describe('API GET Negative Integration', () => {
  test('should return 404 when product does not exist', async ({ request }) => {
    const nonExistingId = 999999999;

    const response = await request.get(
      `/api/products/${nonExistingId}`
    );

    expect(response.status()).toBe(404);

    const responseBody = await response.json();

    expect(responseBody.message).toBe('Product not found');
  });
});
