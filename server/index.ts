const express = require("express");
const { db } = require("./dbconfig/connectDb");
const app = express();
const PORT = 3001;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const createUsers = async () => {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await db.query(query);
    console.log("✅ Users table created");
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, () => {
  console.log("server connected");
  createUsers();
});
