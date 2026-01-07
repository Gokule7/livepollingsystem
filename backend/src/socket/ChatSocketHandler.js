const ChatService = require('../services/ChatService');

class ChatSocketHandler {
  constructor(io) {
    this.io = io;
  }

  handleConnection(socket) {
    // Send chat message
    socket.on('chat:send', async (data) => {
      try {
        const { senderName, message, isTeacher } = data;
        
        const chatMessage = await ChatService.saveMessage(
          senderName,
          message,
          isTeacher
        );

        // Broadcast to all clients
        this.io.emit('chat:message', chatMessage);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Get chat history
    socket.on('chat:history', async () => {
      try {
        const messages = await ChatService.getRecentMessages();
        socket.emit('chat:history:data', { messages });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });
  }
}

module.exports = ChatSocketHandler;
