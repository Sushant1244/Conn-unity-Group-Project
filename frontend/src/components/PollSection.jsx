import React, { useState } from 'react';
import { FiList } from 'react-icons/fi';
import axios from 'axios';
import './PollSection.css';

function PollSection({ polls, user }) {
  const [selectedPolls, setSelectedPolls] = useState({});
  const [votedPolls, setVotedPolls] = useState({});

  const handleVote = async (pollId, optionIndex) => {
    if (!user) {
      alert('Please login to vote');
      return;
    }

    try {
      const res = await axios.post(`/api/polls/${pollId}/vote`, { optionIndex });
      setVotedPolls({ ...votedPolls, [pollId]: true });
      setSelectedPolls({ ...selectedPolls, [pollId]: optionIndex });
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error submitting vote');
    }
  };

  if (polls.length === 0) return null;

  const activePoll = polls[0]; // Show first poll
  const hasVoted = votedPolls[activePoll._id] || activePoll.userVoted;

  return (
    <div className="poll-section">
      <div className="poll-header">
        <FiList className="poll-icon" />
        <h3 className="section-title">Community Poll</h3>
      </div>
      <div className="poll-content">
        <h4 className="poll-question">{activePoll.question}</h4>
        <div className="poll-options">
          {activePoll.options.map((option, index) => {
            const totalVotes = activePoll.totalVotes || 1;
            const percentage = ((option.voteCount || 0) / totalVotes) * 100;
            const isSelected = selectedPolls[activePoll._id] === index;

            return (
              <div key={index} className="poll-option">
                {hasVoted ? (
                  <div className="poll-result">
                    <div className="poll-option-text">
                      <input
                        type="radio"
                        checked={isSelected}
                        readOnly
                      />
                      <span>{option.text}</span>
                    </div>
                    <div className="poll-bar-container">
                      <div
                        className="poll-bar"
                        style={{ width: `${percentage}%` }}
                      />
                      <span className="poll-percentage">{Math.round(percentage)}%</span>
                    </div>
                  </div>
                ) : (
                  <label className="poll-option-label">
                    <input
                      type="radio"
                      name={`poll-${activePoll._id}`}
                      checked={isSelected}
                      onChange={() => setSelectedPolls({ ...selectedPolls, [activePoll._id]: index })}
                    />
                    <span>{option.text}</span>
                  </label>
                )}
              </div>
            );
          })}
        </div>
        {!hasVoted && (
          <button
            className="submit-vote-button"
            onClick={() => {
              const selected = selectedPolls[activePoll._id];
              if (selected !== undefined) {
                handleVote(activePoll._id, selected);
              } else {
                alert('Please select an option');
              }
            }}
          >
            Submit vote
          </button>
        )}
      </div>
    </div>
  );
}

export default PollSection;

