const ChatMessage = require('../models/ChatMessage');

class ChatService {
  async saveMessage(senderName, message, isTeacher = false) {
    try {
      const chatMessage = new ChatMessage({
        senderName,
        message,
        isTeacher,
      });

      await chatMessage.save();
      return chatMessage;
    } catch (error) {
      throw error;
    }
  }

  async getRecentMessages(limit = 50) {
    try {
      const messages = await ChatMessage.find()
        .sort({ timestamp: -1 })
        .limit(limit);
      
      return messages.reverse();
    } catch (error) {
      throw error;
    }
  }

  async clearMessages() {
    try {
      await ChatMessage.deleteMany({});
      return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ChatService();
