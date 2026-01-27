import React, { useMemo, useState } from 'react';

const API_URL = 'http://localhost:4000/api'

const topicOptions = {
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

const StepDots = ({ step }) => {
  const steps = [1, 2, 3, 4];
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {steps.map((n) => (
        <div
          key={n}
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: n === step ? '#4d5e78' : '#cfd6df'
          }}
        />
      ))}
    </div>
  );
};

const Createcommunity = ({ onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [communityName, setCommunityName] = useState('');
  const [description, setDescription] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const filteredTopics = useMemo(() => {
    if (!filterText.trim()) return topicOptions;
    const q = filterText.toLowerCase();
    const next = {};
    Object.entries(topicOptions).forEach(([category, items]) => {
      const matches = items.filter((item) => item.toLowerCase().includes(q) || category.toLowerCase().includes(q));
      if (matches.length) next[category] = matches;
    });
    return next;
  }, [filterText]);

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      return;
    }
    if (selectedTopics.length >= 2) return;
    setSelectedTopics([...selectedTopics, topic]);
  };

  const handleNext = () => {
    if (selectedTopics.length === 0) return;
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleCreate = async () => {
    const name = communityName.trim();
    if (!name) return;
    const displayName = name; // simple mapping

    if (onCreate) {
      onCreate({ name, displayName, description: description.trim(), topics: selectedTopics, imageDataUrl });
      return;
    }

    try {
      const token = localStorage.getItem('connunity_token');
      const fd = new FormData();
      fd.append('name', name);
      fd.append('displayName', displayName);
      fd.append('description', description.trim());
      fd.append('topics', JSON.stringify(selectedTopics));
      if (imageFile) fd.append('image', imageFile);
      const resp = await fetch(`${API_URL}/communities`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd
      });
      const data = await resp.json();
      if (data?.success) {
        onClose && onClose();
      } else {
        alert(data?.message || 'Failed to create community');
      }
    } catch (e) {
      console.error('Create community failed', e);
      alert('Failed to create community');
    }
  };

  const pillBase = {
    padding: '9px 16px',
    borderRadius: 18,
    border: 'none',
    background: '#d8e3f0',
    color: '#1c2a3b',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const buttonBase = {
    borderRadius: 22,
    padding: '12px 26px',
    fontWeight: 700,
    fontSize: 14,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const renderStepOne = () => (
    <>
      <div style={{ padding: '22px 26px 12px 26px', position: 'relative' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#1c1c1c', lineHeight: 1.5, maxWidth: 760 }}>
          Add up to 2 topics to help interested conn-unity find your community.
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #d1d7e0',
            background: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            color: '#344156',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ padding: '0 26px 18px 26px' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Filter topics"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 54px',
              borderRadius: 26,
              border: '1px solid #d6dce6',
              background: '#d9e3f3',
              fontSize: 15,
              fontWeight: 500,
              color: '#1f2b3b',
              outline: 'none',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)'
            }}
          />
          <span style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: '#5b6b83' }}>
            🔍
          </span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 26px 10px 26px' }}>
        {Object.entries(filteredTopics).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 18 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1f2b3b', marginBottom: 10 }}>{category}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {items.map((topic) => {
                const selected = selectedTopics.includes(topic);
                const disabled = !selected && selectedTopics.length >= 2;
                return (
                  <button
                    key={topic}
                    onClick={() => toggleTopic(topic)}
                    disabled={disabled}
                    style={{
                      ...pillBase,
                      background: selected ? '#b9cbe3' : pillBase.background,
                      color: selected ? '#0f1724' : pillBase.color,
                      opacity: disabled ? 0.55 : 1,
                      boxShadow: selected ? '0 2px 6px rgba(59,77,102,0.18)' : 'none'
                    }}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '16px 24px 18px 24px', borderTop: '1px solid #e0e7f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6f8fb' }}>
        <StepDots step={1} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              ...buttonBase,
              background: '#e6edf7',
              color: '#1c2a3b',
              border: '1px solid #cfd6df'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleNext}
            disabled={selectedTopics.length === 0}
            style={{
              ...buttonBase,
              background: selectedTopics.length > 0 ? '#0f6efb' : '#d0d7e2',
              color: '#fff',
              boxShadow: selectedTopics.length > 0 ? '0 4px 12px rgba(15,110,251,0.28)' : 'none',
              cursor: selectedTopics.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
      <div style={{ padding: '22px 26px 12px 26px', position: 'relative' }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: '#1c1c1c', lineHeight: 1.45 }}>
          A name and description help people understand what your community is all about.
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid #d1d7e0',
            background: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            color: '#344156',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1, padding: '6px 26px 0 26px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ width: '100%' }}>
            <input
              type="text"
              placeholder="Community name ..."
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #d1d7e0',
                borderRadius: 22,
                background: '#d9e3f3',
                padding: '16px 18px',
                fontSize: 20,
                fontWeight: 600,
                color: '#1b2736',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ width: '100%', flex: 1 }}>
            <textarea
              placeholder="Description ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={7}
              style={{
                width: '100%',
                border: '1px solid #d1d7e0',
                borderRadius: 18,
                background: '#d9e3f3',
                padding: '16px 18px',
                fontSize: 18,
                fontWeight: 500,
                color: '#1b2736',
                outline: 'none',
                resize: 'vertical',
                minHeight: 180
              }}
            />
          </div>
        </div>

        <div style={{ width: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <div style={{ width: '100%', background: '#fff', borderRadius: 16, padding: '18px 18px 16px 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', border: '1px solid #e7ecf3' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#121826', marginBottom: 6 }}>
              r/{communityName || 'communityname'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#4f5565', marginBottom: 8 }}>
              1 weekly visitor·1 weekly contributor
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1f2c' }}>
              {description || 'Your community description'}
            </div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, background: '#b28cff', transform: 'rotate(45deg)', borderRadius: 2 }} />
            </div>
          </div>

          <label htmlFor="community-photo-input" style={{ cursor: 'pointer' }}>
            <div
              title="Add profile photo"
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: imageDataUrl ? `url(${imageDataUrl}) center/cover no-repeat` : '#d9e3f3',
                border: '10px solid #1d2734',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}
            >
              {!imageDataUrl && (
                <div style={{ width: 120, height: 120, borderRadius: '50%', border: '10px solid #1d2734' }} />
              )}
            </div>
          </label>
          <input
            id="community-photo-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              if (!file) return
              setImageFile(file)
              const reader = new FileReader()
              reader.onload = () => setImageDataUrl(reader.result)
              reader.readAsDataURL(file)
            }}
          />
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1c1c1c' }}>Profile Photo</div>
        </div>
      </div>

      <div style={{ padding: '16px 24px 18px 24px', borderTop: '1px solid #e0e7f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6f8fb' }}>
        <StepDots step={2} />
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={handleBack}
            style={{
              ...buttonBase,
              background: '#e6edf7',
              color: '#1c2a3b',
              border: '1px solid #cfd6df'
            }}
          >
            Back
          </button>
          <button
            onClick={handleCreate}
            style={{
              ...buttonBase,
              background: '#0f6efb',
              color: '#fff',
              boxShadow: '0 4px 12px rgba(15,110,251,0.28)'
            }}
          >
            Create Community
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: 14
      }}
    >
      <div
        style={{
          width: '94vw',
          maxWidth: 960,
          maxHeight: '92vh',
          background: '#f2f6fb',
          borderRadius: 18,
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
          border: '1px solid #d7deea',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {step === 1 ? renderStepOne() : renderStepTwo()}
      </div>
    </div>
  );
};

export default Createcommunity;
