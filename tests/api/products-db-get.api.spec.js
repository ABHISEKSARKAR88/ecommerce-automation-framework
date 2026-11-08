
const { test, expect } = require('../db/fixtures/db.fixture');
const { ProductRepository } = require('../db/repositories/ProductRepository');

const productRepository = new ProductRepository();

test.describe('API GET to Database Integration', () => {
  test('should retrieve product through GET API from database', async ({ request }) => {
    const productData = {
      name: `GET Product ${Date.now()}`,
      price: 1500,
      category: 'Electronics',
    };

    let productId;

    try {
      const createdProduct = await productRepository.create(productData);
      productId = createdProduct.id;

      const response = await request.get(
        `/api/products/${productId}`
      );

      expect(response.status()).toBe(200);

      const responseBody = await response.json();

      expect(responseBody.id).toBe(productId);
      expect(responseBody.name).toBe(productData.name);
      expect(Number(responseBody.price)).toBe(productData.price);
      expect(responseBody.category).toBe(productData.category);

    } finally {
      if (productId) {
        await productRepository.delete(productId);
      }
    }
  });
});
