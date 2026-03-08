import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Announcements = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('announcements');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [creating, setCreating] = useState(false);

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

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/announcements', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnnouncements(response.data.data || []);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setCreating(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/announcements',
        {
          title: formData.title,
          content: formData.content
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert('Announcement posted successfully!');
      setShowCreateModal(false);
      setFormData({ title: '', content: '' });
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to post announcement:', error);
      alert('Failed to post: ' + (error.response?.data?.message || error.message));
    } finally {
      setCreating(false);
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
          <div className="navbar-brand">Announcements</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>All Announcements</h3>
              <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                + New Announcement
              </button>
            </div>

            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
            ) : announcements.length > 0 ? (
              <div>
                {announcements.map((announcement) => (
                  <div key={announcement.announcement_id} style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0 }}>{announcement.title}</h4>
                      <span className={`badge ${
                        announcement.priority === 'urgent' ? 'badge-danger' :
                        announcement.priority === 'high' ? 'badge-warning' :
                        announcement.priority === 'medium' ? 'badge-info' : 'badge-secondary'
                      }`}>
                        {announcement.priority}
                      </span>
                    </div>
                    <p style={{ color: '#4b5563', margin: '0 0 0.75rem 0' }}>{announcement.content}</p>
                    <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
                      Posted on {new Date(announcement.created_at).toLocaleDateString()} at {new Date(announcement.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📢</div>
                <h4>No announcements yet</h4>
                <p>Create an announcement to notify your students.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '600px', maxWidth: '90%' }}>
            <h3 style={{ marginBottom: '1rem' }}>Create Announcement</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Title *</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter announcement title"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} 
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Content *</label>
                <textarea 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                  placeholder="Write your announcement here..."
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', minHeight: '150px' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Posting...' : 'Post Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
