
import { test, expect } from './fixtures/api.fixture.js';

test.describe('Authenticated Product API @api @smoke', () => {

  test('GET - Retrieve products using authenticated client', async ({
    authenticatedProductClient,
  }) => {

    const response =
      await authenticatedProductClient.getAllProducts();

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.products.length).toBeGreaterThan(0);

    expect(responseBody.products[0]).toHaveProperty('id');
    expect(responseBody.products[0]).toHaveProperty('title');

  });

});
