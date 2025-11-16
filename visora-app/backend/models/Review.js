const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for faster queries by userId
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 1000
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Index for faster queries
ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for formatted date
ReviewSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString();
});

// Ensure virtuals are included in JSON
ReviewSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model("Review", ReviewSchema);
