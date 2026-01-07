const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  duration: {
    type: Number,
    required: true,
    default: 60, // seconds
  },
  startTime: {
    type: Date,
    default: null,
  },
  endTime: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to calculate remaining time
pollSchema.methods.getRemainingTime = function() {
  if (!this.startTime || !this.isActive) return 0;
  
  const now = new Date();
  const elapsed = Math.floor((now - this.startTime) / 1000);
  const remaining = Math.max(0, this.duration - elapsed);
  
  return remaining;
};

// Method to check if poll has expired
pollSchema.methods.hasExpired = function() {
  return this.getRemainingTime() === 0;
};

module.exports = mongoose.model('Poll', pollSchema);
