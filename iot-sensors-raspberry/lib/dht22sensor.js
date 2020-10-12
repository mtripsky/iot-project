const dht = require('node-dht-sensor');

const logger = require('./logger');
const config = require('./config');
const constants = require('./constants');

const dhtSensor = {};

dhtSensor.read = function read(callback) {
  logger.info(`envName: ${config.envName}`);
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    dht.read(22, config.gpioPins.DHT22, (err, temperature, humidity) => {
      if (!err) {
        callback(null, temperature, humidity);
      } else {
        logger.error(
          `An error occurred while trying to read the temperature and humidity from sensor. ${err}`
        );
        callback(err);
      }
    });
  } else {
    const temperature = Math.floor(Math.random() * 20);
    const humidity = Math.floor(Math.random() * 100);

    callback(null, temperature, humidity);
  }
};

module.exports = dhtSensor;
