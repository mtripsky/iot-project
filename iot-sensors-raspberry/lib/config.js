const constants = require('./constants');

stringToBoolean = function (string) {
  switch (string.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
    case null:
      return false;
    default:
      return Boolean(string);
  }
};

// Container for all environments
const environments = {};

environments.development = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  transmitterTopics: {
    temperatureLR: '/home/living-room/temperature',
    humidityLR: '/home/living-room/humidity',
    pressureLR: '/home/living-room/pressure',
  },
  envName: constants.ENVIRONMENTS.DEVELOPMENT,
  log: {
    level: 'debug',
  },
  measurement: {
    readInterval: process.env.SENSORS_READ_INTERVAL,
  },
  bmeSensorConnected: stringToBoolean(process.env.SENSOR_BME_CONNECTED),
  dhtSensorConnected: stringToBoolean(process.env.SENSOR_DHT_CONNECTED),
};

environments.production = {
  mqtt: {
    host: process.env.MQTT_BROKER_HOST,
    port: process.env.MQTT_BROKER_PORT,
  },
  transmitterTopics: {
    temperatureLR: '/home/living-room/temperature',
    humidityLR: '/home/living-room/humidity',
    pressureLR: '/home/living-room/pressure',
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
  bmeSensorConnected: stringToBoolean(process.env.SENSOR_BME_CONNECTED),
  dhtSensorConnected: stringToBoolean(process.env.SENSOR_DHT_CONNECTED),
};
// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environment defined above,
// if not default to production
const environmentToExport = typeof environments[currentEnvironment] === 'object' ? environments[currentEnvironment] : environments.production;

// export the module
module.exports = environmentToExport;
