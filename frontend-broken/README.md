# Frontend - Resilient Live Polling System

## Overview

The frontend uses React with a clean architecture:

- **Custom Hooks**: Logic separation from UI
- **Context API**: Global state management
- **Component Structure**: Modular and reusable

## Architecture

### Custom Hooks

#### useSocket
Manages WebSocket connection with automatic reconnection:
```javascript
const { socket, isConnected, emit, on, off } = useSocket();
```

Features:
- Automatic reconnection on disconnect
- Connection status tracking
- Event listener management
- Error notifications

#### usePollTimer
Handles timer countdown and synchronization:
```javascript
const { timeRemaining, formattedTime, resetTimer, stopTimer } = usePollTimer(
  initialTime,
  isActive,
  onExpire
);
```

Features:
- Server-synchronized countdown
- Automatic format (MM:SS)
- Expiration callback
- Manual reset/stop controls

#### useStudentName
Manages student identification with sessionStorage:
```javascript
const { studentName, saveName, clearName, hasName } = useStudentName();
```

Features:
- Unique per browser tab
- Persistent across page refreshes
- Easy name management

### Context Providers

#### PollContext
Global state for polling functionality:
```javascript
const {
  socket,
  isConnected,
  activePoll,
  remainingTime,
  hasVoted,
  pollHistory,
  createPoll,
  submitVote,
  endPoll,
  requestPollState,
  fetchPollHistory,
} = usePoll();
```

#### ChatContext
Global state for chat functionality:
```javascript
const {
  messages,
  isOpen,
  sendMessage,
  toggleChat,
} = useChat();
```

## Components

### Teacher Components

#### TeacherDashboard
Main container with tab navigation:
- Create Poll tab
- Live Results tab
- Poll History tab
- Connection status indicator

#### CreatePoll
Poll creation form:
- Question input
- Dynamic option management (2-6 options)
- Duration selector (10-300 seconds)
- Validation before submission

#### LiveResults
Real-time results display:
- Live vote counts
- Percentage calculations
- Progress bars
- Timer display
- Auto-updates via Socket.io

#### PollHistory
Historical data from database:
- List of past polls
- Final vote counts
- Timestamps
- Results visualization

### Student Components

#### StudentView
Main student interface:
- Student name display
- Connection status
- Poll interface container

#### StudentOnboarding
Name entry form:
- Validation (min 2 characters)
- sessionStorage persistence
- Auto-focus input

#### PollInterface
Voting and results interface:
- Waiting state (no active poll)
- Voting state (active poll, not voted)
- Results state (voted or poll ended)
- Timer display
- Real-time updates

### Shared Components

#### ChatPopup
Floating chat interface:
- Toggle button with notification badge
- Message list with auto-scroll
- Sender identification (Teacher/Student)
- Real-time message delivery

## State Recovery Implementation

### On Page Load
```javascript
useEffect(() => {
  if (socket && isConnected) {
    // Request current state from server
    requestPollState(studentName);
  }
}, [socket, isConnected, studentName]);
```

### Server Response
```javascript
socket.on('poll:state', (data) => {
  if (data && data.poll) {
    setActivePoll(data.poll);
    setRemainingTime(data.remainingTime);
    setHasVoted(data.hasVoted);
  }
});
```

## Timer Synchronization

### Late Joiner Scenario
1. Poll starts at 12:00:00 (60 seconds)
2. Student joins at 12:00:30
3. Server calculates: `remainingTime = 60 - 30 = 30s`
4. Student sees 30 seconds, not 60

### Implementation
```javascript
// Server side (Poll model)
getRemainingTime() {
  const now = new Date();
  const elapsed = Math.floor((now - this.startTime) / 1000);
  return Math.max(0, this.duration - elapsed);
}

// Client side (usePollTimer)
useEffect(() => {
  setTimeRemaining(initialTime); // Sync with server
}, [initialTime]);
```

## Optimistic UI Updates

### Vote Submission
```javascript
const handleSubmit = async () => {
  // Optimistic update
  setSelectedOption(index);
  
  try {
    submitVote(pollId, studentName, optionIndex);
    // Server confirms via socket event
  } catch (error) {
    // Revert on error
    setSelectedOption(null);
    toast.error(error.message);
  }
};
```

## Error Handling

### Connection Errors
```javascript
socket.on('connect_error', (error) => {
  toast.error('Failed to connect to server');
});

socket.on('disconnect', () => {
  toast.warning('Connection lost. Trying to reconnect...');
});
```

### API Errors
```javascript
socket.on('error', (data) => {
  toast.error(data.message || 'An error occurred');
});
```

### Validation Errors
```javascript
if (!question.trim()) {
  alert('Please enter a question');
  return;
}
```

## Styling

All components use modular CSS:
- Component-specific stylesheets
- Gradient color scheme
- Responsive design
- Smooth animations
- Accessibility considerations

### Color Palette
- Primary: `#667eea` → `#764ba2` (Teacher)
- Secondary: `#f093fb` → `#f5576c` (Student)
- Success: `#4caf50`
- Error: `#f44336`
- Warning: `#ffc107`

## Running the Frontend

### Development
```bash
npm start
```
Opens at `http://localhost:3000`

### Production Build
```bash
npm run build
```
Creates optimized build in `/build` directory

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Key Features

✅ **State Recovery**: Page refresh doesn't lose poll state
✅ **Timer Sync**: Late joiners see accurate remaining time
✅ **Real-time Updates**: Instant result updates via WebSocket
✅ **Error Handling**: Graceful degradation and user feedback
✅ **Responsive**: Works on desktop and mobile
✅ **Accessible**: Keyboard navigation and screen reader friendly
