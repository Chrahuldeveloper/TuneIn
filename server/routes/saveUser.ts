const { Router } = require("express");
const saveuserRouter = Router();
const dbclient = require("../dbconfig/connectDb")
saveuserRouter.post("/api/save", async (req, res) => {
  try {
    const { name, email } = req.body;

    await dbclient.query(
      "INSERT INTO users (name, email) VALUES ($1, $2)",
      [name, email]
    );

    res.status(201).json({ message: "✅ User saved successfully" });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = saveuserRouter;
