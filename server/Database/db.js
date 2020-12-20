const pool = require('pg').Pool
require('dotenv').config()

module.exports = new pool({
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: "localhost",
    database: "youtube",
    port: 5432,
})
