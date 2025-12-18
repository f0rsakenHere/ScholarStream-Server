const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid token format" });
  }

  const secret = process.env.ACCESS_TOKEN_SECRET;

  if (!secret) {
    return res
      .status(500)
      .json({ error: "Server error: ACCESS_TOKEN_SECRET not configured" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ error: "Forbidden: Token expired" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ error: "Forbidden: Invalid token" });
      }
      return res
        .status(403)
        .json({ error: "Forbidden: Token verification failed" });
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = verifyToken;
