# Resilient Live Polling System

A real-time polling system with state recovery, featuring separate interfaces for teachers and students. Built with React, Node.js, Socket.io, and MongoDB.

## 🔗 Live Demo

**Coming Soon!** Follow the deployment guide in [DEPLOYMENT_LIVE.md](./DEPLOYMENT_LIVE.md) to deploy your own instance.

<!-- After deployment, update these links:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com
-->


## 🌟 Features

### Core Features
- **Teacher Persona**
  - Create polls with customizable options and duration
  - View live polling results with real-time updates
  - Access poll history stored in MongoDB
  - Dashboard with create, results, and history tabs

- **Student Persona**
  - Name-based onboarding (unique per browser tab)
  - Real-time poll participation
  - Timer synchronization with server
  - View results after voting or when poll ends

### Resilience Features ✨
- **State Recovery**: Refresh the page during an active poll, and the system recovers the exact state
- **Timer Synchronization**: Late joiners see the correct remaining time (e.g., 30s remaining if they join 30s late)
- **Race Condition Prevention**: Database-level constraints prevent duplicate voting
- **Error Handling**: Graceful degradation when database is temporarily unavailable

### Bonus Features 🎁
- **Live Chat**: Real-time chat between teachers and students
- **Configurable Timer**: Teachers can set custom poll durations
- **Optimistic UI**: Instant feedback with error recovery
- **Professional UI**: Gradient-based design matching modern standards

## 🏗️ Architecture

### Backend (Clean Architecture)
```
backend/
├── src/
│   ├── models/          # MongoDB schemas (Poll, Vote, ChatMessage)
│   ├── services/        # Business logic (PollService, ChatService)
│   ├── controllers/     # Request handlers (PollController, ChatController)
│   ├── socket/          # Socket.io handlers (PollSocketHandler, ChatSocketHandler)
│   ├── routes/          # Express routes
│   ├── config/          # Database configuration
│   └── server.js        # Entry point
```

**Separation of Concerns:**
- Models: Data schemas only
- Services: All business logic and database operations
- Controllers: HTTP request/response handling
- Socket Handlers: WebSocket event handling
- No business logic in routes or socket listeners

### Frontend (Custom Hooks Pattern)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Teacher/     # Teacher-specific components
│   │   ├── Student/     # Student-specific components
│   │   └── Shared/      # Shared components (ChatPopup)
│   ├── context/         # Global state (PollContext, ChatContext)
│   ├── hooks/           # Custom hooks (useSocket, usePollTimer, useStudentName)
│   └── styles/          # Component CSS files
```

**Custom Hooks:**
- `useSocket`: WebSocket connection management
- `usePollTimer`: Timer synchronization and countdown logic
- `useStudentName`: Session-based student identification

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### MongoDB Setup

#### Option 1: Local MongoDB
1. Install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows (Run as Administrator)
   net start MongoDB

   # macOS/Linux
   sudo systemctl start mongod
   ```
3. MongoDB will run on `mongodb://localhost:27017`

#### Option 2: MongoDB Atlas (Cloud)
1. Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Whitelist your IP address in Atlas dashboard

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   # Copy example file
   cp .env.example .env
   ```

4. Configure `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/polling-system
   # For MongoDB Atlas, use:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/polling-system
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   ```

5. Start the backend server:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Configure `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```

5. Start the frontend:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 🚀 Usage

### Testing the Application

1. **Teacher Flow:**
   - Open `http://localhost:3000` in one browser
   - Select "Teacher" role
   - Create a poll with question, options, and duration
   - Click "Start Poll"
   - View live results as students vote

2. **Student Flow:**
   - Open `http://localhost:3000` in another browser/tab
   - Select "Student" role
   - Enter your name
   - Wait for teacher to start a poll
   - Submit your vote
   - View results

3. **Testing Resilience:**
   - **State Recovery**: Refresh the page during an active poll
   - **Timer Sync**: Join as a student 20 seconds into a 60-second poll (should show 40s remaining)
   - **Duplicate Vote Prevention**: Try voting twice (will show error)
   - **Chat Feature**: Click chat icon to send messages

### Viewing Poll History in MongoDB

#### Using MongoDB Compass (GUI)
1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect to `mongodb://localhost:27017`
3. Select database: `polling-system`
4. View collections:
   - `polls`: All polls with results
   - `votes`: Individual vote records
   - `chatmessages`: Chat history

#### Using MongoDB Shell
```bash
# Connect to MongoDB
mongosh

# Switch to database
use polling-system

# View all polls
db.polls.find().pretty()

# View poll history (ended polls only)
db.polls.find({ isActive: false }).sort({ createdAt: -1 })

# View votes for a specific poll
db.votes.find({ pollId: ObjectId("your-poll-id") })

# View chat messages
db.chatmessages.find().sort({ timestamp: -1 })
```

## 🛠️ Technology Stack

- **Frontend:**
  - React 18.2
  - Socket.io-client 4.6
  - React-Toastify (notifications)
  - Custom CSS (no frameworks)

- **Backend:**
  - Node.js with Express 4.18
  - Socket.io 4.6
  - Mongoose 8.0 (MongoDB ODM)
  - CORS, dotenv

- **Database:**
  - MongoDB 4.4+

## 📁 Project Structure

```
polling-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── models/
│   │   │   ├── Poll.js
│   │   │   ├── Vote.js
│   │   │   └── ChatMessage.js
│   │   ├── services/
│   │   │   ├── PollService.js
│   │   │   └── ChatService.js
│   │   ├── controllers/
│   │   │   ├── PollController.js
│   │   │   └── ChatController.js
│   │   ├── socket/
│   │   │   ├── PollSocketHandler.js
│   │   │   └── ChatSocketHandler.js
│   │   ├── routes/
│   │   │   ├── pollRoutes.js
│   │   │   └── chatRoutes.js
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Teacher/
    │   │   ├── Student/
    │   │   └── Shared/
    │   ├── context/
    │   ├── hooks/
    │   ├── App.js
    │   └── index.js
    ├── package.json
    └── .env
```

## 🚢 Deployment

### Backend Deployment (Render/Railway/Heroku)

1. Push code to GitHub
2. Connect to deployment platform
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: Provided by platform (or 5000)
   - `CORS_ORIGIN`: Your frontend URL
   - `NODE_ENV`: production

### Frontend Deployment (Vercel/Netlify)

1. Update `.env` for production:
   ```env
   REACT_APP_API_URL=https://your-backend.com
   REACT_APP_SOCKET_URL=https://your-backend.com
   ```
2. Build and deploy:
   ```bash
   npm run build
   ```

## 🔒 Security Features

- MongoDB unique indexes prevent duplicate votes
- Session-based student identification
- CORS protection
- Input validation on both client and server
- Error boundaries for graceful failures

## 🎯 Meeting Requirements

✅ **Functional Requirements:**
- Teacher can create polls and view live results
- Students can join, vote, and view results
- Real-time updates via Socket.io
- Database persistence with MongoDB

✅ **Resilience Factor:**
- State recovery on page refresh
- Timer synchronization for late joiners
- Race condition prevention

✅ **Code Quality:**
- Controller-Service pattern (backend)
- Custom hooks (frontend)
- Separation of concerns
- Error handling throughout

✅ **Bonus Features:**
- Chat system
- Configurable poll duration
- Poll history from database
- Modern UI design

## 📝 License

This project is created for the Intervue Assignment.

## 🤝 Support

For issues or questions, please check the code comments or reach out to the development team.
