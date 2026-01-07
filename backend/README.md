# Backend - Resilient Live Polling System

## Overview

The backend follows a clean architecture with proper separation of concerns:

- **Models**: MongoDB schemas
- **Services**: Business logic and database operations
- **Controllers**: HTTP request/response handling
- **Socket Handlers**: WebSocket event management
- **Routes**: API endpoints

## API Endpoints

### Polls

#### Create Poll
```
POST /api/polls/create
Content-Type: application/json

{
  "question": "What is your favorite programming language?",
  "options": ["JavaScript", "Python", "Java", "C++"],
  "duration": 60
}

Response:
{
  "success": true,
  "poll": { ... }
}
```

#### Get Active Poll
```
GET /api/polls/active

Response:
{
  "success": true,
  "data": {
    "poll": { ... },
    "remainingTime": 45
  }
}
```

#### Get Poll History
```
GET /api/polls/history

Response:
{
  "success": true,
  "polls": [ ... ]
}
```

#### Submit Vote
```
POST /api/polls/vote
Content-Type: application/json

{
  "pollId": "64abc123...",
  "studentName": "John Doe",
  "optionIndex": 0
}

Response:
{
  "success": true,
  "poll": { ... }
}
```

#### Check Vote Status
```
GET /api/polls/check-vote?pollId=64abc123...&studentName=John%20Doe

Response:
{
  "success": true,
  "hasVoted": true
}
```

### Chat

#### Get Messages
```
GET /api/chat/messages

Response:
{
  "success": true,
  "messages": [ ... ]
}
```

## Socket.io Events

### Client → Server

#### Register as Teacher
```javascript
socket.emit('register:teacher');
```

#### Register as Student
```javascript
socket.emit('register:student', studentName);
```

#### Create and Start Poll
```javascript
socket.emit('poll:create', {
  question: 'Your question?',
  options: ['Option 1', 'Option 2'],
  duration: 60
});
```

#### Submit Vote
```javascript
socket.emit('poll:vote', {
  pollId: '64abc123...',
  studentName: 'John Doe',
  optionIndex: 0
});
```

#### End Poll
```javascript
socket.emit('poll:end', pollId);
```

#### Request Poll State (for recovery)
```javascript
socket.emit('poll:request-state', studentName);
```

#### Get Poll History
```javascript
socket.emit('poll:history');
```

#### Send Chat Message
```javascript
socket.emit('chat:send', {
  senderName: 'John Doe',
  message: 'Hello!',
  isTeacher: false
});
```

#### Get Chat History
```javascript
socket.emit('chat:history');
```

### Server → Client

#### Poll Started
```javascript
socket.on('poll:started', (data) => {
  // data: { poll, remainingTime }
});
```

#### Poll Updated
```javascript
socket.on('poll:updated', (data) => {
  // data: { poll }
});
```

#### Poll Ended
```javascript
socket.on('poll:ended', (data) => {
  // data: { poll }
});
```

#### Poll State (recovery)
```javascript
socket.on('poll:state', (data) => {
  // data: { poll, remainingTime, hasVoted }
});
```

#### Vote Confirmed
```javascript
socket.on('vote:confirmed', (data) => {
  // data: { poll }
});
```

#### Poll History Data
```javascript
socket.on('poll:history:data', (data) => {
  // data: { polls }
});
```

#### Chat Message
```javascript
socket.on('chat:message', (message) => {
  // message: { senderName, message, isTeacher, timestamp }
});
```

#### Chat History Data
```javascript
socket.on('chat:history:data', (data) => {
  // data: { messages }
});
```

#### Student Joined (Teacher only)
```javascript
socket.on('student:joined', (data) => {
  // data: { studentName, totalStudents }
});
```

#### Student Left (Teacher only)
```javascript
socket.on('student:left', (data) => {
  // data: { studentName, totalStudents }
});
```

#### Error
```javascript
socket.on('error', (data) => {
  // data: { message }
});
```

## Database Models

### Poll
```javascript
{
  question: String,
  options: [{ text: String, votes: Number }],
  duration: Number,
  startTime: Date,
  endTime: Date,
  isActive: Boolean,
  totalVotes: Number,
  createdAt: Date
}
```

### Vote
```javascript
{
  pollId: ObjectId,
  studentName: String,
  optionIndex: Number,
  votedAt: Date
}
// Unique index on [pollId, studentName]
```

### ChatMessage
```javascript
{
  senderName: String,
  message: String,
  isTeacher: Boolean,
  timestamp: Date
}
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/polling-system
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Running the Backend

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## MongoDB Commands

### View All Polls
```bash
mongosh
use polling-system
db.polls.find().pretty()
```

### View Active Poll
```bash
db.polls.find({ isActive: true })
```

### View Poll History
```bash
db.polls.find({ isActive: false, endTime: { $ne: null } }).sort({ createdAt: -1 })
```

### View Votes
```bash
db.votes.find()
```

### Clear Database (for testing)
```bash
db.polls.deleteMany({})
db.votes.deleteMany({})
db.chatmessages.deleteMany({})
```

## Architecture Highlights

### Service Layer (PollService.js)
- All business logic centralized
- Database operations isolated
- Reusable across controllers and socket handlers
- Error handling built-in

### Socket Handler (PollSocketHandler.js)
- Delegates to service layer
- No business logic
- Event management only
- Broadcasts updates to clients

### Race Condition Prevention
- Unique index on `[pollId, studentName]` in Vote model
- Database-level constraint prevents duplicate votes
- Even if client sends multiple requests, only first succeeds

### Timer Synchronization
- Server is source of truth for time
- `getRemainingTime()` method calculates on-the-fly
- Late joiners get accurate remaining time
- Client timers sync with server state
