import React, { useState } from 'react';
import { FiSearch, FiMessageCircle, FiBell, FiPlus } from 'react-icons/fi';
import LoginModal from './LoginModal';
import './Header.css';

function Header({ user, onLogin, onLogout }) {
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="#8B5CF6"/>
                <circle cx="10" cy="12" r="3" fill="white"/>
                <circle cx="22" cy="12" r="3" fill="white"/>
                <path d="M8 22 Q16 18 24 22" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </div>
            <span className="logo-text">Conn-unity</span>
          </div>
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Conn-unity"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          {user ? (
            <>
              <button className="icon-button">
                <FiMessageCircle />
              </button>
              <button className="icon-button">
                <FiBell />
              </button>
              <button className="icon-button">
                <FiPlus />
              </button>
              <div className="user-menu">
                <div className="user-avatar">
                  {user.avatar || user.username.charAt(0).toUpperCase()}
                </div>
                <div className="user-info">
                  <span className="username">{user.username}</span>
                  <button onClick={onLogout} className="logout-btn">Logout</button>
                </div>
              </div>
            </>
          ) : (
            <button className="login-button" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
        </div>
      </div>
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={onLogin}
        />
      )}
    </header>
  );
}

export default Header;

