const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const router = express.Router();

const scholarshipsCollection = () => getDB().collection("scholarships");

router.post("/", async (req, res) => {
  try {
    const {
      scholarshipName,
      universityName,
      universityImage,
      universityCountry,
      universityCity,
      universityWorldRank,
      subjectCategory,
      scholarshipCategory,
      degree,
      tuitionFees,
      applicationFees,
      serviceCharge,
      applicationDeadline,
      postedUserEmail,
    } = req.body;

    if (
      !scholarshipName ||
      !universityName ||
      !universityCountry ||
      !universityCity ||
      !subjectCategory ||
      !scholarshipCategory ||
      !degree ||
      !applicationFees ||
      !serviceCharge ||
      !applicationDeadline ||
      !postedUserEmail
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const newScholarship = {
      scholarshipName,
      universityName,
      universityImage: universityImage || "",
      universityCountry,
      universityCity,
      universityWorldRank: universityWorldRank || 0,
      subjectCategory,
      scholarshipCategory,
      degree,
      tuitionFees: tuitionFees || null,
      applicationFees,
      serviceCharge,
      applicationDeadline,
      scholarshipPostDate: new Date(),
      postedUserEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await scholarshipsCollection().insertOne(newScholarship);
    res.status(201).json({
      message: "Scholarship created successfully",
      scholarshipId: result.insertedId,
      scholarship: newScholarship,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all scholarships
router.get("/", async (req, res) => {
  try {
    const scholarships = await scholarshipsCollection().find({}).toArray();
    res.json({
      total: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  try {
    const { country, category, degree, university } = req.query;
    const filter = {};

    if (country) filter.universityCountry = country;
    if (category) filter.scholarshipCategory = category;
    if (degree) filter.degree = degree;
    if (university)
      filter.universityName = { $regex: university, $options: "i" };

    const scholarships = await scholarshipsCollection().find(filter).toArray();
    res.json({
      total: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get a specific scholarship by ID
router.get("/:id", async (req, res) => {
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid scholarship ID format" });
    }      _id: new ObjectId(id),
    });
    if (!scholarship) {
      return res.status(404).json({ error: "Scholarship not found" });
    }

    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update a scholarship
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid scholarship ID format" });
    }
    const result = await scholarshipsCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Scholarship not found" });
    }

    res.json({
      message: "Scholarship updated successfully",
      scholarship: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a scholarship
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid scholarship ID format" });
    }      return res.status(404).json({ error: "Scholarship not found" });
    }

    res.json({
      message: "Scholarship deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
