const dht = require('node-dht-sensor');

const logger = require('./logger');
const config = require('./config');
const constants = require('./constants');

const dhtSensorName = 'DHT22';
let temperatureMeasurement = {
  device: dhtSensorName,
  type: 'Temperature',
  value: NaN,
  unit: '°C',
  location: 'HOME-LR',
};
let humidityMeasurement = {
  device: dhtSensorName,
  type: 'Humidity',
  value: NaN,
  unit: '%',
  location: 'HOME-LR',
};

const dhtSensor = {};

dhtSensor.read = function read(callback) {
  logger.info(`envName: ${config.envName}`);
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    dht.read(22, config.gpioPins.DHT22, (err, temperature, humidity) => {
      if (!err) {
        temperatureMeasurement.value = temperature;
        humidityMeasurement.value = humidity;

        callback(null, temperatureMeasurement, humidityMeasurement);
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
