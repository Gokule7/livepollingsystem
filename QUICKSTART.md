# Quick Start Guide

## For Developers (Local Development)

### 1. Prerequisites
```bash
# Check Node.js version (needs v14+)
node --version

# Check npm version
npm --version

# MongoDB must be installed and running
# Download from: https://www.mongodb.com/try/download/community
```

### 2. Install MongoDB

#### Windows
```powershell
# Download and install MongoDB Community Edition
# Start MongoDB service
net start MongoDB

# Verify MongoDB is running
mongosh
# Type: exit
```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Verify
mongosh
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Edit .env file and configure:
# - MONGODB_URI (default: mongodb://localhost:27017/polling-system)
# - PORT (default: 5000)

# Start backend server
npm run dev

# You should see:
# "Server running on port 5000"
# "MongoDB Connected: localhost"
```

### 4. Setup Frontend

```bash
# Open new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env    # Windows
cp .env.example .env      # macOS/Linux

# Edit .env file (usually defaults are fine)

# Start frontend
npm start

# Browser will open automatically at http://localhost:3000
```

### 5. Test the Application

1. **Open as Teacher:**
   - Click "Teacher" button
   - Create a poll with:
     - Question: "What's your favorite color?"
     - Options: Red, Blue, Green, Yellow
     - Duration: 60 seconds
   - Click "Start Poll"

2. **Open as Student:**
   - Open new browser tab/window
   - Go to `http://localhost:3000`
   - Click "Student" button
   - Enter your name (e.g., "John")
   - Vote for an option
   - See results

3. **Test Resilience:**
   - Refresh teacher page during poll → Should resume
   - Join as new student 20s into poll → Timer shows 40s
   - Try voting twice → Should show error
   - View poll history → Should show in database

---

## For Testers (Production)

### Access the Application

1. **Get URLs from developer:**
   - Frontend URL: `https://your-app.vercel.app`
   - Backend URL: `https://your-api.onrender.com`

2. **Test as Teacher:**
   - Open frontend URL
   - Click "Teacher"
   - Create and manage polls
   - View live results
   - Check poll history

3. **Test as Student:**
   - Open frontend URL in different browser/tab
   - Click "Student"
   - Enter name
   - Participate in polls

### Test Scenarios

#### Scenario 1: Basic Flow
1. Teacher creates poll (60 seconds)
2. 3 students join and vote
3. All see live results
4. After 60s, poll ends automatically
5. Results are saved

#### Scenario 2: State Recovery
1. Teacher starts poll
2. Teacher refreshes browser
3. Poll continues with correct time
4. Student joins late
5. Student sees correct remaining time

#### Scenario 3: Race Conditions
1. Student votes for option A
2. Student tries to vote again
3. System shows error message
4. Database has only 1 vote

#### Scenario 4: Chat Feature
1. Open chat popup (bottom-right)
2. Send message as teacher
3. Students see message
4. Students reply
5. All messages saved

---

## MongoDB Access Guide

### For Developers

#### View Data Using MongoDB Compass (GUI)

1. **Install MongoDB Compass:**
   - Download from [mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)

2. **Connect:**
   - Open Compass
   - Connection string: `mongodb://localhost:27017`
   - Click "Connect"

3. **View Collections:**
   - Database: `polling-system`
   - Collections:
     - `polls` - All polls with results
     - `votes` - Individual votes
     - `chatmessages` - Chat history

#### View Data Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to database
use polling-system

# View all polls
db.polls.find().pretty()

# View active poll
db.polls.find({ isActive: true })

# View poll history (past polls)
db.polls.find({ 
  isActive: false, 
  endTime: { $ne: null } 
}).sort({ createdAt: -1 })

# Count total polls
db.polls.countDocuments()

# View all votes
db.votes.find().pretty()

# Count votes for specific poll (replace with actual pollId)
db.votes.find({ pollId: ObjectId("YOUR_POLL_ID") }).count()

# View chat messages
db.chatmessages.find().sort({ timestamp: -1 }).limit(20)

# Clear all data (for testing)
db.polls.deleteMany({})
db.votes.deleteMany({})
db.chatmessages.deleteMany({})
```

### For Production (MongoDB Atlas)

1. **Access Atlas Dashboard:**
   - Go to [cloud.mongodb.com](https://cloud.mongodb.com)
   - Log in

2. **View Data:**
   - Click "Collections" on your cluster
   - Select `polling-system` database
   - Browse collections

3. **Run Queries:**
   - Use "Filter" box to search
   - Example: `{ isActive: true }` to find active poll

---

## Common Issues & Solutions

### Issue: "Cannot connect to MongoDB"
**Solution:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Verify
mongosh
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
# Choose different port when prompted
# Or kill process using port 3000
```

### Issue: "Module not found"
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: "WebSocket connection failed"
**Solution:**
- Check backend is running
- Verify REACT_APP_SOCKET_URL in frontend/.env
- Check firewall/antivirus blocking connections

---

## Quick Commands Reference

### Backend
```bash
cd backend
npm install           # Install dependencies
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm start            # Start development server
npm run build        # Build for production
```

### MongoDB
```bash
mongosh                              # Connect to MongoDB
use polling-system                   # Switch to database
db.polls.find().pretty()            # View polls
db.votes.find().pretty()            # View votes
db.polls.deleteMany({})             # Clear polls (testing)
```

---

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend opens in browser
- [ ] MongoDB connection successful
- [ ] Can select Teacher role
- [ ] Can create a poll
- [ ] Can select Student role
- [ ] Can enter student name
- [ ] Can vote on poll
- [ ] Live results update in real-time
- [ ] Timer counts down correctly
- [ ] Poll ends automatically
- [ ] Can view poll history
- [ ] Chat popup works
- [ ] Can send/receive messages
- [ ] Page refresh recovers state
- [ ] Late joiner sees correct timer
- [ ] Duplicate vote prevented
- [ ] Data visible in MongoDB

---

## Need Help?

### Documentation
- Main README: `README.md`
- Backend API: `backend/README.md`
- Frontend Guide: `frontend/README.md`
- Deployment: `DEPLOYMENT.md`

### Check Logs
```bash
# Backend logs
# Will show in terminal where you ran npm run dev

# Frontend logs
# Check browser console (F12)

# MongoDB logs
# macOS/Linux: /var/log/mongodb/mongod.log
# Windows: C:\Program Files\MongoDB\Server\{version}\log\
```

### Test Endpoints
```bash
# Backend health check
curl http://localhost:5000/health

# Get active poll
curl http://localhost:5000/api/polls/active

# Get poll history
curl http://localhost:5000/api/polls/history
```

---

## Success Criteria

Your setup is successful when:
1. Backend shows "MongoDB Connected"
2. Frontend opens without errors
3. Teacher can create polls
4. Students can vote
5. Results update in real-time
6. Data appears in MongoDB
7. Page refresh maintains state
8. Chat works between users

Happy Testing! 🚀
