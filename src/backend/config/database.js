
const { Pool } = require('pg');
const { environment } = require('../../../config/environment');

const dbConfig = environment.database;

const requiredFields = [
  'host',
  'port',
  'name',
  'user',
  'password',
];

const missingFields = requiredFields.filter(
  field => dbConfig[field] === undefined ||
           dbConfig[field] === null ||
           dbConfig[field] === ''
);

if (missingFields.length > 0) {
  throw new Error(
    `Missing database configuration: ${missingFields.join(', ')}`
  );
}

const pool = new Pool({
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.name,
  user: dbConfig.user,
  password: dbConfig.password,
  max: 5,
  connectionTimeoutMillis: 5000,
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function transaction(callback) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await callback(client);

    await client.query('COMMIT');

    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch (rollbackError) {
      error.rollbackError = rollbackError;
    }

    throw error;
  } finally {
    client.release();
  }
}

async function closePool() {
  await pool.end();
}

module.exports = {
  query,
  transaction,
  closePool,
};
