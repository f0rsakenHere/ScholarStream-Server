const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const uri =
  process.env.MONGODB_URI ||
  "mongodb+srv://mehedi-DB:rV14y5T3V2nYpI4F@cluster0.rkxff0y.mongodb.net/?appName=Cluster0";

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
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
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
