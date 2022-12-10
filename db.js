const { CONNECTION_STRING } = require('./config');
const postgres = require('postgres');

const sql = postgres(CONNECTION_STRING, {});

module.exports = sql;
