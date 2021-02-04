const dht = require('node-dht-sensor');

const logger = require('./logger');
const config = require('./config');
const constants = require('./constants');
const moment = require('moment');

const sensorName = 'DHT22';
let temperatureMeasurement = {
  device: sensorName,
  type: 'Temperature',
  value: NaN,
  unit: '°C',
  location: 'HOME-LR',
  time: NaN,
  timestamp: NaN,
};
let humidityMeasurement = {
  device: sensorName,
  type: 'Humidity',
  value: NaN,
  unit: '%',
  location: 'HOME-LR',
  time: NaN,
  timestamp: NaN,
};

const dhtSensor = {};

dhtSensor.read = function read(callback) {
  const time = moment();
  temperatureMeasurement.time = time;
  temperatureMeasurement.timestamp = time.unix();
  humidityMeasurement.time = time;
  humidityMeasurement.timestamp = time.unix();

  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    dht.read(22, config.gpioPins.DHT22, (err, temperature, humidity) => {
      if (!err) {
        temperatureMeasurement.value = Math.round(temperature * 10) / 10;
        humidityMeasurement.value = Math.round(humidity * 10) / 10;

        callback(null, temperatureMeasurement, humidityMeasurement);
      } else {
        logger.error(`[dhtSensor] An error occurred while trying to read the temperature and humidity from sensor. ERROR: ${err}`);
        callback(err);
      }
    });
  } else {
    temperatureMeasurement.value = Math.floor(Math.random() * 20);
    humidityMeasurement.value = Math.floor(Math.random() * 100);

    callback(null, temperatureMeasurement, humidityMeasurement);
  }
};

module.exports = dhtSensor;
