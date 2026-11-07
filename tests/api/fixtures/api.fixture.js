
import {
  test as base,
  expect,
  request as apiRequest,
} from '@playwright/test';

import { ProductClient } from '../clients/ProductClient.js';

const API_BASE_URL = 'https://dummyjson.com';

export const test = base.extend({

  // Authenticated API context
  authenticatedRequest: async ({ request }, use) => {

    const username = process.env.API_USERNAME || 'emilys';
    const password = process.env.API_PASSWORD || 'emilyspass';

    const loginResponse = await request.post('/auth/login', {
      data: {
        username,
        password,
        expiresInMins: 30,
      },
    });

    expect(loginResponse.status()).toBe(200);

    const loginBody = await loginResponse.json();
    const accessToken = loginBody.accessToken;

    expect(accessToken).toBeTruthy();

    const apiContext = await apiRequest.newContext({
      baseURL: API_BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    await use(apiContext);

    await apiContext.dispose();
  },

  // Unauthenticated product client
  productClient: async ({ request }, use) => {

    const client = new ProductClient(request);

    await use(client);
  },

  // Authenticated product client
  authenticatedProductClient: async ({
    authenticatedRequest,
  }, use) => {

    const client = new ProductClient(authenticatedRequest);

    await use(client);
  },

});

export { expect };
