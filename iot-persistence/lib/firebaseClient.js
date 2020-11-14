const admin = require('firebase-admin');

const config = require('./config');
const dbHelper = require('./dbEntry');
const parseHelper = require('./helpers');
const logger = require('./logger');
const serviceAccount = require('../db-keys/firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.firebaseDB.url,
});

const client = {};
const dbFirebase = admin.database();

client.createEntry = function createEntry(topic, message) {
  logger.debug(`FirebaseClient received message with topic: ${topic}`);

  dbFirebase
    .ref(topic)
    .set(dbHelper.createFirebaseEntry(message))
    .then(function () {
      logger.debug(
        `FirebaseClient successfully saved msg into db with topic: ${topic}. MSG: ${parseHelper.parseObjectToString(
          message
        )}.`
      );
    })
    .catch(function (err) {
      logger.error(`Error occurred while trying to create an entry. ERROR: ${err}`);
    });
};

module.exports = client;
