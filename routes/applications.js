const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const router = express.Router();

const applicationsCollection = () => getDB().collection("applications");

router.post("/", async (req, res) => {
  try {
    const {
      scholarshipId,
      userId,
      userName,
      userEmail,
      universityName,
      scholarshipCategory,
      degree,
      applicationFees,
      serviceCharge,
      paymentStatus,
      feedback,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !userName ||
      !userEmail ||
      !universityName ||
      !scholarshipCategory ||
      !degree ||
      !applicationFees ||
      !serviceCharge
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const newApplication = {
      scholarshipId,
      userId,
      userName,
      userEmail,
      universityName,
      scholarshipCategory,
      degree,
      applicationFees,
      serviceCharge,
      applicationStatus: "pending",
      paymentStatus: paymentStatus || "unpaid",
      applicationDate: new Date(),
      feedback: feedback || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await applicationsCollection().insertOne(newApplication);
    res.status(201).json({
      message: "Application created successfully",
      applicationId: result.insertedId,
      application: newApplication,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all applications
router.get("/", async (req, res) => {
  try {
    const applications = await applicationsCollection().find({}).toArray();
    res.json({
      total: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  try {
    const { userId, scholarshipId, status, paymentStatus } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (scholarshipId) filter.scholarshipId = scholarshipId;
    if (status) filter.applicationStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const applications = await applicationsCollection().find(filter).toArray();
    res.json({
      total: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get a specific application by ID
router.get("/:id", async (req, res) => {
  try {
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }    });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update an application (for status updates, feedback, etc.)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }    const result = await applicationsCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      message: "Application updated successfully",
      application: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Update application status (for moderators)
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus, feedback } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { applicationStatus, feedback } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }
    if (!applicationStatus) {
      return res.status(400).json({ error: "applicationStatus is required" });
    }
    const updateData = {
      applicationStatus,
      updatedAt: new Date(),
    };    );

    if (!result.value) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      message: "Application status updated successfully",
      application: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH - Update payment status
router.patch("/:id/payment", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }

    if (!paymentStatus) {
      return res.status(400).json({ error: "paymentStatus is required" });
    }
router.patch("/:id/payment", async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }
    if (!paymentStatus) {
      return res.status(400).json({ error: "paymentStatus is required" });
    }      application: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete an application
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }

    const result = await applicationsCollection().deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }
module.exports = router;
