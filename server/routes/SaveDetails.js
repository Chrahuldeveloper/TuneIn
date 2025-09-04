const { Router } = require("express");
const saveDetailsRouter = Router();
const dbclient = require("../dbconfig/connectDb");
saveDetailsRouter.post("/api/save", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    console.log(name, email);
    await dbclient.query(
      `INSERT INTO users (name, email) VALUES ($1, $2)
   ON CONFLICT (email) DO NOTHING`,
      [name, email]
    );
    console.log("user saved done!");
    res.status(201).json({ message: "✅ User saved successfully" });
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

    console.log("Song Saved ");
  } catch (error) {
    console.log(error);
  }
});

module.exports = saveDetailsRouter;
