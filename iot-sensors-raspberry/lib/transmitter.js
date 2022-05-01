/*
 *
 */
const mqtt = require('mqtt');
const logger = require('./logger');
const config = require('./config');

const transmitter = {};

transmitter.connect = function connect(cb) {
  const connectOptions = {
    port: config.mqtt.port,
    host: config.mqtt.host,
    rejectUnauthorized: false,
  };

  transmitter.client = mqtt.connect(connectOptions);

  transmitter.client.on('connect', () => {
    logger.info(`Connected successfully to the MQTT broker. HOST: ${config.mqtt.host}, PORT: ${config.mqtt.port}.`);
    cb();
  });

  transmitter.client.on('error', (err) => {
    logger.error(`[Transmitter] An error occurred. ERROR: ${err}`);
  });
};

transmitter.send = function send(sensorMeasurement, topic) {
  transmitter.client.publish(topic, JSON.stringify(sensorMeasurement), { qos: 1 }, (err) => {
    if (err) {
      logger.error(`An error occurred while trying to publish a message. ERROR: ${err}`);
    } else {
      logger.info(`Successfully published message on topic: ${topic}.`);
    }
  });
};

transmitter.disconnect = function disconnect(cb) {
  transmitter.client.end();
  cb();
};

module.exports = transmitter;
