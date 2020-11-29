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

    receiver.client.subscribe(config.receiverTopics.homeClima);
    logger.info(`Receiver subscribed to topic: ${config.receiverTopics.homeClima}`);
    receiver.client.subscribe(config.receiverTopics.weather);
    logger.info(`Receiver subscribed to topic: ${config.receiverTopics.weather}`);

    receiver.client.on('message', (topic, message) => {
      if (helper.isTopicEqualToTopicWithWildCard(topic, config.receiverTopics.homeClima)) {
        logger.info(`[1] Received message with topic: ${topic}`);
        const parsedMessage = helper.parseJsonToObject(message.toString());

        msgCallback(topic, parsedMessage);
      }
      if (helper.isTopicEqualToTopicWithWildCard(topic, config.receiverTopics.weather)) {
        logger.info(`[2] Received message with topic: ${topic}`);
        const parsedMessage = helper.parseJsonToObject(message.toString());

        msgCallback(topic, parsedMessage);
      }
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
