require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/database');
const PollSocketHandler = require('./socket/PollSocketHandler');
const ChatSocketHandler = require('./socket/ChatSocketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
}));
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/polls', require('./routes/pollRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io handlers
const pollHandler = new PollSocketHandler(io);
const chatHandler = new ChatSocketHandler(io);

io.on('connection', (socket) => {
  pollHandler.handleConnection(socket);
  chatHandler.handleConnection(socket);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
