const logger = require('./lib/logger');

const receiver = require('./lib/receiver');
const firebaseClient = require('./lib/firebaseClient');

const app = {};

const moment = require('moment');

app.init = function init() {
  logger.info('Started persistence service to collect data into databases');

  const message = {
    device: 'DHT22',
    type: 'Temperature',
    value: 20,
    unit: '°C',
    location: 'Living room',
    timestamp: moment().unix(),
  };
  const topic = '/home/living-room/temperature';

  firebaseClient.createEntry(topic, message);
  // receiver.connect(
  //   () => {
  //     logger.info('Successfully connected to MQTT broker and subscribed to topics.');
  //   },
  //   (topic, message) => {
  //     try {
  //       logger.info(`Received msg: ${message.device}.`);
  //       logger.info(
  //         `Received message: device: [${message.device}-${message.location}] ${message.type}=${message.value}${message.unit}`
  //       );

  //       firebaseClient.createEntry(topic, message);
  //       return {};
  //     } catch (err) {
  //       logger.error(
  //         `receiver.connect: An error occurred while trying to parse message "${message}". ${err}`
  //       );
  //       return {};
  //     }
  //   }
  // );
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  receiver.disconnect(() => {
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
