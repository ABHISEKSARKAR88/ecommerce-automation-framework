
import {
  test as base,
  expect,
  request as apiRequest,
} from '@playwright/test';

import { ProductClient } from '../clients/ProductClient.js';

import { environment } from '../../../config/environment.js';

export const test = base.extend({

  authenticatedRequest: async ({ request }, use) => {

    const username = environment.apiCredentials.username;
    const password = environment.apiCredentials.password;

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
      baseURL: environment.apiBaseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    await use(apiContext);

    await apiContext.dispose();
  },

  productClient: async ({ request }, use) => {

    const client = new ProductClient(request);

    await use(client);
  },

  authenticatedProductClient: async ({
    authenticatedRequest,
  }, use) => {

    const client = new ProductClient(authenticatedRequest);

    await use(client);
  },

});

export { expect };
