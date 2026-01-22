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

  const [activeTab, setActiveTab] = useState('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedItems, setSelectedItems] = useState([])

  // Sample pending items for moderation
  const [pendingItems, setPendingItems] = useState([
    {
      id: 1,
      type: 'Post',
      title: 'Community Event: Tech Meetup 2026',
      author: 'John Doe',
      authorEmail: 'john@example.com',
      content: 'Join us for an exciting tech meetup featuring AI and Web Development talks. Free food and networking!',
      date: '2026-01-10',
      status: 'pending',
      avatar: '👨‍💻'
    },
    {
      id: 2,
      type: 'User',
      title: 'New User Registration',
      author: 'Jane Smith',
      authorEmail: 'jane.smith@example.com',
      content: 'User registration from jane.smith@example.com - Profile appears legitimate.',
      date: '2026-01-11',
      status: 'pending',
      avatar: '👩‍💼'
    },
    {
      id: 3,
      type: 'Comment',
      title: 'Comment on "React Best Practices"',
      author: 'Mike Johnson',
      authorEmail: 'mike@example.com',
      content: 'Great article! I would also suggest using custom hooks for better code organization and reusability.',
      date: '2026-01-12',
      status: 'pending',
      avatar: '🧑‍🔧'
    },
    {
      id: 4,
      type: 'Post',
      title: 'Looking for Study Partners',
      author: 'Sarah Williams',
      authorEmail: 'sarah@example.com',
      content: 'Anyone interested in forming a study group for Computer Science? Focus on algorithms and data structures.',
      date: '2026-01-12',
      status: 'pending',
      avatar: '👩‍🎓'
    },
    {
      id: 5,
      type: 'Comment',
      title: 'Comment on "JavaScript Tips"',
      author: 'Alex Chen',
      authorEmail: 'alex@example.com',
      content: 'This is super helpful! I struggled with async/await for weeks before understanding this concept.',
      date: '2026-01-13',
      status: 'pending',
      avatar: '🧑‍💻'
    }
  ])

  const [approvedItems, setApprovedItems] = useState([])
  const [rejectedItems, setRejectedItems] = useState([])

  const handleApprove = (item) => {
    setPendingItems(pendingItems.filter(i => i.id !== item.id))
    setApprovedItems([...approvedItems, { ...item, status: 'approved', approvedDate: new Date().toISOString() }])
    setSelectedItems(selectedItems.filter(id => id !== item.id))
    showSuccess(`${item.type} "${item.title}" has been approved!`)
  }

  const handleReject = (item, reason = 'Content does not meet community guidelines') => {
    setPendingItems(pendingItems.filter(i => i.id !== item.id))
    setRejectedItems([...rejectedItems, { ...item, status: 'rejected', rejectedDate: new Date().toISOString(), reason }])
    setSelectedItems(selectedItems.filter(id => id !== item.id))
    showWarning(`${item.type} "${item.title}" has been rejected.`)
  }

  const handleBulkApprove = () => {
    const itemsToApprove = pendingItems.filter(item => selectedItems.includes(item.id))
    setPendingItems(pendingItems.filter(item => !selectedItems.includes(item.id)))
    setApprovedItems([...approvedItems, ...itemsToApprove.map(item => ({ ...item, status: 'approved', approvedDate: new Date().toISOString() }))])
    showSuccess(`${selectedItems.length} items approved!`)
    setSelectedItems([])
  }

  const handleBulkReject = () => {
    const itemsToReject = pendingItems.filter(item => selectedItems.includes(item.id))
    setPendingItems(pendingItems.filter(item => !selectedItems.includes(item.id)))
    setRejectedItems([...rejectedItems, ...itemsToReject.map(item => ({ ...item, status: 'rejected', rejectedDate: new Date().toISOString() }))])
    showWarning(`${selectedItems.length} items rejected.`)
    setSelectedItems([])
  }

  const toggleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    } else {
      setSelectedItems([...selectedItems, itemId])
    }
  }

  const toggleSelectAll = () => {
    const currentItems = getCurrentItems()
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(currentItems.map(item => item.id))
    }
  }

  const getCurrentItems = () => {
    let items = []
    if (activeTab === 'pending') items = pendingItems
    else if (activeTab === 'approved') items = approvedItems
    else if (activeTab === 'rejected') items = rejectedItems

    // Apply search filter
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply type filter
    if (filterType !== 'all') {
      items = items.filter(item => item.type.toLowerCase() === filterType.toLowerCase())
    }

    return items
  }

  const renderItemCard = (item, actions) => {
    const isSelected = selectedItems.includes(item.id)
    
    return (
      <div key={item.id} className={`moderation-card ${isSelected ? 'selected' : ''}`}>
        {activeTab === 'pending' && (
          <div className="card-checkbox">
            <input 
              type="checkbox" 
              checked={isSelected}
              onChange={() => toggleSelectItem(item.id)}
              id={`checkbox-${item.id}`}
            />
            <label htmlFor={`checkbox-${item.id}`}></label>
          </div>
        )}
        <div className="card-header">
          <div className="header-left">
            <span className="item-avatar">{item.avatar || '📄'}</span>
            <span className={`item-type ${item.type.toLowerCase()}`}>{item.type}</span>
          </div>
          <span className="item-date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {item.date}
          </span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-author">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M4 20c0-4 3-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          {item.author}
          {item.authorEmail && <span className="author-email"> ({item.authorEmail})</span>}
        </p>
        <p className="card-content">{item.content}</p>
        {item.reason && (
          <div className="rejection-reason">
            <strong>Rejection Reason:</strong> {item.reason}
          </div>
        )}
        <div className="card-actions">
          {actions}
        </div>
      </div>
    )
  }

  const currentItems = getCurrentItems()

  return (
    <div className="admin-moderation">
      <div className="moderation-container">
        <header className="moderation-header">
          <div className="header-top">
            <div className="header-text">
              <h1>🛡️ Admin Moderation Panel</h1>
              <p>Review and approve pending content to maintain community standards</p>
            </div>
          </div>
          
          <div className="stats">
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <span className="stat-number">{pendingItems.length}</span>
                <span className="stat-label">Pending</span>
              </div>
            </div>
            <div className="stat-card approved">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <span className="stat-number">{approvedItems.length}</span>
                <span className="stat-label">Approved</span>
              </div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-icon">❌</div>
              <div className="stat-info">
                <span className="stat-number">{rejectedItems.length}</span>
                <span className="stat-label">Rejected</span>
              </div>
            </div>
          </div>
        </header>

        {/* Search and Filter Bar */}
        <div className="toolbar">
          <div className="search-filter-row">
            <div className="search-box">
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input 
                type="text" 
                placeholder="Search by title, author, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="clear-search" onClick={() => setSearchQuery('')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </button>
              )}
            </div>
            
            <div className="filter-group">
              <select 
                className="filter-select"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="post">Posts Only</option>
                <option value="user">Users Only</option>
                <option value="comment">Comments Only</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && activeTab === 'pending' && (
            <div className="bulk-actions">
              <span className="selected-count">{selectedItems.length} selected</span>
              <button className="bulk-btn approve" onClick={handleBulkApprove}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Approve All
              </button>
              <button className="bulk-btn reject" onClick={handleBulkReject}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Reject All
              </button>
              <button className="bulk-btn cancel" onClick={() => setSelectedItems([])}>
                Clear Selection
              </button>
            </div>
          )}
        </div>

        <div className="moderation-tabs">
          <button 
            className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => { setActiveTab('pending'); setSelectedItems([]); }}
          >
            <span className="tab-icon">⏳</span>
            Pending Review
            {pendingItems.length > 0 && <span className="tab-badge">{pendingItems.length}</span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => { setActiveTab('approved'); setSelectedItems([]); }}
          >
            <span className="tab-icon">✅</span>
            Approved
            {approvedItems.length > 0 && <span className="tab-badge approved">{approvedItems.length}</span>}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rejected' ? 'active' : ''}`}
            onClick={() => { setActiveTab('rejected'); setSelectedItems([]); }}
          >
            <span className="tab-icon">❌</span>
            Rejected
            {rejectedItems.length > 0 && <span className="tab-badge rejected">{rejectedItems.length}</span>}
          </button>
        </div>

        <div className="moderation-content">
          {activeTab === 'pending' && pendingItems.length > 0 && (
            <div className="select-all-bar">
              <label className="select-all-checkbox">
                <input 
                  type="checkbox" 
                  checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                  onChange={toggleSelectAll}
                />
                Select All ({currentItems.length})
              </label>
            </div>
          )}

          {currentItems.length === 0 ? (
            <div className="empty-state">
              {searchQuery || filterType !== 'all' ? (
                <>
                  <div className="empty-icon">🔍</div>
                  <h3>No results found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                  <button 
                    className="reset-btn"
                    onClick={() => { setSearchQuery(''); setFilterType('all'); }}
                  >
                    Reset Filters
                  </button>
                </>
              ) : (
                <>
                  <div className="empty-icon">🎉</div>
                  <h3>All caught up!</h3>
                  <p>No {activeTab} items to review.</p>
                </>
              )}
            </div>
          ) : (
            <div className="cards-grid">
              {currentItems.map(item => renderItemCard(item, 
                activeTab === 'pending' ? (
                  <>
                    <button 
                      className="action-btn approve"
                      onClick={() => handleApprove(item)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Approve
                    </button>
                    <button 
                      className="action-btn reject"
                      onClick={() => handleReject(item)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Reject
                    </button>
                  </>
                ) : activeTab === 'approved' ? (
                  <span className="status-badge approved">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Approved
                  </span>
                ) : (
                  <span className="status-badge rejected">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Rejected
                  </span>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      <NotificationContainer 
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  )
}
