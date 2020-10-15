const moment = require('moment');

const lib = {};

lib.createFirebaseEntry = function createFirebaseEntry(message) {
  const dbTime = moment();
  return {
    time: moment(message.timestamp).format(),
    timestamp: message.timestamp,
    dbTime: dbTime.format(),
    dbTimeStamp: dbTime.unix(),
    value: message.value,
    unit: message.unit,
  };
};

module.exports = lib;