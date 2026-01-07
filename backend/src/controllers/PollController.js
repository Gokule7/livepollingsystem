const PollService = require('../services/PollService');

class PollController {
  async createPoll(req, res) {
    try {
      const { question, options, duration } = req.body;

      if (!question || !options || options.length < 2) {
        return res.status(400).json({ 
          success: false, 
          message: 'Question and at least 2 options are required' 
        });
      }

      const poll = await PollService.createPoll(question, options, duration);
      
      res.status(201).json({ 
        success: true, 
        poll 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getActivePoll(req, res) {
    try {
      const pollState = await PollService.getCurrentPollState();
      
      res.json({ 
        success: true, 
        data: pollState 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getPollHistory(req, res) {
    try {
      const polls = await PollService.getPollHistory();
      
      res.json({ 
        success: true, 
        polls 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async submitVote(req, res) {
    try {
      const { pollId, studentName, optionIndex } = req.body;

      if (!pollId || !studentName || optionIndex === undefined) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required fields' 
        });
      }

      const poll = await PollService.submitVote(pollId, studentName, optionIndex);
      
      res.json({ 
        success: true, 
        poll 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async checkVoteStatus(req, res) {
    try {
      const { pollId, studentName } = req.query;

      if (!pollId || !studentName) {
        return res.status(400).json({ 
          success: false, 
          message: 'Missing required parameters' 
        });
      }

      const hasVoted = await PollService.hasStudentVoted(pollId, studentName);
      
      res.json({ 
        success: true, 
        hasVoted 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new PollController();
