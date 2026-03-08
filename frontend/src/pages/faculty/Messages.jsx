import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Messages = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (tab, route) => {
    setActiveTab(tab);
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🎓 CampusConnect</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Faculty Portal</p>
        </div>
        <ul className="sidebar-menu">
          <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('dashboard', '/faculty/dashboard')}>📊 Dashboard</li>
          <li className={`sidebar-menu-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => handleNavigation('attendance', '/faculty/attendance')}>✅ Mark Attendance</li>
          <li className={`sidebar-menu-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => handleNavigation('assignments', '/faculty/assignments')}>📝 Assignments</li>
          <li className={`sidebar-menu-item ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => handleNavigation('materials', '/faculty/materials')}>📚 Study Materials</li>
          <li className={`sidebar-menu-item ${activeTab === 'announcements' ? 'active' : ''}`} onClick={() => handleNavigation('announcements', '/faculty/announcements')}>📢 Announcements</li>
          <li className={`sidebar-menu-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => handleNavigation('messages', '/faculty/messages')}>💬 Messages</li>
          <li className="sidebar-menu-item" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="navbar-brand">Messages</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1rem', height: 'calc(100vh - 140px)' }}>
          {/* Chat List */}
          <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '1rem', padding: '0 1rem' }}>Chats</h3>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '1rem', textAlign: 'center', color: '#9ca3af' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>💬</div>
                <p>No messages yet</p>
                <p style={{ fontSize: '0.875rem' }}>Students can message you directly.</p>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            {selectedChat ? (
              <>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h4>{selectedChat.name}</h4>
                </div>
                <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                  <p style={{ textAlign: 'center', color: '#9ca3af' }}>No messages in this chat</p>
                </div>
                <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    style={{ flex: 1, padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                    onKeyPress={(e) => e.key === 'Enter' && console.log('Send message')}
                  />
                  <button className="btn btn-primary">Send</button>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💬</div>
                  <h4>Select a chat to start messaging</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
