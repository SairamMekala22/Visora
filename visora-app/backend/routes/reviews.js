const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");

// @route   POST /api/reviews/add
// @desc    Add a new review (user reviewing the Visora app)
router.post("/add", async (req, res) => {
  try {
    const { userId, reviewText, rating } = req.body;

    // Validate input
    if (!reviewText || reviewText.trim().length < 10) {
      return res.status(400).json({ message: "Review must be at least 10 characters long" });
    }

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const review = new Review({
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      text: reviewText.trim(),
      rating: rating || 5,
      isPublic: true
    });

    await review.save();

    res.json({
      message: "Review added successfully",
      review: {
        _id: review._id,
        text: review.text,
        rating: review.rating,
        date: review.createdAt
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/reviews/:userId
// @desc    Get all reviews by a specific user
router.get("/:userId", async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .select('text rating createdAt updatedAt');
    
    // Map to include 'date' field for backward compatibility
    const formattedReviews = reviews.map(review => ({
      _id: review._id,
      text: review.text,
      rating: review.rating,
      date: review.createdAt, // For backward compatibility
      createdAt: review.createdAt,
      updatedAt: review.updatedAt
    }));
    
    res.json(formattedReviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/reviews/public/all
// @desc    Get all public reviews (for displaying on landing page)
router.get("/public/all", async (req, res) => {
  try {
    const reviews = await Review.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .select('userName text rating createdAt');
    
    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE /api/reviews/:reviewId
// @desc    Delete a review
router.delete("/:reviewId", async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/reviews/:reviewId
// @desc    Update a review
router.put("/:reviewId", async (req, res) => {
  try {
    const { text, rating } = req.body;
    
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (text) review.text = text.trim();
    if (rating) review.rating = rating;
    review.updatedAt = Date.now();

    await review.save();

    res.json({
      message: "Review updated successfully",
      review
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
