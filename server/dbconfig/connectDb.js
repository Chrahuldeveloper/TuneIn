require("dotenv").config();
const { Pool } = require("pg");
// const db = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb1",
  password: "1234",
  port: 5432,
});

db.query("SELECT NOW()", (err, res) => {
  if (res) {
    console.log("db Connected");
  } else {
    console.error("Connection error", err);
  }
});

module.exports = db;
