import React, { useState, useEffect } from 'react';
import { usePoll } from '../../context/PollContext';
import CreatePoll from './CreatePoll';
import LiveResults from './LiveResults';
import PollHistory from './PollHistory';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { socket, isConnected, requestPollState } = usePoll();
  const [activeTab, setActiveTab] = useState('create');

  useEffect(() => {
    if (socket && isConnected) {
      // Register as teacher
      socket.emit('register:teacher');
      
      // Request current poll state for recovery
      requestPollState();
    }
  }, [socket, isConnected, requestPollState]);

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="connection-status">
          <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
      </header>

      <div className="dashboard-tabs">
        <button
          className={`tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Poll
        </button>
        <button
          className={`tab ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          Live Results
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Poll History
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'create' && <CreatePoll />}
        {activeTab === 'results' && <LiveResults />}
        {activeTab === 'history' && <PollHistory />}
      </div>
    </div>
  );
};

export default TeacherDashboard;
