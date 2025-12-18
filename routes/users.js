const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const router = express.Router();

// Get collection reference
const usersCollection = () => getDB().collection("users");

// POST - Create a new user
router.post("/", async (req, res) => {
  try {
    const { name, email, photoURL, role } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).json({
        error: "Missing required fields: name, email, role",
      });
    }

    // Check if user already exists
    const existingUser = await usersCollection().findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User with this email already exists" });
    }

    const newUser = {
      name,
      email,
      photoURL: photoURL || "",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection().insertOne(newUser);
    res.status(201).json({
      message: "User created successfully",
      userId: result.insertedId,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all users
router.get("/", async (req, res) => {
  try {
    const users = await usersCollection().find({}).toArray();
    res.json({
      total: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get a specific user by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await usersCollection().findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update a user
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, photoURL, role } = req.body;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (photoURL !== undefined) updateData.photoURL = photoURL;
    if (role) updateData.role = role;
    updateData.updatedAt = new Date();

    const result = await usersCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const result = await usersCollection().deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
