
import { test, expect } from '@playwright/test';

test.describe('Products CRUD API @api @regression', () => {

  // POST - Create a product
  test('POST - Create a new product', async ({ request }) => {

    const newProduct = {
      title: 'QA Automation Laptop',
      price: 1200,
      description: 'Laptop created through API automation',
      category: 'electronics',
      stock: 25,
    };

    const response = await request.post('/products/add', {
      data: newProduct,
    });

    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    // Validate response data
    expect(responseBody.id).toBeTruthy();
    expect(responseBody.title).toBe(newProduct.title);
    expect(responseBody.price).toBe(newProduct.price);
    expect(responseBody.category).toBe(newProduct.category);
    expect(responseBody.stock).toBe(newProduct.stock);

    console.log('Created product ID:', responseBody.id);
  });


  // PUT - Replace a product
  test('PUT - Replace an existing product', async ({ request }) => {

    const updatedProduct = {
      title: 'Updated Automation Laptop',
      price: 1500,
      description: 'Completely updated product details',
      category: 'electronics',
      stock: 40,
    };

    const response = await request.put('/products/1', {
      data: updatedProduct,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Validate updated response
    expect(responseBody.id).toBe(1);
    expect(responseBody.title).toBe(updatedProduct.title);
    expect(responseBody.price).toBe(updatedProduct.price);
    expect(responseBody.description).toBe(updatedProduct.description);
    expect(responseBody.stock).toBe(updatedProduct.stock);
  });


  // PATCH - Partially update a product
  test('PATCH - Update product price', async ({ request }) => {

    const partialUpdate = {
      price: 999,
    };

    const response = await request.patch('/products/1', {
      data: partialUpdate,
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Validate partial update
    expect(responseBody.id).toBe(1);
    expect(responseBody.price).toBe(partialUpdate.price);

    // Other fields should remain represented in the response
    expect(responseBody).toHaveProperty('title');
  });


  // DELETE - Delete a product
  test('DELETE - Delete an existing product', async ({ request }) => {

    const response = await request.delete('/products/1');

    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    // Validate deletion response
    expect(responseBody.id).toBe(1);
    expect(responseBody.isDeleted).toBe(true);
    expect(responseBody).toHaveProperty('deletedOn');

    console.log('Deleted product ID:', responseBody.id);
  });

});
