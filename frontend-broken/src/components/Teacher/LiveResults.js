import React, { useEffect } from 'react';
import { usePoll } from '../../context/PollContext';
import { usePollTimer } from '../../hooks/usePollTimer';
import './LiveResults.css';

const LiveResults = () => {
  const { activePoll, remainingTime, setRemainingTime } = usePoll();
  const { formattedTime } = usePollTimer(remainingTime, activePoll?.isActive, () => {});

  useEffect(() => {
    if (activePoll && activePoll.isActive && remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activePoll, remainingTime, setRemainingTime]);

  if (!activePoll) {
    return (
      <div className="live-results">
        <div className="no-poll">
          <h3>No Active Poll</h3>
          <p>Create a poll to see live results</p>
        </div>
      </div>
    );
  }

  const totalVotes = activePoll.totalVotes || 0;

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="live-results">
      <div className="poll-header">
        <h2>{activePoll.question}</h2>
        {activePoll.isActive && (
          <div className="timer">
            <span className="timer-icon">⏱</span>
            <span className="timer-value">{formattedTime}</span>
          </div>
        )}
        {!activePoll.isActive && (
          <div className="status-badge ended">Poll Ended</div>
        )}
      </div>

      <div className="results-container">
        <div className="total-votes">
          Total Votes: <strong>{totalVotes}</strong>
        </div>

        <div className="options-results">
          {activePoll.options.map((option, index) => {
            const percentage = getPercentage(option.votes);
            
            return (
              <div key={index} className="option-result">
                <div className="option-header">
                  <span className="option-text">{option.text}</span>
                  <span className="option-stats">
                    {option.votes} votes ({percentage}%)
                  </span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveResults;
