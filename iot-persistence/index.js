const logger = require('./lib/logger');

const receiver = require('./lib/receiver');

const app = {};

app.init = function init() {
  logger.info('Started persistence service to collect data into databases');

  receiver.connect(
    () => {
      logger.info('Successfully connected to MQTT broker and subscribed to topics.');
    },
    (message) => {
      logger.info(
        `Received message: device: [${message.device}-${message.location}] ${message.type}=${message.value}${message.unit}`
      );
    }
  );
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
