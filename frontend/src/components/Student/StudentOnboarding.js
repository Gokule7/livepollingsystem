import React, { useState } from 'react';
import { useStudentName } from '../../hooks/useStudentName';
import './StudentOnboarding.css';

const StudentOnboarding = ({ onComplete }) => {
  const { saveName } = useStudentName();
  const [inputName, setInputName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const trimmedName = inputName.trim();
    
    if (!trimmedName) {
      setError('Please enter your name');
      return;
    }

    if (trimmedName.length < 2) {
      setError('Name must be at least 2 characters');
      return;
    }

    saveName(trimmedName);
    if (onComplete) {
      onComplete(trimmedName);
    }
  };

  return (
    <div className="student-onboarding">
      <div className="onboarding-card">
        <h1>Welcome to Live Polling</h1>
        <p>Please enter your name to continue</p>
        
        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <input
              type="text"
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name"
              className="name-input"
              autoFocus
            />
            {error && <span className="error-message">{error}</span>}
          </div>
          
          <button type="submit" className="continue-btn">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentOnboarding;
