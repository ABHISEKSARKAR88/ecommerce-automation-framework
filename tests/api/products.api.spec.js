
import { test, expect } from '@playwright/test';

test.describe('Products API', () => {

  test('GET - Retrieve all products', async ({ request }) => {

    const response = await request.get(
      'https://dummyjson.com/products'
    );

    // Validate HTTP response
    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    // Parse response body
    const responseBody = await response.json();

    // Validate response structure
    expect(responseBody).toHaveProperty('products');
    expect(Array.isArray(responseBody.products)).toBeTruthy();

    // Validate business data
    expect(responseBody.products.length).toBeGreaterThan(0);

    const firstProduct = responseBody.products[0];

    expect(firstProduct).toHaveProperty('id');
    expect(firstProduct).toHaveProperty('title');
    expect(firstProduct).toHaveProperty('price');

    console.log('First product:', firstProduct.title);
    console.log('Product price:', firstProduct.price);
  });

});
