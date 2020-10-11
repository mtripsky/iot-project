/*
 *
 */
const mqtt = require('mqtt');
const moment = require('moment');

const logger = require('./logger');
const config = require('./config');

const transmitter = {};

transmitter.connect = function connect(callback) {
  const connectOptions = {
    port: config.mqtt.port,
    host: config.mqtt.broker,
    rejectUnauthorized: false,
  };

  logger.info(
    `Trying to connect to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`
  );

  transmitter.client = mqtt.connect(connectOptions);

  transmitter.client.on('connect', () => {
    logger.info(
      `Connected successfully to the MQTT broker at ${config.mqtt.broker} on port ${config.mqtt.port}`
    );
    callback();
  });

  transmitter.client.on('error', (err) => {
    logger.error(`An error occurred. ${err}`);
  });
};

transmitter.send = function send(data, topic, callback) {
  const message = {
    data,
    timeStamp: moment().unix(),
  };

  transmitter.client.publish(topic, JSON.stringify(message), (err) => {
    if (err) {
      logger.error(
        `An error occurred while trying to publish a message. Err: ${err}`
      );
    } else {
      logger.info('Successfully published message');
    }
    callback(err);
  });
};

transmitter.disconnect = function disconnect(callback) {
  transmitter.client.end();
  callback();
};

module.exports = transmitter;
