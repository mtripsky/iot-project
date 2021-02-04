const moment = require('moment');

const lib = {};

lib.createFirebaseEntry = function createFirebaseEntry(message) {
  const dbTime = moment();

  if (message.hasOwnProperty('timestamp') && message.hasOwnProperty('time')) {
    return {
      timestamp: message.timestamp,
      time: message.time,
      value: message.value,
      unit: message.unit,
    };
  } else if (message.hasOwnProperty('timestamp')) {
    return {
      timestamp: message.timestamp,
      time: moment.unix(message.timestamp).format(),
      value: message.value,
      unit: message.unit,
    };
  } else if (message.hasOwnProperty('time')) {
    return {
      timestamp: moment(message.time).unix(),
      time: message.time,
      value: message.value,
      unit: message.unit,
    };
  } else {
    return {
      timestamp: moment().unix(),
      time: moment(),
      value: message.value,
      unit: message.unit,
    };
  }
};

lib.createPostgresEntry = function createPostgresEntry(message) {
  if (message.hasOwnProperty('timestamp') && message.hasOwnProperty('time')) {
    return {
      timestamp: message.timestamp,
      time: message.time,
      value: message.value,
      unit: message.unit,
      location: message.location,
      device: message.device,
    };
  } else if (message.hasOwnProperty('timestamp')) {
    return {
      timestamp: message.timestamp,
      time: moment.unix(message.timestamp).format(),
      value: message.value,
      unit: message.unit,
      location: message.location,
      device: message.device,
    };
  } else if (message.hasOwnProperty('time')) {
    return {
      timestamp: moment(message.time).unix(),
      time: message.time,
      value: message.value,
      unit: message.unit,
      location: message.location,
      device: message.device,
    };
  } else {
    return {
      timestamp: moment().unix(),
      time: moment(),
      value: message.value,
      unit: message.unit,
      location: message.location,
      device: message.device,
    };
  }
};

module.exports = lib;
