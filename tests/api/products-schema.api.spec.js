
import { test, expect } from './fixtures/api.fixture.js';

import { productSchema } from './schemas/product.schema.js';

import { validateSchema } from './utils/schemaValidator.js';

test.describe('Product API Schema Validation @api @regression', () => {

  test('GET - Validate product response schema', async ({
    productClient,
  }) => {

    const response = await productClient.getProduct(1);

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Validate complete response against JSON Schema
    expect(
      validateSchema(productSchema, responseBody)
    ).toBe(true);

    // Additional business validation
    expect(responseBody.id).toBe(1);
    expect(responseBody.price).toBeGreaterThan(0);

  });

});
