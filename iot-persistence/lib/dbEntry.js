const moment = require('moment');

const lib = {};

lib.createPostgresEntry = function createPostgresEntry(message, roundingValue) {
  if (message.hasOwnProperty('timestamp') && message.hasOwnProperty('time')) {
    const _timestamp = message.timestamp;
    const _time = message.time;
  } else if (message.hasOwnProperty('timestamp')) {
    const _timestamp = message.timestamp;
    const _time = moment.unix(message.timestamp).format();
  } else if (message.hasOwnProperty('time')) {
    const _timestamp = moment(message.time).unix();
    const _time = message.time;
  } else {
    const _timestamp = moment().unix();
    const _time = moment();
  }

  if (roundingValue) {
    _value = Math.round(message.value * 10) / 10;
  } else {
    _value = message.value;
  }

  return {
    timestamp: _timestamp,
    time: _time,
    value: _value,
    unit: message.unit,
    location: message.location,
    device: message.device,
  };
};

module.exports = lib;
