
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const supportedEnvironments = ['local', 'qa', 'staging'];

const environmentName = process.env.TEST_ENV || 'local';

if (!supportedEnvironments.includes(environmentName)) {
  throw new Error(
    `Unsupported TEST_ENV: ${environmentName}. Supported values: ${supportedEnvironments.join(', ')}`
  );
}

const envFilePath = path.resolve(
  process.cwd(),
  `.env.${environmentName}`
);

if (fs.existsSync(envFilePath)) {
  const result = dotenv.config({
    path: envFilePath,
    override: false,
  });

  if (result.error) {
    throw result.error;
  }
} else if (environmentName !== 'local') {
  throw new Error(
    `Environment file not found: ${envFilePath}`
  );
}

function getValue(key, localDefault) {
  const value = process.env[key];

  if (value && value.trim()) {
    return value.trim();
  }

  if (environmentName === 'local') {
    return localDefault;
  }

  return undefined;
}

const environment = {
  name: environmentName,

  uiBaseUrl: getValue(
    'UI_BASE_URL',
    'https://www.saucedemo.com'
  ),

  apiBaseUrl: getValue(
    'API_BASE_URL',
    'https://dummyjson.com'
  ),

  backendBaseUrl: getValue(
    'BACKEND_BASE_URL',
    'http://localhost:3000'
  ),

  port: Number(getValue('PORT', '3000')),

  database: {
    host: getValue('DB_HOST'),
    port: Number(getValue('DB_PORT')),
    name: getValue('DB_NAME'),
    user: getValue('DB_USER'),
    password: getValue('DB_PASSWORD'),
  },

  apiCredentials: {
    username: getValue('API_USERNAME', 'emilys'),
    password: getValue('API_PASSWORD', 'emilyspass'),
  },
};

if (environmentName !== 'local') {
  const requiredUrls = [
    'uiBaseUrl',
    'apiBaseUrl',
    'backendBaseUrl',
  ];

  const missing = requiredUrls.filter(
    key => !environment[key]
  );

  if (missing.length > 0) {
    throw new Error(
      `Missing environment configuration for ${environmentName}: ${missing.join(', ')}`
    );
  }
}

module.exports = { environment };
