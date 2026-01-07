const Poll = require('../models/Poll');
const Vote = require('../models/Vote');

class PollService {
  async createPoll(question, options, duration = 60) {
    try {
      // Check if there's an active poll
      const activePoll = await Poll.findOne({ isActive: true });
      if (activePoll) {
        throw new Error('Another poll is currently active');
      }

      const poll = new Poll({
        question,
        options: options.map(text => ({ text, votes: 0 })),
        duration,
        isActive: false,
      });

      await poll.save();
      return poll;
    } catch (error) {
      throw error;
    }
  }

  async startPoll(pollId) {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        throw new Error('Poll not found');
      }

      if (poll.isActive) {
        throw new Error('Poll is already active');
      }

      poll.isActive = true;
      poll.startTime = new Date();
      await poll.save();

      // Auto-end poll after duration
      setTimeout(async () => {
        await this.endPoll(pollId);
      }, poll.duration * 1000);

      return poll;
    } catch (error) {
      throw error;
    }
  }

  async endPoll(pollId) {
    try {
      const poll = await Poll.findById(pollId);
      if (!poll) {
        return null;
      }

      if (!poll.isActive) {
        return poll;
      }

      poll.isActive = false;
      poll.endTime = new Date();
      await poll.save();

      return poll;
    } catch (error) {
      throw error;
    }
  }

  async getActivePoll() {
    try {
      const poll = await Poll.findOne({ isActive: true });
      return poll;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentPollState() {
    try {
      const poll = await Poll.findOne({ isActive: true });
      if (!poll) {
        return null;
      }

      const remainingTime = poll.getRemainingTime();
      
      // Auto-end if expired
      if (remainingTime === 0 && poll.isActive) {
        await this.endPoll(poll._id);
        poll.isActive = false;
      }

      return {
        poll,
        remainingTime,
      };
    } catch (error) {
      throw error;
    }
  }

  async submitVote(pollId, studentName, optionIndex) {
    try {
      const poll = await Poll.findById(pollId);
      
      if (!poll) {
        throw new Error('Poll not found');
      }

      if (!poll.isActive) {
        throw new Error('Poll is not active');
      }

      // Check if poll has expired
      if (poll.hasExpired()) {
        await this.endPoll(pollId);
        throw new Error('Poll has expired');
      }

      if (optionIndex < 0 || optionIndex >= poll.options.length) {
        throw new Error('Invalid option index');
      }

      // Check if student has already voted (race condition protection)
      const existingVote = await Vote.findOne({ pollId, studentName });
      if (existingVote) {
        throw new Error('You have already voted');
      }

      // Create vote record
      const vote = new Vote({
        pollId,
        studentName,
        optionIndex,
      });

      await vote.save();

      // Update poll votes
      poll.options[optionIndex].votes += 1;
      poll.totalVotes += 1;
      await poll.save();

      return poll;
    } catch (error) {
      throw error;
    }
  }

  async hasStudentVoted(pollId, studentName) {
    try {
      const vote = await Vote.findOne({ pollId, studentName });
      return !!vote;
    } catch (error) {
      return false;
    }
  }

  async getPollHistory() {
    try {
      const polls = await Poll.find({ isActive: false, endTime: { $ne: null } })
        .sort({ createdAt: -1 })
        .limit(50);
      
      return polls;
    } catch (error) {
      throw error;
    }
  }

  async getPollById(pollId) {
    try {
      const poll = await Poll.findById(pollId);
      return poll;
    } catch (error) {
      throw error;
    }
  }

  async getAllPolls() {
    try {
      const polls = await Poll.find().sort({ createdAt: -1 });
      return polls;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new PollService();
