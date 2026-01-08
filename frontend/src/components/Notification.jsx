import React, { useEffect, useState } from 'react'
import './Notification.css'

export default function Notification({ 
  message, 
  type = 'info', // 'success', 'error', 'warning', 'info'
  duration = 4000,
  onClose,
  position = 'top-right' // 'top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center'
}) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose && onClose()
    }, 300)
  }

  if (!isVisible) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )
      case 'error':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'warning':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 20h20L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      case 'info':
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
    }
  }

  return (
    <div 
      className={`notification notification-${type} notification-${position} ${isExiting ? 'notification-exit' : 'notification-enter'}`}
      role="alert"
    >
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        <div className="notification-message">{message}</div>
      </div>
      <button 
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      {duration > 0 && (
        <div className="notification-progress">
          <div 
            className="notification-progress-bar" 
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  )
}

// NotificationContainer Component
export function NotificationContainer({ notifications = [], onRemove }) {
  return (
    <>
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          position={notification.position}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </>
  )
}

// Custom Hook for managing notifications
export function useNotification() {
  const [notifications, setNotifications] = useState([])

  const addNotification = (message, type = 'info', duration = 4000, position = 'top-right') => {
    const id = Date.now() + Math.random()
    const notification = { id, message, type, duration, position }
    
    setNotifications(prev => [...prev, notification])
    
    return id
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const showSuccess = (message, duration, position) => {
    return addNotification(message, 'success', duration, position)
  }

  const showError = (message, duration, position) => {
    return addNotification(message, 'error', duration, position)
  }

  const showWarning = (message, duration, position) => {
    return addNotification(message, 'warning', duration, position)
  }

  const showInfo = (message, duration, position) => {
    return addNotification(message, 'info', duration, position)
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll
  }
}
