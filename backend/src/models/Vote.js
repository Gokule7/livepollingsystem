const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  optionIndex: {
    type: Number,
    required: true,
  },
  votedAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to prevent duplicate votes
voteSchema.index({ pollId: 1, studentName: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
