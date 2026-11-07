
import { test, expect } from './fixtures/api.fixture.js';

test.describe('Authenticated API Tests @api @smoke', () => {

  test('GET - Retrieve current authenticated user', async ({
    authenticatedRequest,
  }) => {

    const response = await authenticatedRequest.get('/auth/me');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Validate authenticated user
    expect(responseBody.username).toBe('emilys');
    expect(responseBody).toHaveProperty('id');
    expect(responseBody).toHaveProperty('email');

    console.log('Authenticated user:', responseBody.username);
  });

});
