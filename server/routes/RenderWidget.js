const { Router } = require("express");
const RenderWidgetRoute = Router();
const dbclient = require("../dbconfig/connectDb");

RenderWidgetRoute.get("/api/currentsong", async (req, res) => {
  try {
    const { email } = req.query;

    const result = await dbclient.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    return res.json({ current_song: result.rows[0].current_song });
  } catch (error) {
    console.log(error);
  }
});

module.exports = RenderWidgetRoute;
