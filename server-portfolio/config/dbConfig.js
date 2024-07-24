const { Pool } = require('pg');
const dbConfig = {
    user: 'postgres',
    host: 'postgres',
    database: 'mydatabase',
    password: 'admin',
    port: 5432,
};
const pool = new Pool(dbConfig);

module.exports = {
    pool,
};