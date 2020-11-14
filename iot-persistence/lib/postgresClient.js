const { Client } = require('pg');
const logger = require('./logger');
const config = require('./config');
const dbHelper = require('./dbEntry');
const parseHelper = require('./helpers');

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
    const createTableText = `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      data JSONB);`;

    // create table
    client.storage
      .query(createTableText)
      .then((res) => {
        logger.info(
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
  logger.debug(`PostgresClient received message with topic: ${topic}`);

  const tableName = message.type.toLowerCase();
  const insertIntoTableText = `INSERT INTO ${tableName}(data) VALUES($1) RETURNING *`;
  const dbEntry = dbHelper.createPostgresEntry(message);

  client.storage
    .query(insertIntoTableText, [dbEntry])
    .then((res) => {
      logger.debug(
        `[PostgresClient] Insert into table: ${tableName}. RESULT: ${parseHelper.parseObjectToString(
          res.rows[0]
        )}.`
      );
    })
    .catch((err) =>
      logger.error(
        `[PostgresClient] Error when inserting into table: ${tableName}: ERROR: ${err.stack}.`
      )
    );
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

client.connect();

module.exports = client;
