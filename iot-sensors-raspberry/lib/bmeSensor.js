const BME = require('bme280-sensor');

const logger = require('./logger');
const config = require('./config');
const constants = require('./constants');

bmeSensorOptions = {
  i2cBusNo: 1,
  i2cAddress: 0x76,
};

const sensorName = 'BME280';

let temperatureMeasurement = {
  device: sensorName,
  type: 'Temperature',
  value: NaN,
  unit: '°C',
  location: 'HOME-LR',
};
let humidityMeasurement = {
  device: sensorName,
  type: 'Humidity',
  value: NaN,
  unit: '%',
  location: 'HOME-LR',
};
let pressureMeasurement = {
  device: sensorName,
  type: 'pressure',
  value: NaN,
  unit: 'hPa',
  location: 'HOME-LR',
};

const sensor = {};
const bme = new BME(bmeSensorOptions);

sensor.init = function init() {
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    bme
      .init()
      .then(() => logger.info('BME280 sensor initialized.'))
      .catch((err) => logger.error(`BME280 initialization failed. ERROR: ${err}`));
  } else {
    logger.info('Mocked BME280 sensor initialized.');
  }
};

sensor.read = function read(callback) {
  if (config.envName === constants.ENVIRONMENTS.PRODUCTION) {
    bme
      .readSensorData()
      .then((data) => {
        temperatureMeasurement.value = Math.round(data.temperature_C * 10) / 10;
        humidityMeasurement.value = Math.round(data.humidity * 10) / 10;
        pressureMeasurement.value = Math.round(data.pressure_hPa * 10) / 10;

        callback(null, temperatureMeasurement, humidityMeasurement, pressureMeasurement);
      })
      .catch((err) => {
        logger.error(`[BME280] An error occurred while trying to read the temperature and humidity from sensor. ERROR: ${err}`);
        callback(err);
      });
  } else {
    temperatureMeasurement.value = Math.floor(Math.random() * 20);
    humidityMeasurement.value = Math.floor(Math.random() * 100);
    pressureMeasurement.value = Math.floor(Math.random() * 10 + 1015);

    callback(null, temperatureMeasurement, humidityMeasurement, pressureMeasurement);
  }
};

sensor.init();

module.exports = sensor;
