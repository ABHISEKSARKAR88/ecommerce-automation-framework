
import { test, expect } from '@playwright/test';

test.describe('API Authentication', () => {

  test('POST - Login and retrieve access token', async ({ request }) => {

    const credentials = {
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 30,
    };

    const response = await request.post('/auth/login', {
      data: credentials,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toHaveProperty('accessToken');
    expect(responseBody.accessToken).toBeTruthy();

    expect(responseBody.username).toBe(credentials.username);

    console.log('Login successful');
    console.log('Token received:', Boolean(responseBody.accessToken));
  });

});
