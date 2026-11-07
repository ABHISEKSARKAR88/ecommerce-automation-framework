
export class ProductFactory {

  static createProduct(overrides = {}) {

    return {
      title: 'QA Automation Product',
      price: 1200,
      description: 'Product generated for API testing',
      category: 'electronics',
      stock: 25,
      ...overrides,
    };

  }

}
