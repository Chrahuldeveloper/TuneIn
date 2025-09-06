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

    console.log(name, email);

    const queryResult = await dbclient.query("SELECT * FROM users;");
    console.log(queryResult.rows); // this will log all users

    await dbclient.query(`INSERT INTO users (name, email) VALUES ($1, $2)`, [
      name,
      email,
    ]);

    console.log("User saved");

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

    console.log(email,songDetails)

    await dbclient.query(
      "UPDATE users SET current_song = $1 WHERE email = $2",
      [JSON.stringify(songDetails), email]
    );

    console.log("Song Saved ");
  } catch (error) {
    console.log(error);
  }
});

module.exports = saveDetailsRouter;
