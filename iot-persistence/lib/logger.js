/*
 * Logging wrapper
 */
const pinoLogger = require('pino')({ prettyPrint: true });

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
