const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { connectDB, getDB } = require("./config/db");

const usersRoutes = require("./routes/users");
const scholarshipsRoutes = require("./routes/scholarships");
const applicationsRoutes = require("./routes/applications");
const reviewsRoutes = require("./routes/reviews");
const authRoutes = require("./routes/auth");
const paymentsRoutes = require("./routes/payments");
const adminRoutes = require("./routes/admin");

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ScholarStream Server is running");
});

app.get("/health", (req, res) => {
  try {
    const db = getDB();
    res.status(200).json({
      status: "OK",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      database: db ? "Connected" : "Disconnected",
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      message: "Database not connected",
      timestamp: new Date().toISOString(),
      database: "Disconnected",
    });
  }
});

app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

app.post("/api/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  res.send({ token });
});

app.use("/api/users", usersRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/admin", adminRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 ScholarStream Server is running on port ${port}`);
  });
};

startServer().catch(console.dir);
