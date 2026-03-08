import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return <div className="spinner"></div>;
  }

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🎓 CampusConnect</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Student Portal</p>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard', '/student/dashboard')}
          >
            📊 Dashboard
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => handleNavigation('attendance', '/student/attendance')}
          >
            📅 Attendance
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => handleNavigation('assignments', '/student/assignments')}
          >
            📚 Assignments
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => handleNavigation('materials', '/student/materials')}
          >
            📖 Study Materials
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'grades' ? 'active' : ''}`}
            onClick={() => handleNavigation('grades', '/student/grades')}
          >
            🏆 Grades
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => handleNavigation('messages', '/student/messages')}
          >
            💬 Messages
          </li>
          <li className="sidebar-menu-item" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
          <div className="navbar-brand">Student Dashboard</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ marginTop: '2rem' }}>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-card-icon primary">📊</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.attendance?.length || 0}</h3>
                <p>Subjects</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon warning">📝</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.assignments?.length || 0}</h3>
                <p>Active Assignments</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon success">📢</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.announcements?.length || 0}</h3>
                <p>Announcements</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon danger">💬</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.unreadNotifications || 0}</h3>
                <p>Unread Messages</p>
              </div>
            </div>
          </div>

          {/* Recent Assignments */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Recent Assignments</h3>
            {dashboardData?.assignments && dashboardData.assignments.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.assignments.map((assignment) => (
                    <tr key={assignment.assignment_id}>
                      <td>{assignment.title}</td>
                      <td>{assignment.subject_name}</td>
                      <td>{new Date(assignment.deadline).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${assignment.is_submitted ? 'badge-success' : 'badge-warning'}`}>
                          {assignment.is_submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No active assignments</p>
            )}
          </div>

          {/* Announcements */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Recent Announcements</h3>
            {dashboardData?.announcements && dashboardData.announcements.length > 0 ? (
              dashboardData.announcements.map((announcement) => (
                <div key={announcement.announcement_id} style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid #e2e8f0',
                  backgroundColor: announcement.is_pinned ? '#fef3c7' : 'transparent'
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>{announcement.title}</h4>
                  <p style={{ color: '#718096', fontSize: '0.875rem' }}>{announcement.content}</p>
                  <span className={`badge badge-${announcement.priority}`}>{announcement.priority}</span>
                </div>
              ))
            ) : (
              <p>No announcements</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
