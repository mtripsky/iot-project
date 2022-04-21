const moment = require('moment');

const lib = {};

lib.createPostgresEntry = function createPostgresEntry(message, roundingValue) {
  let _timestamp, _time, _value;
  if (message.hasOwnProperty('timestamp') && message.hasOwnProperty('time')) {
    _timestamp = message.timestamp;
    _time = message.time;
  } else if (message.hasOwnProperty('timestamp')) {
    _timestamp = message.timestamp;
    _time = moment.unix(message.timestamp).format();
  } else if (message.hasOwnProperty('time')) {
    _timestamp = moment(message.time).unix();
    _time = message.time;
  } else {
    _timestamp = moment().unix();
    _time = moment();
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
