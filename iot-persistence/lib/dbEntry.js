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

module.exports = lib;
