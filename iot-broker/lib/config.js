const constants = require('./constants');

// Container for all environments
const environments = {};

// environments.production = {
//   mqtt: {
//     broker: process.env.MQTT_BROKER_HOST,
//     port: process.env.MQTT_BROKER_PORT,
//     username: process.env.MQTT_USERNAME,
//     password: process.env.MQTT_PASSWORD,
//   },
//   envName: constants.ENVIRONMENTS.PRODUCTION,
//   log: {
//     level: process.env.LOG_LEVEL,
//   },
//   measurement: {
//     readInterval: 1,
//   },
// };

// environments.development = {
//   mqtt: {
//     broker: process.env.MQTT_BROKER_HOST,
//     port: process.env.MQTT_BROKER_PORT,
//     username: process.env.MQTT_USERNAME,
//     password: process.env.MQTT_PASSWORD,
//   },
//   envName: constants.ENVIRONMENTS.DEVELOPMENT,
//   log: {
//     level: process.env.LOG_LEVEL,
//   },
//   measurement: {
//     readInterval: 1,
//   },
// };

// environments.production = {
//   mqtt: {
//     broker: '192.168.1.34',
//     port: 1883,
//   },
//   envName: constants.ENVIRONMENTS.PRODUCTION,
//   log: {
//     level: process.env.LOG_LEVEL,
//   },
//   measurement: {
//     readInterval: 10, // 10 seconds
//   },
// };
environments.development = {
  mqtt: {
    broker: 'localhost',
    port: 1883,
  },
  envName: constants.ENVIRONMENTS.DEVELOPMENT,
  log: {
    level: process.env.LOG_LEVEL,
  },
  measurement: {
    readInterval: 10, // 10 seconds
  },
};

// Determine which environment was passed as a command-line argument
const currentEnvironment =
  typeof process.env.NODE_ENV === 'string'
    ? process.env.NODE_ENV.toLowerCase()
    : '';

// Check that the current environment is one of the environment defined above,
// if not default to production
const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.development;

// export the module
module.exports = environmentToExport;
