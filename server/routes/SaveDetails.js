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

    const JWT_SECRET = "CMRCET-KI-MAA-KI-CHUT";

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
    console.log(email)
    console.log(refreshToken)
    await dbclient.query(
      "UPDATE users SET refreshToken = $1 WHERE email = $2",
      [refreshToken, email]
    );

    return res.json({ message: "token saved" });
  } catch (error) {
    console.log(error);
  }
});

saveDetailsRouter.get("/api/get-new-token", async (req, res) => {
  try {
    const { email } = req.query;

    console.log(email);

    console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    const result = await dbclient.query(
      "SELECT refreshToken FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "No refresh token found" });
    }

    const refresh_token = result.rows[0].refreshtoken;

    console.log(refresh_token);

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    return res.json({ accessToken: data.access_token });
  } catch (error) {
    console.log("❌ Error refreshing token:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = saveDetailsRouter;
