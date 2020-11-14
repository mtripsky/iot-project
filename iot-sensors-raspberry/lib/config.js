const constants = require('./constants');

// Container for all environments
const environments = {};

environments.development = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  transmitterTopics: {
    dhtTemperature: '/home/living-room/temperature',
    dhtHumidity: '/home/living-room/humidity',
  },
  envName: constants.ENVIRONMENTS.DEVELOPMENT,
  log: {
    level: 'debug',
  },
  measurement: {
    readInterval: process.env.SENSORS_READ_INTERVAL,
  },
};

environments.production = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  transmitterTopics: {
    dhtTemperature: '/home/living-room/temperature',
    dhtHumidity: '/home/living-room/humidity',
  },
  gpioPins: {
    DHT22: 16,
  },
  envName: constants.ENVIRONMENTS.PRODUCTION,
  log: {
    level: 'info',
  },
  measurement: {
    readInterval: process.env.SENSORS_READ_INTERVAL,
  },
};
// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment defined above,
// if not default to production
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.production;

// export the module
module.exports = environmentToExport;
