const express = require("express");
const app = express();
const db = require("./dbconfig/connectDb");
const cors = require("cors");
const saveDetailsRouter = require("./routes/SaveDetails");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 3001; 

app.use(express.json());
app.use(cors({
  origin: "https://tune-in-inky.vercel.app",
  credentials: true
}));

app.use("/api", saveDetailsRouter);

const createUsersTable = async () => {
  try {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    refreshToken TEXT,
    authToken TEXT,
    current_song JSONB,
    created_at TIMESTAMP DEFAULT NOW()
      );
    `;
    await db.query(query);
    console.log("Users table created");
  } catch (error) {
    console.log(error);
  }
};

app.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
  createUsersTable();
});
