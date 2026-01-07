import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { socket, emit, on, off } = useSocket();
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    // Listen for chat history
    const handleChatHistory = (data) => {
      setMessages(data.messages);
    };

    on('chat:message', handleNewMessage);
    on('chat:history:data', handleChatHistory);

    // Request chat history on mount
    emit('chat:history');

    return () => {
      off('chat:message', handleNewMessage);
      off('chat:history:data', handleChatHistory);
    };
  }, [socket, emit, on, off]);

  const sendMessage = (senderName, message, isTeacher = false) => {
    emit('chat:send', { senderName, message, isTeacher });
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isOpen,
        sendMessage,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
