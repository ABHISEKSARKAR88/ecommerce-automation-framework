
const { test, expect } = require('./fixtures/db.fixture');
const { query, transaction } = require('./db');

test.describe('PostgreSQL Transactions', () => {

  test('should commit changes when transaction succeeds', async () => {
    const product = await transaction(async (client) => {
      const result = await client.query(
        `INSERT INTO products (name, price, category)
         VALUES ($1, $2, $3)
         RETURNING *`,
        ['Committed Laptop', 75000, 'Electronics']
      );

      return result.rows[0];
    });

    expect(product.name).toBe('Committed Laptop');

    const result = await query(
      'SELECT * FROM products WHERE id = $1',
      [product.id]
    );

    expect(result.rows).toHaveLength(1);

    // Cleanup
    await query('DELETE FROM products WHERE id = $1', [product.id]);
  });

  test('should rollback changes when transaction fails', async () => {
    let productId;

    await expect(
      transaction(async (client) => {
        const result = await client.query(
          `INSERT INTO products (name, price, category)
           VALUES ($1, $2, $3)
           RETURNING id`,
          ['Rollback Laptop', 85000, 'Electronics']
        );

        productId = result.rows[0].id;

        throw new Error('Simulated transaction failure');
      })
    ).rejects.toThrow('Simulated transaction failure');

    const result = await query(
      'SELECT * FROM products WHERE id = $1',
      [productId]
    );

    expect(result.rows).toHaveLength(0);
  });

});
