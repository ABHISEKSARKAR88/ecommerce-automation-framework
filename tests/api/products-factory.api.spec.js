
import { test, expect } from './fixtures/api.fixture.js';
import { ProductFactory } from '../../test-data/productFactory.js';

test('POST - Create product using test data factory', async ({
  productClient,
}) => {

  const productData = ProductFactory.createProduct({
    title: 'Gaming Laptop',
    price: 2500,
  });

  const response = await productClient.createProduct(productData);

  expect(response.status()).toBe(201);

  const responseBody = await response.json();

  expect(responseBody.title).toBe(productData.title);
  expect(responseBody.price).toBe(productData.price);
  expect(responseBody.category).toBe(productData.category);

});
