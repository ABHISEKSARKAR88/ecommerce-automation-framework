
const { test, expect } = require('../db/fixtures/db.fixture');
const { ProductRepository } = require('../db/repositories/ProductRepository');

const productRepository = new ProductRepository();

test.describe('API Delete to Database Integration', () => {
  test('should delete product through API and remove it from DB', async ({ request }) => {
    let productId;

    try {
      const createResponse = await request.post('/api/products', {
        data: {
          name: 'Delete Integration Laptop',
          price: 45000,
          category: 'Electronics',
        },
      });

      expect(createResponse.status()).toBe(201);

      const createdProduct = await createResponse.json();
      productId = createdProduct.id;

      const deleteResponse = await request.delete(
        `/api/products/${productId}`
      );

      expect(deleteResponse.status()).toBe(200);

      const responseBody = await deleteResponse.json();

      expect(responseBody.message).toBe('Product deleted successfully');

      const dbProduct = await productRepository.findById(productId);

      expect(dbProduct).toBeNull();

    } finally {
      if (productId) {
        await productRepository.delete(productId);
      }
    }
  });
});
