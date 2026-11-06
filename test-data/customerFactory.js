const { randomUUID } = require('node:crypto');

function createCustomer() {
  const uniqueId = randomUUID();

  return {
    firstName: 'Test',
    lastName: `User_${uniqueId}`,
    postalCode: '560001',
  };
}

module.exports = { createCustomer };
