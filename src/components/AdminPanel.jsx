import { useState, useEffect } from 'react';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState(''); // 'ban' or 'unban'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'active', 'banned'

  // Simulate fetching users from API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockUsers = [
        { id: 1, username: 'john_doe', email: 'john@example.com', status: 'active', joinDate: '2024-01-15' },
        { id: 2, username: 'jane_smith', email: 'jane@example.com', status: 'active', joinDate: '2024-02-20' },
        { id: 3, username: 'bob_wilson', email: 'bob@example.com', status: 'banned', joinDate: '2023-11-10', banReason: 'Violation of terms' },
        { id: 4, username: 'alice_brown', email: 'alice@example.com', status: 'active', joinDate: '2024-03-05' },
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, reason) => {
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/admin/users/${userId}/ban`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reason })
      // });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: 'banned', banReason: reason } 
          : user
      ));
      
      alert('User has been banned successfully');
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Failed to ban user');
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      // Replace with actual API call
      // const response = await fetch(`/api/admin/users/${userId}/unban`, {
      //   method: 'POST'
      // });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: 'active', banReason: null } 
          : user
      ));
      
      alert('User has been unbanned successfully');
    } catch (error) {
      console.error('Error unbanning user:', error);
      alert('Failed to unban user');
    }
  };

  const openConfirmDialog = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setSelectedUser(null);
    setActionType('');
    setShowConfirmDialog(false);
  };

  const confirmAction = () => {
    if (actionType === 'ban') {
      const reason = prompt('Please enter the reason for banning this user:');
      if (reason) {
        handleBanUser(selectedUser.id, reason);
      }
    } else if (actionType === 'unban') {
      handleUnbanUser(selectedUser.id);
    }
    closeConfirmDialog();
  };

  // Filter and search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="admin-panel loading">Loading users...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Panel - User Management</h1>
        <p>Manage user accounts and permissions</p>
      </div>

      <div className="admin-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <label>Filter by status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">No users found</td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className={user.status === 'banned' ? 'banned-row' : ''}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.status}`}>
                      {user.status.toUpperCase()}
                    </span>
                    {user.status === 'banned' && user.banReason && (
                      <div className="ban-reason">Reason: {user.banReason}</div>
                    )}
                  </td>
                  <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td>
                    {user.status === 'active' ? (
                      <button
                        className="btn-ban"
                        onClick={() => openConfirmDialog(user, 'ban')}
                      >
                        Ban User
                      </button>
                    ) : (
                      <button
                        className="btn-unban"
                        onClick={() => openConfirmDialog(user, 'unban')}
                      >
                        Unban User
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Action</h2>
            <p>
              Are you sure you want to {actionType} user <strong>{selectedUser?.username}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeConfirmDialog}>
                Cancel
              </button>
              <button 
                className={actionType === 'ban' ? 'btn-ban' : 'btn-confirm'}
                onClick={confirmAction}
              >
                Confirm {actionType === 'ban' ? 'Ban' : 'Unban'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
