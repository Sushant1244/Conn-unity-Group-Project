import React, { useState } from 'react'
import { useNotification, NotificationContainer } from './Notification'
import './AdminModeration.css'

export default function AdminModeration() {
  const { 
    notifications, 
    removeNotification, 
    showSuccess, 
    showError, 
    showWarning, 
    showInfo 
  } = useNotification()

  // Sample pending items for moderation
  const [pendingItems, setPendingItems] = useState([
    {
      id: 1,
      type: 'Post',
      title: 'Community Event: Tech Meetup 2026',
      author: 'John Doe',
      content: 'Join us for an exciting tech meetup featuring AI and Web Development talks...',
      date: '2026-01-10',
      status: 'pending'
    },
    {
      id: 2,
      type: 'User',
      title: 'New User Registration',
      author: 'Jane Smith',
      content: 'User registration from jane.smith@example.com',
      date: '2026-01-11',
      status: 'pending'
    },
    {
      id: 3,
      type: 'Comment',
      title: 'Comment on "React Best Practices"',
      author: 'Mike Johnson',
      content: 'Great article! I would also suggest using custom hooks for better code organization...',
      date: '2026-01-12',
      status: 'pending'
    },
    {
      id: 4,
      type: 'Post',
      title: 'Looking for Study Partners',
      author: 'Sarah Williams',
      content: 'Anyone interested in forming a study group for Computer Science?',
      date: '2026-01-12',
      status: 'pending'
    }
  ])

  const [approvedItems, setApprovedItems] = useState([])
  const [rejectedItems, setRejectedItems] = useState([])

  const handleApprove = (item) => {
    setPendingItems(pendingItems.filter(i => i.id !== item.id))
    setApprovedItems([...approvedItems, { ...item, status: 'approved' }])
    showSuccess(`${item.type} "${item.title}" has been approved!`)
  }

  const handleReject = (item) => {
    setPendingItems(pendingItems.filter(i => i.id !== item.id))
    setRejectedItems([...rejectedItems, { ...item, status: 'rejected' }])
    showWarning(`${item.type} "${item.title}" has been rejected.`)
  }

  const handleReview = (item) => {
    showInfo(`Reviewing ${item.type}: ${item.title}`)
  }

  const renderItemCard = (item, actions) => (
    <div key={item.id} className="moderation-card">
      <div className="card-header">
        <span className={`item-type ${item.type.toLowerCase()}`}>{item.type}</span>
        <span className="item-date">{item.date}</span>
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-author">By: {item.author}</p>
      <p className="card-content">{item.content}</p>
      <div className="card-actions">
        {actions}
      </div>
    </div>
  )

  return (
    <div className="admin-moderation">
      <div className="moderation-container">
        <header className="moderation-header">
          <h1>Admin Moderation Panel</h1>
          <p>Review and approve pending content</p>
          <div className="stats">
            <div className="stat-card pending">
              <span className="stat-number">{pendingItems.length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card approved">
              <span className="stat-number">{approvedItems.length}</span>
              <span className="stat-label">Approved</span>
            </div>
            <div className="stat-card rejected">
              <span className="stat-number">{rejectedItems.length}</span>
              <span className="stat-label">Rejected</span>
            </div>
          </div>
        </header>

        <div className="moderation-tabs">
          <button className="tab-btn active">Pending Review</button>
          <button className="tab-btn">Approved</button>
          <button className="tab-btn">Rejected</button>
        </div>

        <div className="moderation-content">
          <section className="section-pending">
            <h2>Pending Items ({pendingItems.length})</h2>
            {pendingItems.length === 0 ? (
              <div className="empty-state">
                <p>🎉 All caught up! No pending items to review.</p>
              </div>
            ) : (
              <div className="cards-grid">
                {pendingItems.map(item => renderItemCard(item, (
                  <>
                    <button 
                      className="action-btn review"
                      onClick={() => handleReview(item)}
                    >
                      👁️ Review
                    </button>
                    <button 
                      className="action-btn approve"
                      onClick={() => handleApprove(item)}
                    >
                      ✓ Approve
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => handleReject(item)}
                    >
                      ✕ Reject
                    </button>
                  </>
                )))}
              </div>
            )}
          </section>

          {approvedItems.length > 0 && (
            <section className="section-approved">
              <h2>Recently Approved ({approvedItems.length})</h2>
              <div className="cards-grid">
                {approvedItems.map(item => renderItemCard(item, (
                  <span className="status-badge approved">✓ Approved</span>
                )))}
              </div>
            </section>
          )}

          {rejectedItems.length > 0 && (
            <section className="section-rejected">
              <h2>Recently Rejected ({rejectedItems.length})</h2>
              <div className="cards-grid">
                {rejectedItems.map(item => renderItemCard(item, (
                  <span className="status-badge rejected">✕ Rejected</span>
                )))}
              </div>
            </section>
          )}
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </div>
  )
}
