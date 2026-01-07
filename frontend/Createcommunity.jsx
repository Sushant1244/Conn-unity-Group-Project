import React, { useState } from 'react';

const Createcommunity = ({ onClose }) => {
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [filterText, setFilterText] = useState('');

  const topics = {
    '🎭Anime & Cosplay': ['Anime & Manga'],
    '🎨Art': ['Performing Arts', 'Architecture', 'Design', 'Art', 'Filmmaking', 'Photography'],
    '📊Business & Finance': ['Personal Finance', 'crypto', 'Economics', 'Business News & Discussion', 'Deals & MarketPlace', 'Real Estate', 'Startups & Entrepreneurship'],
    '🔧Collectibles & Other Hobbies': ['Model Building', 'Collectibles', 'Other Hobbies', 'Toys'],
    '🎓Education & Career': ['Studying & Education', 'Career'],
    '👗Fashion & Beauty': ['Nails', 'Hair', 'Makeup', 'Fashion', 'accessories & Jewelry', 'Weddings', 'Tattoos & Piercings', 'Beauty & Grooming', 'Skincare', 'Watches'],
    '🍔Food & Drinks': ['Food & Recipes', 'Food industry & Restaurants', 'Non-Alocoholic Beverages', 'Baking & Desserts', 'Vegetarian & Vegan Food'],
    '🎮Games': ['Other Games', 'Gaming Console & Gear', 'Esports', 'Adventure Games', 'Action Games', 'Role-Playing Games', 'Strategy Games', 'Mobile Games', 'Sports & racing Games', 'Tabletop Games'],
    '❤️Health': ['Addiction Support', 'Pregnancy', 'Medical Health', 'Trauma Support', 'Mental Health'],
    '📚Humanities & Law': ['Ethics & Philosophy', 'Law', 'History', 'Languages'],
    '📰News & Politics': ['News', 'Politics', 'Activism'],
    '📖Reading & Writing': ['Comics', 'Books & Literature', 'Writing'],
    '🔬Sciences': ['Biological Sciences', 'Engineering', 'physics', 'Mathematics', 'Chemistry', 'Climate & environment', 'Space & Astronomy', 'Geography', 'Data Sciences'],
    '💻Technology': ['Consumer Electronics', 'Computer & Hardware', 'Tech News & Discussion', 'Programming', 'Streaming Services', 'Software & Apps', '3D Printing', 'Virtual & Augmented Reality', 'Artificial Intelligence & Machine Learning'],
    '🌟Wellness': ['Motivation & Self-Improvement', 'Fitness', 'Diet & Nutrition', 'Weight Loss']
  };

  const handleTopicClick = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter(t => t !== topic));
    } else if (selectedTopics.length < 2) {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleNext = () => {
    if (selectedTopics.length > 0) {
      console.log('Selected topics:', selectedTopics);
      // Handle navigation to next step
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#f5f5f5',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '700px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e0e0e0',
          position: 'relative'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '500',
            color: '#333',
            paddingRight: '40px'
          }}>
            Add up to 2 topics to help interested conn-unity find your community.
          </h2>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#e0e0e0'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>

        {/* Search Bar */}
        <div style={{
          padding: '24px',
          paddingBottom: '16px'
        }}>
          <div style={{
            position: 'relative',
            width: '100%'
          }}>
            <span style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '18px',
              color: '#666'
            }}>
              🔍
            </span>
            <input
              type="text"
              placeholder="Filter topics"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 48px',
                border: 'none',
                borderRadius: '24px',
                backgroundColor: '#d8dde4',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Topics Container */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 24px 24px 24px'
        }}>
          {Object.entries(topics).map(([category, items]) => (
            <div key={category} style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '15px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                {category}
              </h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {items.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => handleTopicClick(topic)}
                    disabled={!selectedTopics.includes(topic) && selectedTopics.length >= 2}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: 'none',
                      backgroundColor: selectedTopics.includes(topic) ? '#0079d3' : '#d8dde4',
                      color: selectedTopics.includes(topic) ? '#ffffff' : '#1c1c1c',
                      fontSize: '14px',
                      cursor: (!selectedTopics.includes(topic) && selectedTopics.length >= 2) ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      fontWeight: '500',
                      opacity: (!selectedTopics.includes(topic) && selectedTopics.length >= 2) ? 0.5 : 1
                    }}
                    onMouseOver={(e) => {
                      if (selectedTopics.includes(topic) || selectedTopics.length < 2) {
                        e.target.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            display: 'flex',
            gap: '4px'
          }}>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: i === 0 ? '#666' : '#d0d0d0'
                }}
              />
            ))}
          </div>
          <div style={{
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: '1px solid #0079d3',
                backgroundColor: 'transparent',
                color: '#0079d3',
                fontSize: '14px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f0f7ff';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleNext}
              disabled={selectedTopics.length === 0}
              style={{
                padding: '10px 24px',
                borderRadius: '24px',
                border: 'none',
                backgroundColor: selectedTopics.length > 0 ? '#0079d3' : '#d0d0d0',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '700',
                cursor: selectedTopics.length > 0 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (selectedTopics.length > 0) {
                  e.target.style.backgroundColor = '#0066b8';
                }
              }}
              onMouseOut={(e) => {
                if (selectedTopics.length > 0) {
                  e.target.style.backgroundColor = '#0079d3';
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Createcommunity;
