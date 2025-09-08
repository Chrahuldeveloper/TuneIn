const { Router } = require("express");
const saveDetailsRouter = Router();
const dbclient = require("../dbconfig/connectDb");
const jwt = require("jsonwebtoken");
saveDetailsRouter.post("/api/save", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const JWT_SECRET = "abllkdvksdvlksdvorlsvoivhlmxcovhlmsboiuhfvlkn98h";

    const queryResult = await dbclient.query("SELECT * FROM users;");
    console.log(queryResult.rows);

    await dbclient.query(`INSERT INTO users (name, email) VALUES ($1, $2)`, [
      name,
      email,
    ]);

    const authToken = jwt.sign({ email: email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ authToken });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

saveDetailsRouter.post("/api/savesong", async (req, res) => {
  try {
    const { email, songDetails } = req.body;

    await dbclient.query(
      "UPDATE users SET current_song = $1 WHERE email = $2",
      [JSON.stringify(songDetails), email]
    );
  } catch (error) {
    console.log(error);
  }
});

saveDetailsRouter.post("/api/refresh-token", async (req, res) => {
  try {
    const { refreshToken, email } = req.body;

    await dbclient.query(
      "UPDATE users SET refreshToken = $1 WHERE email = $2",
      [refreshToken, email]
    );

    return res.json({ message: "token saved" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = saveDetailsRouter;
