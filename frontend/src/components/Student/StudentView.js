import React, { useEffect, useState } from 'react';
import { usePoll } from '../../context/PollContext';
import PollInterface from './PollInterface';
import ChangePassword from '../Auth/ChangePassword';
import './StudentView.css';

const StudentView = ({ user, onLogout }) => {
  const { socket, isConnected, requestPollState } = usePoll();
  const [studentName] = useState(user.username);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (socket && isConnected && studentName) {
      // Register as student
      socket.emit('register:student', studentName);
      
      // Request current poll state for recovery
      requestPollState(studentName);
    }
  }, [socket, isConnected, studentName, requestPollState]);

  return (
    <div className="student-view">
      <header className="student-header">
        <div className="header-left">
          <h1>Live Polling System</h1>
          <p>Welcome, <strong>{studentName}</strong></p>
        </div>
        <div className="header-right">
          <div className="connection-status">
            <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● Connected' : '○ Disconnected'}
            </span>
          </div>
          <button className="header-btn" onClick={() => setShowChangePassword(true)}>
            🔑 Change Password
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="student-content">
        <PollInterface studentName={studentName} />
      </div>

      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default StudentView;
