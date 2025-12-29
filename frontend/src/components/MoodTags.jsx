import React, { useState } from 'react';
import { FiZap, FiHeart, FiSun } from 'react-icons/fi';
import { FaGraduationCap, FaLightbulb } from 'react-icons/fa';
import { BsEmojiLaughing } from 'react-icons/bs';
import './MoodTags.css';

const moods = [
  { name: 'Inspiring', icon: FiZap, color: '#FFE5B4' },
  { name: 'Funny', icon: BsEmojiLaughing, color: '#FFE5E5' },
  { name: 'Educational', icon: FaGraduationCap, color: '#E5F3FF' },
  { name: 'Wholesome', icon: FiHeart, color: '#FFE5F3' },
  { name: 'Creative', icon: FaLightbulb, color: '#FFF5E5' },
  { name: 'Chill', icon: FiSun, color: '#E5FFE5' }
];

function MoodTags({ onSelectMood }) {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleClick = (mood) => {
    if (selectedMood === mood) {
      setSelectedMood(null);
      onSelectMood?.(null);
    } else {
      setSelectedMood(mood);
      onSelectMood?.(mood);
    }
  };

  return (
    <div className="mood-tags-section">
      <h3 className="section-title">What's your mood?</h3>
      <div className="mood-tags">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.name;
          return (
            <button
              key={mood.name}
              className={`mood-tag ${isSelected ? 'selected' : ''}`}
              style={{ backgroundColor: isSelected ? mood.color : '#f5f5f5' }}
              onClick={() => handleClick(mood.name)}
            >
              <Icon className="mood-icon" />
              <span>{mood.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MoodTags;

