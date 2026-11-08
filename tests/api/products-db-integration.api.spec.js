
const { test, expect } = require('../db/fixtures/db.fixture');
const { ProductRepository } = require('../db/repositories/ProductRepository');

const productRepository = new ProductRepository();

test.describe('API to Database Integration', () => {
  test('should persist a product created through POST API', async ({ request }) => {
    let productId;

    try {
      const response = await request.post('/api/products', {
        data: {
          name: 'Playwright Integration Product',
          price: 85000,
          category: 'Electronics',
        },
      });

      expect(response.status()).toBe(201);

      const apiProduct = await response.json();

      expect(apiProduct.name).toBe('Playwright Integration Product');
      expect(Number(apiProduct.price)).toBe(85000);

      productId = apiProduct.id;

      const dbProduct = await productRepository.findById(productId);

      expect(dbProduct).not.toBeNull();
      expect(dbProduct.name).toBe(apiProduct.name);
      expect(Number(dbProduct.price)).toBe(Number(apiProduct.price));
      expect(dbProduct.category).toBe(apiProduct.category);

    } finally {
      if (productId) {
        await productRepository.delete(productId);
      }
    }
  });
});
