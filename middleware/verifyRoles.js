const { getDB } = require("../config/db");

const usersCollection = () => getDB().collection("users");

const verifyAdmin = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const user = await usersCollection().findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role !== "Admin") {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  next();
};

const verifyModerator = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const user = await usersCollection().findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role !== "Moderator") {
    return res
      .status(403)
      .json({ error: "Forbidden: Moderator access required" });
  }

  next();
};

const verifyAdminOrModerator = async (req, res, next) => {
  const email = req.decoded?.email;
  if (!email) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  const user = await usersCollection().findOne({ email });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  if (user.role !== "Admin" && user.role !== "Moderator") {
    return res
      .status(403)
      .json({ error: "Forbidden: Admin or Moderator access required" });
  }

  next();
};

module.exports = { verifyAdmin, verifyModerator, verifyAdminOrModerator };
