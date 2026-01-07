const ChatService = require('../services/ChatService');

class ChatController {
  async getMessages(req, res) {
    try {
      const messages = await ChatService.getRecentMessages();
      
      res.json({ 
        success: true, 
        messages 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
}

module.exports = new ChatController();
