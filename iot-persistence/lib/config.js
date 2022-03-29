const constants = require('./constants');

// Container for all environments
const environments = {};

environments.development = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  receiverTopics: process.env.MQTT_TOPICS.split(','),
  envName: constants.ENVIRONMENTS.DEVELOPMENT,
  log: {
    level: 'debug',
  },
  postgresDB: {
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    tableNames: process.env.TABLE_NAMES.split(','),
  },
};

environments.production = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  receiverTopics: process.env.MQTT_TOPICS.split(','),
  envName: constants.ENVIRONMENTS.PRODUCTION,
  log: {
    level: 'info',
  },
  postgresDB: {
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    tableNames: process.env.TABLE_NAMES.split(','),
  },
};

// Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment defined above,
// if not default to production
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.production;

// export the module
module.exports = environmentToExport;
