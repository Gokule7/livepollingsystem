import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { toast } from 'react-toastify';

const PollContext = createContext();

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within PollProvider');
  }
  return context;
};

export const PollProvider = ({ children }) => {
  const { socket, isConnected, emit, on, off } = useSocket();
  const [activePoll, setActivePoll] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [hasVoted, setHasVoted] = useState(false);
  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    if (!socket) return;

    // Listen for poll started
    const handlePollStarted = (data) => {
      console.log('Poll started:', data);
      setActivePoll(data.poll);
      setRemainingTime(data.remainingTime);
      setHasVoted(false);
      toast.info('New poll started!');
    };

    // Listen for poll updates
    const handlePollUpdated = (data) => {
      setActivePoll(data.poll);
    };

    // Listen for poll ended
    const handlePollEnded = (data) => {
      setActivePoll(data.poll);
      setRemainingTime(0);
      toast.success('Poll ended!');
    };

    // Listen for poll state (recovery)
    const handlePollState = (data) => {
      if (data && data.poll) {
        setActivePoll(data.poll);
        setRemainingTime(data.remainingTime || 0);
        setHasVoted(data.hasVoted || false);
      } else {
        setActivePoll(null);
        setRemainingTime(0);
        setHasVoted(false);
      }
    };

    // Listen for vote confirmation
    const handleVoteConfirmed = (data) => {
      setHasVoted(true);
      setActivePoll(data.poll);
      toast.success('Vote submitted successfully!');
    };

    // Listen for poll history
    const handlePollHistory = (data) => {
      setPollHistory(data.polls);
    };

    on('poll:started', handlePollStarted);
    on('poll:updated', handlePollUpdated);
    on('poll:ended', handlePollEnded);
    on('poll:state', handlePollState);
    on('vote:confirmed', handleVoteConfirmed);
    on('poll:history:data', handlePollHistory);

    return () => {
      off('poll:started', handlePollStarted);
      off('poll:updated', handlePollUpdated);
      off('poll:ended', handlePollEnded);
      off('poll:state', handlePollState);
      off('vote:confirmed', handleVoteConfirmed);
      off('poll:history:data', handlePollHistory);
    };
  }, [socket, on, off]);

  const createPoll = (question, options, duration) => {
    emit('poll:create', { question, options, duration });
  };

  const submitVote = (pollId, studentName, optionIndex) => {
    emit('poll:vote', { pollId, studentName, optionIndex });
  };

  const endPoll = (pollId) => {
    emit('poll:end', pollId);
  };

  const requestPollState = (studentName) => {
    emit('poll:request-state', studentName);
  };

  const fetchPollHistory = () => {
    emit('poll:history');
  };

  return (
    <PollContext.Provider
      value={{
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
        setRemainingTime,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};
