import React, { useState } from 'react';
import { PollProvider } from './context/PollContext';
import { ChatProvider } from './context/ChatContext';
import TeacherDashboard from './components/Teacher/TeacherDashboard';
import StudentView from './components/Student/StudentView';
import ChatPopup from './components/Shared/ChatPopup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');

  if (!userType) {
    return (
      <div className="app-container">
        <div className="role-selection">
          <h1>Live Polling System</h1>
          <p>Select your role to continue</p>
          
          <div className="role-buttons">
            <button
              className="role-btn teacher"
              onClick={() => {
                setUserType('teacher');
                setUserName('Teacher');
              }}
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

  return (
    <PollProvider>
      <ChatProvider>
        <div className="app-container">
          {userType === 'teacher' ? (
            <>
              <TeacherDashboard />
              <ChatPopup userName={userName} isTeacher={true} />
            </>
          ) : (
            <>
              <StudentView />
              <ChatPopup userName={userName || 'Student'} isTeacher={false} />
            </>
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
