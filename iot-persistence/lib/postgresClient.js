const { Client } = require('pg');
const logger = require('./logger');
const config = require('./config');
const dbHelper = require('./dbEntry');
const parseHelper = require('./helpers');
const querryStringBuilder = require('./querryStringBuilder');

const client = {};

client.connect = function connect() {
  client.storage = new Client({
    user: config.postgresDB.user,
    database: config.postgresDB.database,
    password: config.postgresDB.password,
    port: config.postgresDB.port,
  });

  client.storage.connect((err) => {
    if (err) {
      logger.error(`Error when connecting to Postgres. ${err.stack}`);
    } else {
      logger.info(
        `Successfully connected to Postgres. DB: ${config.postgresDB.database}, PORT: ${config.postgresDB.port}, USER: ${config.postgresDB.user}.`
      );
    }
  });

  config.postgresDB.tableNames.forEach(function (tableName, index, array) {
    const createTableText = querryStringBuilder.createTable(tableName);

    client.storage
      .query(createTableText)
      .then((res) => {
        logger.debug(
          `[PostgresClient] Table: ${tableName} created. RESULT: ${parseHelper.parseObjectToString(
            res
          )}.`
        );
      })
      .catch((err) =>
        logger.error(
          `[PostgresClient] Error when creating a table: ${tableName}. ERROR: ${err.stack}.`
        )
      );
  });
};

client.disconnect = function disconnect() {
  logger.info('Disconnecting from Postgres DB');
  client.storage.end();
};

client.createEntry = function createEntry(topic, message) {
  if(!msg.hasOwnProperty('type'))
  {
    logger.debug(`[PostgresClient] createEntry: No 'TYPE' in the incoming message.`)
    return;
  }
  logger.debug(`PostgresClient received message with topic: ${topic}`);

  const insertIntoTableText = querryStringBuilder.insertJsonbIntoTable(message);
  const dbEntry = dbHelper.createPostgresEntry(message, true);

  client.storage
    .query(insertIntoTableText, [dbEntry])
    .then((res) => {
      logger.debug(
        `[PostgresClient] Insert into table: ${message.type.toLowerCase()}. RESULT: ${parseHelper.parseObjectToString(
          res.rows[0]
        )}.`
      );
    })
    .catch((err) =>
      logger.error(
        `[PostgresClient] Error when inserting into table: ${message.type.toLowerCase()}: ERROR: ${err.stack}.`
      )
    )
    .finally(() => {
    });
};

client.printTable = function printTable(tableName) {
  const selectAllFromTableText = `SELECT data ->> 'time' AS time,
	          data ->> 'value' AS value FROM ${tableName}`;

  client.storage
    .query({ text: selectAllFromTableText, rowMode: 'array' })
    .then((res) => {
      logger.info(`============= TABLE: ${tableName} =============`);
      res.rows.forEach(function (row, index, array) {
        logger.info(row);
      });
      logger.info(`===============================================`);
    })
    .catch((err) =>
      logger.error(
        `[PostgresClient] Error when selecting from table: ${tableName}. ERROR: ${err.stack}`
      )
    );
};

client.getDailyExtremes = function getDailyExtremes(msg, cb) {
  if(!msg.hasOwnProperty('type'))
  {
    logger.debug(`[PostgresClient] getDailyExtremes: No 'TYPE' in the incoming message.`)
    return;
  }
  const queryString = querryStringBuilder.getDailyExtremes(msg);

  client.storage
    .query(queryString)
    .then((res) => {
      const message = {
        type: msg.type,
        min: res.rows[0].min,
        max: res.rows[0].max,
      };
      logger.debug(`[PostgresClient] getDailyExtremes: ${JSON.stringify(message)}.`)

      cb(message);
    })
    .catch((err) =>
      logger.error(
        `[PostgresClient] Error get daily extremes: ${msg.type.toLowerCase()}: ERROR: ${err.stack}.`
      )
    )
    .finally(() => {
    }); 
}

client.getLatestMeasuremnt = function getLatestMeasuremnt(msg, cb) {
  if(!msg.hasOwnProperty('type'))
  {
    logger.debug(`[PostgresClient] getLatestMeasuremnt: No 'TYPE' in the incoming message.`)
    return;
  }
  const table = msg.type.toLowerCase();
  const queryString = querryStringBuilder.getLatestMeasurement(msg);
  const queryStringExtremes = querryStringBuilder.getDailyExtremes(msg);

  client.storage
    .query(queryString)
    .then((res) => {
      logger.debug(`[PostgresClient] getLatestMeasuremnt: ${JSON.stringify(res.rows[0].data)}.`)
      client.storage
        .query(queryStringExtremes)
        .then((resExtremes) => {
          const message = {
            type: res.rows[0].data.type,
            time: res.rows[0].data.time,  
            timestamp: res.rows[0].data.timestamp,
            unit: res.rows[0].data.unit,
            value: res.rows[0].data.value,
            device: res.rows[0].data.device,
            min: resExtremes.rows[0].min,
            max: resExtremes.rows[0].max,
            location: res.rows[0].data.location,
          };
          logger.debug(`[PostgresClient] last measurement: ${JSON.stringify(message)}.`)
          cb(message);
        })
        .catch((err) =>
          logger.error(
            `[PostgresClient] Error get daily extremes in last measurement: ${table}: ERROR: ${err.stack}.`
          )
        )
        .finally(() => {
        }); 
    })
    .catch((err) =>
      logger.error(
        `[PostgresClient] Error get last measurement: ${table}: ERROR: ${err.stack}.`
      )
    )
    .finally(() => {
    }); 
}

client.connect();

module.exports = client;
