
const { query } = require('../db');

class ProductRepository {
  async create(product) {
    const result = await query(
      `INSERT INTO products (name, price, category)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [product.name, product.price, product.category]
    );

    return result.rows[0];
  }

  async findById(id) {
    const result = await query(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  async update(id, product) {
    const result = await query(
      `UPDATE products
       SET name = $1, price = $2, category = $3
       WHERE id = $4
       RETURNING *`,
      [product.name, product.price, product.category, id]
    );

    return result.rows[0] || null;
  }

  async delete(id) {
    const result = await query(
      'DELETE FROM products WHERE id = $1 RETURNING id',
      [id]
    );

    return result.rowCount === 1;
  }


async findByName(name) {
  const result = await query(
    'SELECT * FROM products WHERE name = $1',
    [name]
  );

  return result.rows;
}

}

module.exports = { ProductRepository };
