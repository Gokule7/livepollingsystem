import React, { useState } from 'react';
import { usePoll } from '../../context/PollContext';
import './CreatePoll.css';

const CreatePoll = () => {
  const { createPoll, activePoll } = usePoll();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(60);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    createPoll(question, validOptions, duration);
    
    // Reset form
    setQuestion('');
    setOptions(['', '']);
    setDuration(60);
  };

  const canCreatePoll = !activePoll || !activePoll.isActive;

  return (
    <div className="create-poll">
      <h2>Create New Poll</h2>
      
      {!canCreatePoll && (
        <div className="warning-message">
          A poll is currently active. Wait for it to end before creating a new one.
        </div>
      )}

      <form onSubmit={handleSubmit} className="poll-form">
        <div className="form-group">
          <label>Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question..."
            disabled={!canCreatePoll}
            className="question-input"
          />
        </div>

        <div className="form-group">
          <label>Options</label>
          {options.map((option, index) => (
            <div key={index} className="option-input-group">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                disabled={!canCreatePoll}
                className="option-input"
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  disabled={!canCreatePoll}
                  className="remove-btn"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          
          {options.length < 6 && (
            <button
              type="button"
              onClick={handleAddOption}
              disabled={!canCreatePoll}
              className="add-option-btn"
            >
              + Add Option
            </button>
          )}
        </div>

        <div className="form-group">
          <label>Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Math.max(10, parseInt(e.target.value) || 60))}
            min="10"
            max="300"
            disabled={!canCreatePoll}
            className="duration-input"
          />
        </div>

        <button 
          type="submit" 
          disabled={!canCreatePoll}
          className="submit-btn"
        >
          Start Poll
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;
