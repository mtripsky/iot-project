/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
//const dotenv = require('dotenv').config();

const config = require('./lib/config');
const logger = require('./lib/logger');
const dht = require('./lib/dht22sensor');
const transmitter = require('./lib/transmitter');

const app = {};

app.init = function init() {
  logger.info(
    'Started measurement, start reading sensor data located on raspberry-pi'
  );
  transmitter.connect(() => {
    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    });
  });
};

app.measureAndSend = function measureAndSend() {
  dht.read((sensorErr, temperature, humidity) => {
    if (!sensorErr) {
      transmitter.send(
        temperature,
        config.transmitterTopics.dhtTemperature,
        (transmitErr) => {
          if (transmitErr) {
            logger.error(
              `An error occurred while publishing the measurement on topic ${config.transmitterTopics.dhtTemperature}. Err: ${transmitErr}`
            );
          } else {
            logger.info(
              `Successfully send message to mqtt broker on topic ${config.transmitterTopics.dhtTemperature}`
            );
          }
        }
      );
      transmitter.send(
        humidity,
        config.transmitterTopics.dhtHumidity,
        (transmitErr) => {
          if (transmitErr) {
            logger.error(
              `An error occurred while publishing the measurement on topic ${config.transmitterTopics.dhtHumidity}. Err: ${transmitErr}`
            );
          } else {
            logger.info(
              `Successfully send message to mqtt broker on topic ${config.transmitterTopics.dhtHumidity}`
            );
          }
        }
      );
    } else {
      logger.error(
        `An error occurred while trying to read the dht sensor. Err: ${sensorErr}`
      );
    }

    app.intervalTimer = setTimeout(() => {
      app.measureAndSend();
    }, config.measurement.readInterval * 1000);
  });
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
