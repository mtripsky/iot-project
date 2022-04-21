const lib = {};

function getWhereRestriction(msg) {
    let restrictionString = '';
    if(msg.hasOwnProperty('location')){
        restrictionString.concat(` data->>'location'='${msg.location}' AND `);
    }
    if(msg.hasOwnProperty('device')){
        restrictionString.concat(` data->>'device'='${msg.device}' AND `);
    }

    return restrictionString;
}

lib.createTable = function createTable(tableName) {
    return `
    CREATE TABLE IF NOT EXISTS ${tableName} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      data JSONB);`;
};

lib.insertJsonbIntoTable = function insertJsonbIntoTable(msg) {
    const tableName = msg.type.toLowerCase();
    return `INSERT INTO ${tableName}(data) VALUES($1) RETURNING *`;
}

lib.getDailyExtremes = function getDailyExtremes(msg) {
    const tableName = msg.type.toLowerCase();
    const startDay = moment().startOf('day').unix();
    const endDay = moment().endOf('day').unix();

    return `SELECT MIN((data->>'value')::text::numeric) as min, MAX((data->>'value')::text::numeric) as max
            FROM ${tableName}
            WHERE ${getWhereRestriction(msg)}
                ((data->>'timestamp')::text::numeric BETWEEN ${startDay} AND ${endDay});`
}

lib.getLatestMeasurement = function getLatestMeasurement(msg) {
    const tableName = msg.type.toLowerCase();

    return `SELECT data
            FROM ${tableName}
            WHERE ${getWhereRestriction(msg)}
            ORDER BY (data->>'timestamp')::text::numeric DESC
            LIMIT(1);`
}

module.exports = lib;
