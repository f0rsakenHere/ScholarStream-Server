const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB, getDB } = require("./config/db");

// Import routes
const usersRoutes = require("./routes/users");
const scholarshipsRoutes = require("./routes/scholarships");
const applicationsRoutes = require("./routes/applications");
const reviewsRoutes = require("./routes/reviews");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send("ScholarStream Server is running");
});

// Health check route
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

// API Routes
app.use("/api/users", usersRoutes);
app.use("/api/applications", applicationsRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/reviews", reviewsRoutes);

// Start the server
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 ScholarStream Server is running on port ${port}`);
  });
};

startServer().catch(console.dir);
