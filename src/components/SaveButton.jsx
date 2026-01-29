import { useState, useEffect } from 'react';
import './SaveButton.css';


const SaveButton = ({ postId, initialSaved = false, onSaveChange }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSaved(initialSaved);
  }, [initialSaved]);

  const handleToggleSave = async (e) => {
    e.stopPropagation(); 
    
    setIsLoading(true);
    try {
      if (isSaved) {
        
        
        setIsSaved(false);
        onSaveChange && onSaveChange(postId, false);
      } else {
      
        setIsSaved(true);
        onSaveChange && onSaveChange(postId, true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to save/unsave post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`save-button ${isSaved ? 'saved' : ''} ${isLoading ? 'loading' : ''}`}
      onClick={handleToggleSave}
      disabled={isLoading}
      title={isSaved ? 'Remove from saved' : 'Save post'}
    >
      {isLoading ? (
        <svg className="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      ) : (
        <>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isSaved ? 'currentColor' : 'none'}
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="save-text">{isSaved ? 'Saved' : 'Save'}</span>
        </>
      )}
    </button>
  );
};

export default SaveButton;
