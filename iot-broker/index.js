/*
 * Primary file for the Workflow Engine
 */

// Dependencies
const process = require('process');
// eslint-disable-next-line no-unused-vars
//const dotenv = require('dotenv').config();

const config = require('./lib/config');
const logger = require('./lib/logger');
const broker = require('./lib/broker');

const app = {};

app.init = function init() {
  broker.listen(() => {
    //broker.setupAuthentication();
    logger.info('Started mqtt broker');
    app.notifyStatus();
  });
};

app.notifyStatus = function notifyStatus() {
  //logger.info('MQTT Broker is running correctly...');

  app.intervalTimer = setTimeout(() => {
    app.notifyStatus();
  }, config.notifyInterval * 1000);
};

app.shutdown = function shutdown() {
  broker.close();
  clearInterval(app.intervalTimer);
  process.exit();
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
