/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
const config = require('./lib/config');
const logger = require('./lib/logger');
const dht = require('./lib/dht22sensor');
const bme = require('./lib/bmeSensor');
const transmitter = require('./lib/transmitter');

const app = {};

app.init = function init() {
  logger.info(`Starting IoT-Sensors-Raspberry service in ${config.envName} mode .......`);

  transmitter.connect(() => {
    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    });
  });
};

app.measureAndSend = function measureAndSend() {
  if (config.dhtSensorConnected) {
    dht.read((sensorErr, temperature, humidity) => {
      if (!sensorErr) {
        transmitter.send(temperature, config.transmitterTopics.temperatureLR);
        transmitter.send(humidity, config.transmitterTopics.humidityLR);
      } else {
        logger.error(`An error occurred while trying to read the dht sensor. ERROR: ${sensorErr}`);
      }
    });
  }

  if (config.bmeSensorConnected) {
    bme.read((sensorErr, temperature, humidity, pressure) => {
      if (!sensorErr) {
        transmitter.send(temperature, config.transmitterTopics.temperatureLR);
        transmitter.send(humidity, config.transmitterTopics.humidityLR);
        transmitter.send(pressure, config.transmitterTopics.pressureLR);
      } else {
        logger.error(`An error occurred while trying to read the BME sensor. ERROR: ${sensorErr}`);
      }
    });
  }

  app.intervalTimer = setTimeout(() => {
    app.measureAndSend();
  }, config.measurement.readInterval * 1000);
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  transmitter.disconnect(() => {
    process.exit();
  });
};

process.on('SIGINT', () => {
  logger.info('Got SIGINT, gracefully shutting down');
  app.shutdown();
});

process.on('SIGTERM', () => {
  logger.info('Got SIGTERM, gracefully shutting down');
  app.shutdown();
});

app.init();

module.exports = app;
