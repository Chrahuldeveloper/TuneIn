const { Router } = require("express");
const saveuserRouter = Router();

saveuserRouter.post("/", async (req, res) => {
  try {
    const { name, email } = req.body;

    await db.query("INSERT INTO users (name, email) VALUES ($1, $2)", [
      name,
      email,
    ]);

    res.status(201).json({ message: "✅ User saved successfully" });
  } catch (error) {
    console.error("❌ Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = saveuserRouter;
