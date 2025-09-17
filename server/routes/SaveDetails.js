const { Router } = require("express");
const saveDetailsRouter = Router();
const dbclient = require("../dbconfig/connectDb");
const jwt = require("jsonwebtoken");

saveDetailsRouter.get("/login", async (req, res) => {
  try {
    const generatecodeVerifier = (length) => {
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const values = crypto.getRandomValues(new Uint8Array(length));
      return Array.from(values)
        .map((x) => possible[x % possible.length])
        .join("");
    };

    const generateCodeChallenge = async (verifier) => {
      const encoder = new TextEncoder();
      const data = encoder.encode(verifier);
      const hash = await crypto.subtle.digest("SHA-256", data);
      return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    };

    const codeVerifier = generatecodeVerifier(64);
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    return res.json({
      codeVerifier: codeVerifier,
      codeChallenge: codeChallenge,
    });
  } catch (error) {
    console.log(error);
  }
});

saveDetailsRouter.get("/get-user-email", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const userEmail = await dbclient.query(
      "SELECT email FROM users WHERE refreshtoken = $1",
      [refreshToken]
    );

    const result = await userEmail.rows[0].email

    return res.json({
      result: result,
    });
  } catch (error) {
    console.log(error);
  }
});

saveDetailsRouter.post("/save", async (req, res) => {
  try {
    const { name, email, refreshtoken } = req.body;

    if (!name || !email || !refreshtoken) {
      return res
        .status(400)
        .json({ error: "Name and email,refreshtoken are required" });
    }

    const JWT_SECRET = "CMRCET-KI-MAA-KI-CHUT";
    const queryResult = await dbclient.query("SELECT * FROM users;");
    console.log(queryResult.rows);

    await dbclient.query(
      `INSERT INTO users (name, email,refreshtoken) VALUES ($1, $2,$3)`,
      [name, email, refreshtoken]
    );

    const authToken = jwt.sign({ email: email }, JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.json({ authToken });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

saveDetailsRouter.post("/savesong", async (req, res) => {
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

saveDetailsRouter.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken, email } = req.body;
    console.log(email);
    console.log(refreshToken);
    await dbclient.query(
      "UPDATE users SET refreshToken = $1 WHERE email = $2",
      [refreshToken, email]
    );

    return res.json({ message: "token saved" });
  } catch (error) {
    console.log(error);
  }
});

saveDetailsRouter.get("/get-new-token", async (req, res) => {
  try {
    const email = Object.values(req.query)[0].toString();

    console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

    const result = await dbclient.query(
      "SELECT refreshToken FROM users WHERE email = $1",
      [email]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "No refresh token found" });
    }

    const refresh_token = result.rows[0].refreshtoken;

    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", refresh_token);

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
      body: body.toString(),
    });

    const data = await response.json();

    await dbclient.query(
      "UPDATE users SET refreshtoken = $1 WHERE email = $2",
      [data.refresh_token, email]
    );

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    return res.json({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
    });
  } catch (error) {
    console.log("❌ Error refreshing token:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = saveDetailsRouter;
