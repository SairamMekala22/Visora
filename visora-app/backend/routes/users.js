const express = require("express");
const router = express.Router();
const User = require("../models/User");

// @route   GET /api/users/:userId
// @desc    Get user profile
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   GET /api/users/preferences/:userId
// @desc    Get user preferences
router.get("/preferences/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      preferences: user.preferences || {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   PUT /api/users/preferences/:userId
// @desc    Update user preferences
router.put("/preferences/:userId", async (req, res) => {
  try {
    const { preferences } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update preferences - directly assign the preferences object
    user.preferences = preferences;

    await user.save();

    res.json({
      message: "Preferences updated successfully",
      preferences: user.preferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route   DELETE /api/users/preferences/:userId
// @desc    Delete/Reset user preferences
router.delete("/preferences/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Reset preferences to default
    user.preferences = {};

    await user.save();

    res.json({
      message: "Preferences reset successfully",
      preferences: user.preferences
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
