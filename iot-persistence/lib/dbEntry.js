const moment = require('moment');

const lib = {};

lib.createFirebaseEntry = function createFirebaseEntry(message) {
  const dbTime = moment();

  if (message.hasOwnProperty('timestamp')) {
    return {
      timestamp: message.timestamp,
      dbTime: dbTime.format(),
      dbTimestamp: dbTime.unix(),
      value: message.value,
      unit: message.unit,
    };
  } else {
    return {
      timestamp: dbTime.unix(),
      dbTime: dbTime.format(),
      dbTimestamp: dbTime.unix(),
      value: message.value,
      unit: message.unit,
    };
  }
};

lib.createPostgresEntry = function createPostgresEntry(message) {
  const dbTime = moment();
  if (message.hasOwnProperty('timestamp')) {
    return {
      timestamp: message.timestamp,
      dbtime: dbTime.format(),
      dbtimestamp: dbTime.unix(),
      value: message.value,
      unit: message.unit,
      location: message.location,
      device: message.device,
    };
  } else {
    return {
      timestamp: dbTime.unix(),
      dbtime: dbTime.format(),
      dbtimestamp: dbTime.unix(),
      value: message.value,
      unit: message.unit,
      location: message.location,
      device: message.device,
    };
  }
};

module.exports = lib;
