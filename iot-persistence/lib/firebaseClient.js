const firebase = require('firebase-admin');

const config = require('./config');
const dbHelper = require('./dbEntry');
const logger = require('./logger');

const client = {};

client.init = function init() {
  const serviceAccount = require(config.firebaseDB.serviceAccountKey);

  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: config.firebaseDB.url,
  });
};

client.createEntry = function createEntry(topic, message) {
  logger.debug(`FirebaseClient saves message into db with topic ${topic}.`);
  firebase.database().ref(topic).set(dbHelper.createFirebaseEntry(message));
};

client.init();

module.exports = client;
