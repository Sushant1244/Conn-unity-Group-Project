import React, { useState } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import { useNotification, NotificationContainer } from './components/Notification';

function App() {
  const [showLogin, setShowLogin] = useState(false);
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
          showNotification={{ showSuccess, showError, showWarning, showInfo }}
        />
      ) : (
        <Register 
          open={true} 
          onClose={() => setShowLogin(true)}
          showNotification={{ showSuccess, showError, showWarning, showInfo }}
        />
      )}
      
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}

export default App;
