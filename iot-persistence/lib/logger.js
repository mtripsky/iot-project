/*
 * Logging wrapper
 */
const config = require('./config');

const pinoLogger = require('pino')({ prettyPrint: true, level: config.log.level, base: null });

const logger = {};

logger.info = function info(message) {
  pinoLogger.info(message);
};

logger.error = function error(message) {
  pinoLogger.error(message);
};

logger.debug = function debug(message) {
  pinoLogger.debug(message);
};

module.exports = logger;
