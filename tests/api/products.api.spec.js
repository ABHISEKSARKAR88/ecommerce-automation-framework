
import { test, expect } from '@playwright/test';

test.describe('Products API', () => {

  test('GET - Retrieve all products', async ({ request }) => {

    const response = await request.get('/products');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('products');
    expect(Array.isArray(responseBody.products)).toBeTruthy();

    expect(responseBody.products.length).toBeGreaterThan(0);

    const firstProduct = responseBody.products[0];

    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');

    console.log('First product:', firstProduct.title);
    console.log('Product price:', firstProduct.price);
  });

});
