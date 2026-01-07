import React, { useState } from 'react';
import './TeacherLogin.css';

const TeacherLogin = ({ onLoginSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple password check - you can make this more secure
    const TEACHER_PASSWORD = process.env.REACT_APP_TEACHER_PASSWORD || 'teacher123';
    
    if (password === TEACHER_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="teacher-login">
      <div className="login-card">
        <div className="login-header">
          <span className="role-icon">👨‍🏫</span>
          <h2>Teacher Login</h2>
          <p>Enter your password to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="Enter teacher password"
              autoFocus
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Login
          </button>

          <div className="help-text">
            <p>Default password: teacher123</p>
            <p className="note">(Change this in .env file)</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherLogin;
