
import { BaseClient } from './BaseClient.js';

export class ProductClient extends BaseClient {

  async getAllProducts() {
    return this.get('/products');
  }

  async getProduct(productId) {
    return this.get(`/products/${productId}`);
  }

  async createProduct(productData) {
    return this.post('/products/add', productData);
  }

  async updateProduct(productId, productData) {
    return this.put(`/products/${productId}`, productData);
  }

  async partiallyUpdateProduct(productId, productData) {
    return this.patch(`/products/${productId}`, productData);
  }

  async deleteProduct(productId) {
    return this.delete(`/products/${productId}`);
  }
}
