
import { test, expect } from '@playwright/test';

test.describe('API Negative Testing @api @regression', () => {

  test('GET - Non-existent product should return 404', async ({ request }) => {

    const response = await request.get('/products/999999');

    expect(response.status()).toBe(404);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('message');

    console.log('Error response:', responseBody.message);
  });


  test('GET - Invalid product ID should return 404', async ({ request }) => {

    const response = await request.get('/products/invalid-id');

    expect(response.status()).toBe(404);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('message');
  });


  test('GET - Missing authentication token should return 401', async ({ request }) => {

    const response = await request.get('/auth/me');

    expect(response.status()).toBe(401);
  });


  test('GET - Invalid authentication token should return 401', async ({ request }) => {

    const response = await request.get('/auth/me', {
      headers: {
        Authorization: 'Bearer invalid-token-12345',
      },
    });

    expect(response.status()).toBe(401);
  });


test('GET - Validate response headers', async ({ request }) => {

  const response = await request.get('/products');

  expect(response.status()).toBe(200);

  const headers = response.headers();

  expect(headers['content-type']).toContain('application/json');

});


test('GET - Validate API response time', async ({ request }) => {

  const startTime = Date.now();

  const response = await request.get('/products');

  const responseTime = Date.now() - startTime;

  expect(response.status()).toBe(200);

  console.log(`API response time: ${responseTime} ms`);

  // Generous threshold for a practice API
  expect(responseTime).toBeLessThan(3000);

});


});
