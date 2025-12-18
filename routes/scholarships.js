const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const { verifyAdminOrModerator } = require("../middleware/verifyRoles");

const router = express.Router();

const scholarshipsCollection = () => getDB().collection("scholarships");

router.post("/", verifyToken, verifyAdminOrModerator, async (req, res) => {
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

router.get("/all-scholarships", async (req, res) => {
  try {
    const { search, country, category, degree, sort } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { scholarshipName: { $regex: search, $options: "i" } },
        { universityName: { $regex: search, $options: "i" } },
        { degree: { $regex: search, $options: "i" } },
      ];
    }

    if (country) {
      filter.universityCountry = country;
    }

    if (category) {
      filter.scholarshipCategory = category;
    }

    if (degree && !search) {
      filter.degree = degree;
    }

    let sortOption = {};
    if (sort === "fees_asc") {
      sortOption = { applicationFees: 1 };
    } else if (sort === "fees_desc") {
      sortOption = { applicationFees: -1 };
    } else if (sort === "date_asc") {
      sortOption = { scholarshipPostDate: 1 };
    } else if (sort === "date_desc") {
      sortOption = { scholarshipPostDate: -1 };
    }

    const scholarships = await scholarshipsCollection()
      .find(filter)
      .sort(sortOption)
      .toArray();

    res.json({
      total: scholarships.length,
      scholarships,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.get("/filter", async (req, res) => {
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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid scholarship ID format" });
    }

    const scholarship = await scholarshipsCollection().findOne({
      _id: new ObjectId(id),
    });
    if (!scholarship) {
      return res.status(404).json({ error: "Scholarship not found" });
    }

    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid scholarship ID format" });
    }
    const updateData = {
      ...updateFields,
      updatedAt: new Date(),
    };

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

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid scholarship ID format" });
    }

    const result = await scholarshipsCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Scholarship not found" });
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
