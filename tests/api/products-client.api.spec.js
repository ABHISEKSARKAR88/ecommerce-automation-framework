
import { test, expect } from './fixtures/api.fixture.js';

test.describe('Product API Client Tests @api @smoke', () => {

  test('GET - Retrieve all products', async ({ productClient }) => {

    const response = await productClient.getAllProducts();

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.products.length).toBeGreaterThan(0);

    expect(responseBody.products[0]).toHaveProperty('id');
    expect(responseBody.products[0]).toHaveProperty('title');

  });


  test('GET - Retrieve product by ID', async ({ productClient }) => {

    const response = await productClient.getProduct(1);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBeTruthy();

  });

});
