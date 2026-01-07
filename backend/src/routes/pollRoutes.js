const express = require('express');
const router = express.Router();
const PollController = require('../controllers/PollController');

router.post('/create', PollController.createPoll);
router.get('/active', PollController.getActivePoll);
router.get('/history', PollController.getPollHistory);
router.post('/vote', PollController.submitVote);
router.get('/check-vote', PollController.checkVoteStatus);

module.exports = router;
