/*
 * Broker responsible for listening messages and redistribution of them
 */
//const fs = require('fs');
const aedes = require('aedes');
const tls = require('tls');

const logger = require('./logger');
const config = require('./config');

const broker = {};

broker.listen = function listen(callback) {
  broker.aedes = aedes();

  // const options = {
  //   key: fs.readFileSync('./certificates/broker-private.pem'),
  //   cert: fs.readFileSync('./certificates/broker-public.pem'),
  // };

  broker.server = tls.createServer(null, broker.aedes.handle);

  logger.info(`Starting MQTT broker on port:${config.mqtt.port}`);

  broker.server.listen(config.mqtt.port);

  callback();
};

broker.close = function close(callback) {
  broker.aedes.close(() => {
    logger.info('Broker is closed');
    callback();
  });
};

// broker.setupAuthentication = function setupAuthentication() {
//   broker.aedes.authenticate = (client, username, password, callback) => {
//     if (username && typeof username === 'string' && username === config.mqtt.username) {
//       if (password && typeof password === 'object' && password.toString() === config.mqtt.password) {
//         callback(null, true);
//         logger.info(`Client: ${client} authenticated successfully`);
//       }
//     } else {
//       callback(false, false);
//     }
//   };
// };

module.exports = broker;
