import React, { useState } from 'react';
import { usePoll } from '../../context/PollContext';
import { usePollTimer } from '../../hooks/usePollTimer';
import './PollInterface.css';

const PollInterface = ({ studentName }) => {
  const { activePoll, remainingTime, hasVoted, submitVote } = usePoll();
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formattedTime } = usePollTimer(
    remainingTime,
    activePoll?.isActive && !hasVoted,
    () => {}
  );

  const handleSubmit = async () => {
    if (selectedOption === null || isSubmitting || hasVoted) return;

    setIsSubmitting(true);
    try {
      submitVote(activePoll._id, studentName, selectedOption);
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!activePoll) {
    return (
      <div className="poll-interface">
        <div className="waiting-message">
          <div className="waiting-icon">⏳</div>
          <h2>Waiting for teacher to start a poll...</h2>
        </div>
      </div>
    );
  }

  const showResults = hasVoted || !activePoll.isActive;
  const totalVotes = activePoll.totalVotes || 0;

  const getPercentage = (votes) => {
    if (totalVotes === 0) return 0;
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="poll-interface">
      <div className="poll-card">
        <div className="poll-header">
          <h2>{activePoll.question}</h2>
          
          {activePoll.isActive && !hasVoted && (
            <div className="timer-display">
              <span className="timer-icon">⏱</span>
              <span className="timer-text">{formattedTime}</span>
            </div>
          )}
          
          {!activePoll.isActive && (
            <div className="status-badge ended">Poll Ended</div>
          )}
          
          {hasVoted && activePoll.isActive && (
            <div className="status-badge voted">Vote Submitted</div>
          )}
        </div>

        {!showResults ? (
          <div className="voting-section">
            <div className="options-list">
              {activePoll.options.map((option, index) => (
                <div
                  key={index}
                  className={`option-item ${selectedOption === index ? 'selected' : ''}`}
                  onClick={() => setSelectedOption(index)}
                >
                  <div className="option-radio">
                    {selectedOption === index && <div className="radio-dot" />}
                  </div>
                  <span className="option-text">{option.text}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || isSubmitting}
              className="submit-vote-btn"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Vote'}
            </button>
          </div>
        ) : (
          <div className="results-section">
            <div className="results-header">
              <h3>Results</h3>
              <span className="total-votes">Total Votes: {totalVotes}</span>
            </div>

            <div className="results-list">
              {activePoll.options.map((option, index) => {
                const percentage = getPercentage(option.votes);
                
                return (
                  <div key={index} className="result-item">
                    <div className="result-header">
                      <span className="result-text">{option.text}</span>
                      <span className="result-stats">
                        {option.votes} ({percentage}%)
                      </span>
                    </div>
                    <div className="result-bar">
                      <div
                        className="result-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PollInterface;
