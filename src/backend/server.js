
const app = require('./app');
const { environment } = require('../../config/environment');

const PORT = environment.port || 3000;

const server = app.listen(PORT, () => {
  console.log(
    `Backend server running on port ${PORT} (${environment.name})`
  );
});

async function shutdown() {
  console.log('Shutting down backend server...');

  server.close(async () => {
    try {
      const { closePool } = require('./config/database');
      await closePool();
      process.exit(0);
    } catch (error) {
      console.error('Error closing database pool:', error);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
