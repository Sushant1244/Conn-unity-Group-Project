import React, { useState } from 'react';
import './App.css';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="App">
      {showLogin ? (
        <Login 
          open={true} 
          onSwitchToRegister={() => setShowLogin(false)}
          onAdminLogin={() => alert('Admin login coming soon!')}
        />
      ) : (
        <Register 
          open={true} 
          onClose={() => setShowLogin(true)}
        />
      )}
    </div>
  );
}

export default App;
