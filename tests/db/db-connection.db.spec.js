
const { test, expect } = require('./fixtures/db.fixture');
const { query } = require('./db');

test.describe('PostgreSQL connectivity', () => {
  test('should connect to PostgreSQL and execute a query', async () => {
    const result = await query(
      'SELECT current_user, current_database()'
    );

    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].current_user).toBe('ecommerce_qa');
    expect(result.rows[0].current_database).toBe('ecommerce_test');
  });
});
