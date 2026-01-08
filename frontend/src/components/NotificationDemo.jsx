import React from 'react'
import { useNotification, NotificationContainer } from './Notification'
import './NotificationDemo.css'

export default function NotificationDemo() {
  const { 
    notifications, 
    removeNotification, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo 
  } = useNotification()

  return (
    <div className="notification-demo">
      <div className="demo-container">
        <h1>Notification Demo</h1>
        <p>Click the buttons below to see different notification types</p>

        <div className="button-grid">
          <button 
            className="demo-btn success"
            onClick={() => showSuccess('Operation completed successfully!')}
          >
            Show Success
          </button>

          <button 
            className="demo-btn error"
            onClick={() => showError('An error occurred. Please try again.')}
          >
            Show Error
          </button>

          <button 
            className="demo-btn warning"
            onClick={() => showWarning('Warning: This action cannot be undone.')}
          >
            Show Warning
          </button>

          <button 
            className="demo-btn info"
            onClick={() => showInfo('New updates are available.')}
          >
            Show Info
          </button>

          <button 
            className="demo-btn custom"
            onClick={() => showSuccess('Account created successfully!', 5000, 'top-center')}
          >
            Top Center (5s)
          </button>

          <button 
            className="demo-btn custom"
            onClick={() => showError('Failed to save changes', 6000, 'bottom-right')}
          >
            Bottom Right (6s)
          </button>
        </div>

        <div className="info-section">
          <h3>How to Use:</h3>
          <pre className="code-block">
{`import { useNotification, NotificationContainer } from './components/Notification'

function MyComponent() {
  const { notifications, removeNotification, showSuccess } = useNotification()

  const handleClick = () => {
    showSuccess('Success message!')
    // or
    showError('Error message!')
    showWarning('Warning message!')
    showInfo('Info message!')
  }

  return (
    <>
      <button onClick={handleClick}>Show Notification</button>
      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  )
}`}
          </pre>
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}
