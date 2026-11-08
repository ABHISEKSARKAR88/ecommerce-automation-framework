
const { test, expect } = require('../db/fixtures/db.fixture');
const { ProductRepository } = require('../db/repositories/ProductRepository');

const productRepository = new ProductRepository();

test.describe('Negative API to Database Integration', () => {
  test('should reject a product with invalid price without inserting it into DB', async ({ request }) => {
    const productName = `Invalid Product ${Date.now()}`;

    const response = await request.post('/api/products', {
      data: {
        name: productName,
        price: 0,
        category: 'Electronics',
      },
    });

    expect(response.status()).toBe(400);

    const responseBody = await response.json();

    expect(responseBody.message).toBe(
      'Valid name and positive price are required'
    );

    const dbProducts = await productRepository.findByName(productName);

    expect(dbProducts).toHaveLength(0);
  });
});
