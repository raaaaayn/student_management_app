const postgres = require('postgres');

const sql = postgres('postgres://postgres:test@localhost:5432/postgres', {})

module.exports = sql;
