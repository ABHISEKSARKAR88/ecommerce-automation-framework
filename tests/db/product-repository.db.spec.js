
const { test, expect } = require('./fixtures/db.fixture');
const { ProductRepository } = require('./repositories/ProductRepository');

const productRepository = new ProductRepository();

async function createTestProduct() {
  return productRepository.create({
    name: `Test Laptop ${Date.now()}`,
    price: 55000,
    category: 'Electronics',
  });
}

test.describe('Product Repository - Independent CRUD Tests', () => {

  test('should create a product', async () => {
    let product;

    try {
      product = await createTestProduct();

      expect(product.name).toContain('Test Laptop');
      expect(Number(product.price)).toBe(55000);
    } finally {
      if (product) {
        await productRepository.delete(product.id);
      }
    }
  });

  test('should retrieve a product', async () => {
    let product;

    try {
      product = await createTestProduct();

      const retrievedProduct =
        await productRepository.findById(product.id);

      expect(retrievedProduct).not.toBeNull();
      expect(retrievedProduct.name).toBe(product.name);
    } finally {
      if (product) {
        await productRepository.delete(product.id);
      }
    }
  });

  test('should update a product', async () => {
    let product;

    try {
      product = await createTestProduct();

      const updatedProduct = await productRepository.update(
        product.id,
        {
          name: 'Updated Laptop',
          price: 60000,
          category: 'Electronics',
        }
      );

      expect(updatedProduct.name).toBe('Updated Laptop');
      expect(Number(updatedProduct.price)).toBe(60000);
    } finally {
      if (product) {
        await productRepository.delete(product.id);
      }
    }
  });

  test('should delete a product', async () => {
    const product = await createTestProduct();

    const deleted = await productRepository.delete(product.id);

    expect(deleted).toBe(true);

    const retrievedProduct =
      await productRepository.findById(product.id);

    expect(retrievedProduct).toBeNull();
  });

});
