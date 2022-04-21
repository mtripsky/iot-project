const mqtt = require('mqtt');
const logger = require('./logger');

const config = require('./config');
const helper = require('./helpers');

const mqtclient = {};

mqtclient.connect = function connect(connectCallback, msgCallback) {
  const mqttConnectionOptions = {
    port: config.mqtt.port,
    host: config.mqtt.host,
    keepalive: 60,
    rejectUnauthorized: false,
  };

  mqtclient.client = mqtt.connect(mqttConnectionOptions);
  mqtclient.client.on('connect', () => {
    logger.info(
      `[Mqtclient] Connected successfully to the MQTT broker. HOST: ${config.mqtt.host}, PORT: ${config.mqtt.port}.`
    );

    config.receiverTopics.forEach(function (topic, index, array) {
      mqtclient.client.subscribe(topic);
      logger.info(`[Mqtclient] subscribed to topic: ${topic}`);
    });

    mqtclient.client.on('message', (topic, message) => {
      logger.debug(`[Mqtclient]  Received message with topic: ${topic}`);
      const parsedMsg = helper.parseJsonToObject(message.toString());
      msgCallback(topic, parsedMsg);
    });

    connectCallback();
  });

  mqtclient.client.on('error', (err) => {
    logger.error(`[Mqtclient] Error occurred in Mqtclient. ERROR: ${err}.`);
  });
};

mqtclient.send = function send(message, topic) {
  mqtclient.client.publish(topic, JSON.stringify(message), { qos: 1 }, (err) => {
    if (err) {
      logger.error(`[Mqtclient] An error occurred while trying to publish a message. ERROR: ${err}`);
    } else {
      logger.debug(`[Mqtclient] message: ${JSON.stringify(message)} published on topic: ${topic}.`)
    }
  });
};

mqtclient.disconnect = function disconnect(callback) {
  logger.info('[Mqtclient] Disconnecting from MQTT broker.');
  mqtclient.client.end();
  callback();
};

module.exports = mqtclient;
