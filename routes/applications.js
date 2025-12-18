const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const { verifyModerator } = require("../middleware/verifyRoles");

const router = express.Router();

const applicationsCollection = () => getDB().collection("applications");

router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      scholarshipId,
      universityName,
      scholarshipCategory,
      degree,
      applicationFees,
      serviceCharge,
      applicantName,
      applicantEmail,
      transactionId,
    } = req.body;

    if (
      !scholarshipId ||
      !universityName ||
      !scholarshipCategory ||
      !degree ||
      !applicationFees ||
      !serviceCharge ||
      !applicantName ||
      !applicantEmail ||
      !transactionId
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const existingApplication = await applicationsCollection().findOne({
      scholarshipId,
      applicantEmail,
    });

    if (existingApplication) {
      return res.status(409).json({
        error: "You have already applied for this scholarship",
      });
    }

    const newApplication = {
      scholarshipId,
      universityName,
      scholarshipCategory,
      degree,
      applicationFees,
      serviceCharge,
      applicantName,
      applicantEmail,
      transactionId,
      applicationStatus: "pending",
      paymentStatus: "paid",
      applicationDate: new Date(),
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

router.get("/", verifyToken, verifyModerator, async (req, res) => {
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

router.get("/filter", async (req, res) => {
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

router.get("/user/:email", verifyToken, async (req, res) => {
  try {
    const email = req.params.email;

    if (req.decoded.email !== email) {
      return res.status(403).json({ message: "Forbidden access" });
    }

    const query = { applicantEmail: email };
    const result = await applicationsCollection().find(query).toArray();
    res.json({
      total: result.length,
      applications: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }

    const application = await applicationsCollection().findOne({
      _id: new ObjectId(id),
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid application ID format" });
    }

    const updateData = {
      ...updateFields,
      updatedAt: new Date(),
    };

    const result = await applicationsCollection().findOneAndUpdate(
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

router.patch("/:id/status", verifyToken, verifyModerator, async (req, res) => {
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
    };

    if (feedback) {
      updateData.feedback = feedback;
    }

    const result = await applicationsCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

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

    const updateData = {
      paymentStatus,
      updatedAt: new Date(),
    };

    const result = await applicationsCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({
      message: "Application payment status updated successfully",
      application: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    res.json({
      message: "Application deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
