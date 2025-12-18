const express = require("express");
const { getDB } = require("../config/db");
const verifyToken = require("../middleware/verifyToken");
const { verifyAdmin } = require("../middleware/verifyRoles");

const router = express.Router();

router.get("/admin-stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const scholarshipsCollection = db.collection("scholarships");
    const applicationsCollection = db.collection("applications");

    const [
      totalUsers,
      totalScholarships,
      totalApplications,
      revenueResult,
      chartData,
    ] = await Promise.all([
      usersCollection.countDocuments(),
      scholarshipsCollection.countDocuments(),
      applicationsCollection.countDocuments(),
      applicationsCollection
        .aggregate([
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$applicationFees" },
            },
          },
        ])
        .toArray(),
      applicationsCollection
        .aggregate([
          {
            $group: {
              _id: "$scholarshipCategory",
              count: { $sum: 1 },
            },
          },
          {
            $sort: { count: -1 },
          },
        ])
        .toArray(),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.json({
      totalUsers,
      totalScholarships,
      totalApplications,
      totalRevenue,
      chartData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
