const express = require("express");
const db = require("./dbconfig/connectDb");
const cors = require("cors");
const saveuserroute = require("./routes/saveUser");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use("/", saveuserroute);

const createUsersTable = async () => {
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
  console.log("🚀 Server running on http://localhost:" + PORT);
  createUsersTable();
});
