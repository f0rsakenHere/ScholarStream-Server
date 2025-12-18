const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/jwt", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      return res
        .status(500)
        .json({ error: "Server error: ACCESS_TOKEN_SECRET not configured" });
    }

    const token = jwt.sign({ email }, secret, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
