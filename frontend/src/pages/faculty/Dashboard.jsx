import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { facultyAPI } from '../../services/api';

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
      const response = await facultyAPI.getDashboard();
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
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Faculty Portal</p>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard', '/faculty/dashboard')}
          >
            📊 Dashboard
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => handleNavigation('attendance', '/faculty/attendance')}
          >
            ✅ Mark Attendance
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'assignments' ? 'active' : ''}`}
            onClick={() => handleNavigation('assignments', '/faculty/assignments')}
          >
            📝 Assignments
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'materials' ? 'active' : ''}`}
            onClick={() => handleNavigation('materials', '/faculty/materials')}
          >
            📚 Study Materials
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => handleNavigation('announcements', '/faculty/announcements')}
          >
            📢 Announcements
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => handleNavigation('messages', '/faculty/messages')}
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
          <div className="navbar-brand">Faculty Dashboard</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        {/* Dashboard Content */}
        <div style={{ marginTop: '2rem' }}>
          <div className="dashboard-grid">
            <div className="stat-card">
              <div className="stat-card-icon primary">👨‍🎓</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.attendanceStats?.length || 0}</h3>
                <p>Subjects</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon warning">📥</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.pendingSubmissions || 0}</h3>
                <p>Pending Submissions</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon success">📅</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.classes?.length || 0}</h3>
                <p>Today's Classes</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon danger">📊</div>
              <div className="stat-card-content">
                <h3>Avg</h3>
                <p>Attendance %</p>
              </div>
            </div>
          </div>

          {/* Today's Classes */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Today's Schedule</h3>
            {dashboardData?.classes && dashboardData.classes.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Subject</th>
                    <th>Room</th>
                    <th>Semester</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.classes.map((cls) => (
                    <tr key={cls.timetable_id}>
                      <td>{cls.start_time} - {cls.end_time}</td>
                      <td>{cls.subject_name}</td>
                      <td>{cls.room_number}</td>
                      <td>Sem {cls.semester}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No classes scheduled for today</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
