const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

// MongoDB Connection URI
const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mehedi-DB:rV14y5T3V2nYpI4F@cluster0.rkxff0y.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");

    // Get database reference
    db = client.db("scholarstream");
    console.log("📦 Database: scholarstream");

    return db;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

function getDB() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
}

module.exports = { connectDB, getDB };
