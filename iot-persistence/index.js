const logger = require('./lib/logger');
const config = require('./lib/config');

const mqtclient = require('./lib/mqttclient');
const postgresClient = require('./lib/postgresClient');

const app = {};

app.init = function init() {
  logger.info(`Starting IoT-persistence service in ${config.envName} mode .......`);
    
  mqtclient.connect(
    () => {
      logger.info('IoT-persistence service was initiated and is listening for messages.');
    },
    (topic, message) => {
      try {
        if (topic === '/raspiot-client/get-daily-extremes'){
          postgresClient.getDailyExtremes(message, (msg) => {mqtclient.send(msg, '/raspiot-client/daily-extremes')});
        } else if (topic === '/raspiot-client/get-latest-measurement'){
          postgresClient.getLatestMeasuremnt(message, (msg) => {mqtclient.send(msg, '/raspiot-client/latest-measurement')});
        } else {
          postgresClient.createEntry(topic, message);
        }
      } catch (err) {
        logger.error(
          `mqtclient connect: An error occurred while trying to parse message: "${message}". ERROR: ${err}`
        );
        return {};
      }
    }
  );

};

app.shutdown = function shutdown() {
  clearInterval(app.intervalTimer);
  postgresClient.disconnect();
  mqtclient.disconnect(() => {
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
