const admin = require('firebase-admin');
const moment = require('moment');

const config = require('./config');
const dbHelper = require('./dbEntry');
const logger = require('./logger');
const serviceAccount = require('../db-keys/weather-station-etterbeek-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://weather-station-etterbeek.firebaseio.com',
  //databaseURL: config.firebaseDB.url,
});

const client = {};
const dbFirebase = admin.database();

//const FirebaseRead = require('firebase');
//const firebaseConfig = require('./firebaseConfig');

//const firebaseDbRead = FirebaseRead.initializeApp(firebaseConfig.firebase);

//const database = firebaseDbRead.database();

client.createEntry = function createEntry(topic, message) {
  logger.info(`FirebaseClient saves message into db with topic: ${topic}`);

  // const ref = database.ref('home/clima/humidity');
  // ref.once('value', (snapshot) => {
  //   snapshot.forEach((child) => {
  //     logger.info(`Humidity=${child.child('value').val()}${child.child('unit').val()}.`);
  //   });
  // });
  const dbTime = moment();
  dbFirebase
    .ref('home/living-room/temperature')
    .set(dbHelper.createFirebaseEntry(message))
    .then(function () {
      logger.info('Successfully saved entry into firebase database.');
    })
    .catch(function (err) {
      logger.error(`An error occurred while trying to create firebase entry. Err: ${err}`);
    });
};

module.exports = client;
