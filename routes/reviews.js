const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const router = express.Router();

const reviewsCollection = () => getDB().collection("reviews");

router.post("/", async (req, res) => {
  try {
    const {
      scholarshipId,
      universityName,
      userName,
      userEmail,
      userImage,
      ratingPoint,
      reviewComment,
    } = req.body;

    if (
      !scholarshipId ||
      !universityName ||
      !userName ||
      !userEmail ||
      !ratingPoint ||
      !reviewComment
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    if (ratingPoint < 1 || ratingPoint > 5) {
      return res.status(400).json({
        error: "Rating point must be between 1 and 5",
      });
    }

    const newReview = {
      scholarshipId,
      universityName,
      userName,
      userEmail,
      userImage: userImage || "",
      ratingPoint,
      reviewComment,
      reviewDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await reviewsCollection().insertOne(newReview);
    res.status(201).json({
      message: "Review created successfully",
      reviewId: result.insertedId,
      review: newReview,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get all reviews
router.get("/", async (req, res) => {
router.get("/", async (req, res) => {
  try {
    const reviews = await reviewsCollection().find({}).toArray();
    res.json({
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

    const { scholarshipId, universityName, minRating, userEmail } = req.query;
    const filter = {};

    if (scholarshipId) filter.scholarshipId = scholarshipId;
    if (universityName)
      filter.universityName = { $regex: universityName, $options: "i" };
    if (minRating) filter.ratingPoint = { $gte: parseInt(minRating) };
    if (userEmail) filter.userEmail = userEmail;

    const reviews = await reviewsCollection().find(filter).toArray();
    res.json({
      total: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get reviews by scholarship ID
router.get("/scholarship/:scholarshipId", async (req, res) => {
  try {
    const { scholarshipId } = req.params;

    const reviews = await reviewsCollection().find({ scholarshipId }).toArray();

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ error: "No reviews found for this scholarship" });
    }

    // Calculate average rating
    const averageRating =
      reviews.reduce((sum, review) => sum + review.ratingPoint, 0) /
      reviews.length;

    res.json({
      total: reviews.length,
      averageRating: averageRating.toFixed(2),
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Get a specific review by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Update a review
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ratingPoint, reviewComment, userImage } = req.body;

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { ratingPoint, reviewComment, userImage } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }
    if (ratingPoint && (ratingPoint < 1 || ratingPoint > 5)) {
      return res.status(400).json({
        error: "Rating point must be between 1 and 5",
      });
    }
    const result = await reviewsCollection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.json({
      message: "Review updated successfully",
      review: result.value,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Delete a review
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid review ID format" });
    }    res.json({
      message: "Review deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
