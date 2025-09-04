const { Pool } =  require("pg");
const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydb1",
  password: "1234",
  port: 5432,
});


module.exports = db
