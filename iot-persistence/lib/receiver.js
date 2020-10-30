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
      `Connected successfully to the MQTT broker at ${config.mqtt.host} on port ${config.mqtt.port}`
    );

    receiver.client.subscribe(config.receiverTopics.homeClima);
    receiver.client.subscribe(config.receiverTopics.weather);

    receiver.client.on('message', (topic, message) => {
      if (helper.isTopicEqualToTopicWithWildCard(topic, config.receiverTopics.homeClima)) {
        logger.info(`Received: ${message.toString()}`);
        const parsedMessage = helper.parseJsonToObject(message.toString());
        msgCallback(topic, parsedMessage);
      }
    });

    connectCallback();
  });

  receiver.client.on('error', (err) => {
    logger.error(`An error occurred. ${err}.`);
  });
};

receiver.disconnect = function disconnect(callback) {
  logger.info('Disconnecting from MQTT broker.');
  receiver.client.end();
  callback();
};

module.exports = receiver;
