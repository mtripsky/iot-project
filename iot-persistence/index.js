const logger = require('./lib/logger');
const config = require('./lib/config');

const receiver = require('./lib/receiver');
const postgresClient = require('./lib/postgresClient');

const app = {};

app.init = function init() {
  logger.info(`Starting IoT-persistence service in ${config.envName} mode .......`);

  receiver.connect(
    () => {
      logger.info('IoT-persistence service was initiated and is listening for messages.');
    },
    (topic, message) => {
      try {
        postgresClient.createEntry(topic, message);

        return {};
      } catch (err) {
        logger.error(
          `Receiver.connect: An error occurred while trying to parse message: "${message}". ERROR: ${err}`
        );
        return {};
      }
    }
  );
};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  postgresClient.disconnect();
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
