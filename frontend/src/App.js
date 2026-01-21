import React, { useState, useEffect } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import { useNotification, NotificationContainer } from './components/Notification';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { 
    notifications, 
    removeNotification, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo 
  } = useNotification();

  return (
    <div className="App">
      {showLogin ? (
        <Login 
          open={true} 
          onSwitchToRegister={() => setShowLogin(false)}
          onAdminLogin={() => showInfo('Admin login coming soon!')}
          onForgotPassword={() => setShowForgotPassword(true)}
          showNotification={{ showSuccess, showError, showWarning, showInfo }}
        />
      ) : (
        <Register 
          open={true} 
          onClose={() => setShowLogin(true)}
          showNotification={{ showSuccess, showError, showWarning, showInfo }}
        />
      )}
      
      <ForgotPassword 
        open={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
      
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

export default App;
