const mqtt = require('mqtt');
const logger = require('./logger');

const config = require('./config');
const helper = require('./helpers');

const receiver = {};

receiver.connect = function connect(connectCallback, msgCallback) {
  const mqttConnectionOptions = {
    port: config.mqtt.port,
    host: config.mqtt.host,
    keepalive: 60,
  };

  receiver.client = mqtt.connect(mqttConnectionOptions);
  receiver.client.on('connect', () => {
    logger.info(
      `Connected successfully to the MQTT broker. HOST: ${config.mqtt.host}, PORT: ${config.mqtt.port}.`
    );

    config.receiverTopics.forEach(function (topic, index, array) {
      receiver.client.subscribe(topic);
      logger.info(`Receiver subscribed to topic: ${topic}`);
    });

    receiver.client.on('message', (topic, message) => {
      logger.debug(`Received message with topic: ${topic}`);
      const parsedMsg = helper.parseJsonToObject(message.toString());
      msgCallback(topic, parsedMsg);
    });

    connectCallback();
  });

  receiver.client.on('error', (err) => {
    logger.error(`Error occurred in Receiver. ERROR: ${err}.`);
  });
};

receiver.disconnect = function disconnect(callback) {
  logger.info('Disconnecting from MQTT broker.');
  receiver.client.end();
  callback();
};

module.exports = receiver;
