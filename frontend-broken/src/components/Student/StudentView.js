import React, { useEffect } from 'react';
import { useStudentName } from '../../hooks/useStudentName';
import { usePoll } from '../../context/PollContext';
import StudentOnboarding from './StudentOnboarding';
import PollInterface from './PollInterface';
import './StudentView.css';

const StudentView = () => {
  const { studentName, hasName } = useStudentName();
  const { socket, isConnected, requestPollState } = usePoll();

  useEffect(() => {
    if (socket && isConnected && studentName) {
      // Register as student
      socket.emit('register:student', studentName);
      
      // Request current poll state for recovery
      requestPollState(studentName);
    }
  }, [socket, isConnected, studentName, requestPollState]);

  const handleOnboardingComplete = (name) => {
    if (socket && isConnected) {
      socket.emit('register:student', name);
      requestPollState(name);
    }
  };

  if (!hasName) {
    return <StudentOnboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="student-view">
      <header className="student-header">
        <div className="student-info">
          <h1>Live Polling System</h1>
          <p>Welcome, <strong>{studentName}</strong></p>
        </div>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
      </header>

      <div className="student-content">
        <PollInterface studentName={studentName} />
      </div>
    </div>
  );
};

export default StudentView;
