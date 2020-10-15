const firebase = require('firebase-admin');

const dbHelper = require('./dbEntry');
const logger = require('./logger');

const client = {};

client.init = function init() {
  const serviceAccount = require('../serviceAccountKey.json');

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://weather-station-etterbeek.firebaseio.com',
  });
};

client.createEntry = function createEntry(topic, message) {
  logger.debug(`FirebaseClient saves message into db with topic ${topic}.`);
  admin.database().ref(topic).set(dbHelper.createFirebaseEntry(message));
};

client.init();

module.exports = client;
