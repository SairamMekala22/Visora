const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    // Accessibility Features
    voiceControl: {
      type: Boolean,
      default: false
    },
    hideImages: {
      type: Boolean,
      default: false
    },
    highContrast: {
      type: Boolean,
      default: false
    },
    dyslexiaFont: {
      type: Boolean,
      default: false
    },
    highlightLinks: {
      type: Boolean,
      default: false
    },
    disableAnimations: {
      type: Boolean,
      default: false
    },
    focusLine: {
      type: Boolean,
      default: false
    },
    letterSpacing: {
      type: Number,
      default: 0,
      min: 0,
      max: 0.5
    },
    dimmerOverlay: {
      type: Boolean,
      default: false
    },
    cursorSize: {
      type: Number,
      default: 1,
      min: 0,
      max: 2
    },
    fontSize: {
      type: Number,
      default: 100,
      min: 100,
      max: 200
    },
    lineHeight: {
      type: Number,
      default: 1.5,
      min: 1.0,
      max: 3.0
    },
    contentWidth: {
      type: Number,
      default: 1000,
      min: 600,
      max: 1400
    },
    blockPopups: {
      type: Boolean,
      default: false
    },
    readingMode: {
      type: Boolean,
      default: false
    },
    disableStickyElements: {
      type: Boolean,
      default: false
    },
    disableHoverEffects: {
      type: Boolean,
      default: false
    },
    textToSpeech: {
      rate: {
        type: Number,
        default: 1.0,
        min: 0.1,
        max: 10.0
      },
      pitch: {
        type: Number,
        default: 1.0,
        min: 0.0,
        max: 2.0
      },
      volume: {
        type: Number,
        default: 1.0,
        min: 0.0,
        max: 1.0
      },
      voice: {
        type: Number,
        default: 0,
        min: 0,
        max: 21
      }
    }
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

// Index for faster email lookups
UserSchema.index({ email: 1 });

module.exports = mongoose.model("User", UserSchema);
