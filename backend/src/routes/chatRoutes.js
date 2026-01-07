const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');

router.get('/messages', ChatController.getMessages);

module.exports = router;
