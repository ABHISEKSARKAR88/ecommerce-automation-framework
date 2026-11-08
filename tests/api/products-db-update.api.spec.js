
const { test, expect } = require('../db/fixtures/db.fixture');
const { ProductRepository } = require('../db/repositories/ProductRepository');

const productRepository = new ProductRepository();

test.describe('API Update to Database Integration', () => {
  test('should persist product updates through PUT API', async ({ request }) => {
    let productId;

    try {
      const createResponse = await request.post('/api/products', {
        data: {
          name: 'Original Laptop',
          price: 55000,
          category: 'Electronics',
        },
      });

      expect(createResponse.status()).toBe(201);

      const createdProduct = await createResponse.json();
      productId = createdProduct.id;

      const updateResponse = await request.put(
        `/api/products/${productId}`,
        {
          data: {
            name: 'Updated Laptop',
            price: 65000,
            category: 'Electronics',
          },
        }
      );

      expect(updateResponse.status()).toBe(200);

      const updatedApiProduct = await updateResponse.json();

      expect(updatedApiProduct.name).toBe('Updated Laptop');
      expect(Number(updatedApiProduct.price)).toBe(65000);

      const dbProduct = await productRepository.findById(productId);

      expect(dbProduct).not.toBeNull();
      expect(dbProduct.name).toBe(updatedApiProduct.name);
      expect(Number(dbProduct.price)).toBe(Number(updatedApiProduct.price));
      expect(dbProduct.category).toBe(updatedApiProduct.category);

    } finally {
      if (productId) {
        await productRepository.delete(productId);
      }
    }
  });
});
