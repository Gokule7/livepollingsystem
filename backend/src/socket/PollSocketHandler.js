const PollService = require('../services/PollService');

// Store connected clients
const connectedStudents = new Map();
const teacherSockets = new Set();

class PollSocketHandler {
  constructor(io) {
    this.io = io;
  }

  handleConnection(socket) {
    console.log(`Client connected: ${socket.id}`);

    // Register as teacher
    socket.on('register:teacher', async () => {
      teacherSockets.add(socket.id);
      console.log(`Teacher registered: ${socket.id}`);

      // Send current poll state
      try {
        const pollState = await PollService.getCurrentPollState();
        socket.emit('poll:state', pollState);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Register as student
    socket.on('register:student', async (studentName) => {
      connectedStudents.set(socket.id, studentName);
      console.log(`Student registered: ${studentName}`);

      // Notify teacher about new student
      this.broadcastToTeachers('student:joined', {
        studentName,
        totalStudents: connectedStudents.size,
      });

      // Send current poll state
      try {
        const pollState = await PollService.getCurrentPollState();
        
        if (pollState && pollState.poll) {
          const hasVoted = await PollService.hasStudentVoted(
            pollState.poll._id,
            studentName
          );
          
          socket.emit('poll:state', {
            ...pollState,
            hasVoted,
          });
        } else {
          socket.emit('poll:state', null);
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Create and start poll
    socket.on('poll:create', async (data) => {
      try {
        const { question, options, duration } = data;
        const poll = await PollService.createPoll(question, options, duration);
        
        // Start the poll immediately
        const activePoll = await PollService.startPoll(poll._id);
        
        // Broadcast to all clients
        this.io.emit('poll:started', {
          poll: activePoll,
          remainingTime: activePoll.duration,
        });

        // Auto-end poll after duration
        setTimeout(async () => {
          await this.endPoll(activePoll._id);
        }, activePoll.duration * 1000);

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Submit vote
    socket.on('poll:vote', async (data) => {
      try {
        const { pollId, studentName, optionIndex } = data;
        
        const poll = await PollService.submitVote(pollId, studentName, optionIndex);
        
        // Confirm to student
        socket.emit('vote:confirmed', { poll });

        // Broadcast updated results to everyone
        this.io.emit('poll:updated', { poll });

      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // End poll manually
    socket.on('poll:end', async (pollId) => {
      try {
        await this.endPoll(pollId);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Get poll history
    socket.on('poll:history', async () => {
      try {
        const polls = await PollService.getPollHistory();
        socket.emit('poll:history:data', { polls });
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Request current state (for recovery)
    socket.on('poll:request-state', async (studentName) => {
      try {
        const pollState = await PollService.getCurrentPollState();
        
        if (pollState && pollState.poll && studentName) {
          const hasVoted = await PollService.hasStudentVoted(
            pollState.poll._id,
            studentName
          );
          
          socket.emit('poll:state', {
            ...pollState,
            hasVoted,
          });
        } else {
          socket.emit('poll:state', pollState);
        }
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      const studentName = connectedStudents.get(socket.id);
      if (studentName) {
        connectedStudents.delete(socket.id);
        this.broadcastToTeachers('student:left', {
          studentName,
          totalStudents: connectedStudents.size,
        });
      }

      teacherSockets.delete(socket.id);
    });
  }

  async endPoll(pollId) {
    try {
      const poll = await PollService.endPoll(pollId);
      
      if (poll) {
        // Broadcast results to all clients
        this.io.emit('poll:ended', { poll });
      }
    } catch (error) {
      console.error('Error ending poll:', error);
    }
  }

  broadcastToTeachers(event, data) {
    teacherSockets.forEach(socketId => {
      this.io.to(socketId).emit(event, data);
    });
  }

  getConnectedStudents() {
    return Array.from(connectedStudents.values());
  }
}

module.exports = PollSocketHandler;
