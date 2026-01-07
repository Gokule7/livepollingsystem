import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import './ChatPopup.css';

const ChatPopup = ({ userName, isTeacher = false }) => {
  const { messages, isOpen, sendMessage, toggleChat } = useChat();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    
    const trimmed = messageText.trim();
    if (!trimmed) return;

    sendMessage(userName, trimmed, isTeacher);
    setMessageText('');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <button className="chat-toggle-btn" onClick={toggleChat}>
        <span className="chat-icon">💬</span>
        {!isOpen && messages.length > 0 && (
          <span className="message-count">{messages.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Chat</h3>
            <button className="close-btn" onClick={toggleChat}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">No messages yet</div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${msg.isTeacher ? 'teacher' : 'student'} ${
                    msg.senderName === userName ? 'own' : ''
                  }`}
                >
                  <div className="message-header">
                    <span className="sender-name">
                      {msg.senderName}
                      {msg.isTeacher && <span className="badge">Teacher</span>}
                    </span>
                    <span className="message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="message-text">{msg.message}</div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-form" onSubmit={handleSend}>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="chat-input"
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatPopup;
