const constants = require('./constants');

// Container for all environments
const environments = {};

environments.development = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  receiverTopics: {
    homeClima: '/home/living-room/#',
    weather: '/weather/#',
  },
  envName: constants.ENVIRONMENTS.DEVELOPMENT,
  log: {
    level: process.env.LOG_LEVEL,
  },
  firebaseDB: {
    serviceAccountKey: process.env.FIREBASE_SERVICE_KEY,
    url: process.env.FIREBASE_URL,
  },
};

environments.production = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  receiverTopics: {
    homeClima: '/home/living-room/#',
    weather: '/weather/#',
  },
  envName: constants.ENVIRONMENTS.PRODUCTION,
  log: {
    level: process.env.LOG_LEVEL,
  },
  firebaseDB: {
    serviceAccountKey: process.env.FIREBASE_SERVICE_KEY,
    url: process.env.FIREBASE_URL,
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
