import React, { useState, useEffect } from 'react';
import { PollProvider } from './context/PollContext';
import { ChatProvider } from './context/ChatContext';
import Auth from './components/Auth/Auth';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentView from './components/Student/StudentView';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [userType, setUserType] = useState(null);
  const [user, setUser] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setUserType(parsedUser.role);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setUserType(null);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    setUserType(authenticatedUser.role);
  };

  // Role selection screen
  if (!userType) {
    return (
      <div className="app-container">
        <div className="role-selection">
          <h1>Live Polling System</h1>
          <p>Select your role to continue</p>
          
          <div className="role-buttons">
            <button
              className="role-btn teacher"
              onClick={() => setUserType('teacher')}
            >
              <span className="role-icon">👨‍🏫</span>
              <span className="role-text">Teacher</span>
            </button>
            
            <button
              className="role-btn student"
              onClick={() => setUserType('student')}
            >
              <span className="role-icon">👨‍🎓</span>
              <span className="role-text">Student</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authentication screen
  if (!user) {
    return <Auth role={userType} onAuthSuccess={handleAuthSuccess} />;
  }

  // Main application
  return (
    <PollProvider>
      <ChatProvider>
        <div className="app-container">
          {userType === 'teacher' ? (
            <TeacherDashboard user={user} onLogout={handleLogout} />
          ) : (
            <StudentView user={user} onLogout={handleLogout} />
          )}
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </ChatProvider>
    </PollProvider>
  );
}

export default App;
