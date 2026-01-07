import React, { useEffect } from 'react';
import { usePoll } from '../../context/PollContext';
import './PollHistory.css';

const PollHistory = () => {
  const { pollHistory, fetchPollHistory } = usePoll();

  useEffect(() => {
    fetchPollHistory();
  }, [fetchPollHistory]);

  if (!pollHistory || pollHistory.length === 0) {
    return (
      <div className="poll-history">
        <h2>Poll History</h2>
        <div className="no-history">
          <p>No polls have been conducted yet</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getPercentage = (votes, total) => {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  return (
    <div className="poll-history">
      <h2>Poll History</h2>
      
      <div className="history-list">
        {pollHistory.map((poll) => (
          <div key={poll._id} className="history-item">
            <div className="history-header">
              <h3>{poll.question}</h3>
              <div className="history-meta">
                <span className="date">{formatDate(poll.createdAt)}</span>
                <span className="total">Total Votes: {poll.totalVotes}</span>
              </div>
            </div>

            <div className="history-results">
              {poll.options.map((option, index) => (
                <div key={index} className="history-option">
                  <div className="option-info">
                    <span className="option-text">{option.text}</span>
                    <span className="option-percentage">
                      {getPercentage(option.votes, poll.totalVotes)}%
                    </span>
                  </div>
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small"
                      style={{ 
                        width: `${getPercentage(option.votes, poll.totalVotes)}%` 
                      }}
                    />
                  </div>
                  <span className="vote-count">{option.votes} votes</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PollHistory;
