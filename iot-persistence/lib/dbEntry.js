const moment = require('moment');

const lib = {};

lib.createFirebaseEntry = function createFirebaseEntry(message) {
  const dbTime = moment();
  return {
    timestamp: message.timestamp,
    dbTime: dbTime.format(),
    dbTimestamp: dbTime.unix(),
    value: message.value,
    unit: message.unit,
  };
};

lib.createPostgresEntry = function createPostgresEntry(message) {
  const dbTime = moment();
  return {
    time: dbTime.format(),
    timestamp: dbTime.unix(),
    value: message.value,
    unit: message.unit,
    location: message.location,
    device: message.device,
  };
};

module.exports = lib;
