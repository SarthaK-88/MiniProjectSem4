import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

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
      const response = await adminAPI.getDashboard();
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
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Admin Portal</p>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleNavigation('dashboard', '/admin/dashboard')}
          >
            📊 Dashboard
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleNavigation('users', '/admin/users')}
          >
            👥 Manage Users
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => handleNavigation('departments', '/admin/departments')}
          >
            🏛️ Departments
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'subjects' ? 'active' : ''}`}
            onClick={() => handleNavigation('subjects', '/admin/subjects')}
          >
            📚 Subjects
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => handleNavigation('reports', '/admin/reports')}
          >
            📈 Reports
          </li>
          <li 
            className={`sidebar-menu-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => handleNavigation('logs', '/admin/logs')}
          >
            📋 Activity Logs
          </li>
          <li className="sidebar-menu-item" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Navbar */}
        <div className="navbar">
          <div className="navbar-brand">Admin Dashboard</div>
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
                <h3>{dashboardData?.overview?.totalStudents || 0}</h3>
                <p>Total Students</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon success">👨‍🏫</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.overview?.totalFaculty || 0}</h3>
                <p>Total Faculty</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon warning">🏛️</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.overview?.totalDepartments || 0}</h3>
                <p>Departments</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card-icon danger">👤</div>
              <div className="stat-card-content">
                <h3>{dashboardData?.overview?.totalUsers || 0}</h3>
                <p>Total Users</p>
              </div>
            </div>
          </div>

          {/* Today's Activity */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Today's Activity</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '0.5rem' }}>
                <h4 style={{ fontSize: '1.5rem', color: '#1e40af' }}>{dashboardData?.todayActivity?.logins || 0}</h4>
                <p style={{ color: '#1e40af' }}>User Logins</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '0.5rem' }}>
                <h4 style={{ fontSize: '1.5rem', color: '#065f46' }}>{dashboardData?.todayActivity?.attendanceMarked || 0}</h4>
                <p style={{ color: '#065f46' }}>Attendance Marked</p>
              </div>
              <div style={{ padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem' }}>
                <h4 style={{ fontSize: '1.5rem', color: '#92400e' }}>{dashboardData?.todayActivity?.submissions || 0}</h4>
                <p style={{ color: '#92400e' }}>Submissions</p>
              </div>
            </div>
          </div>

          {/* Recent Activity Logs */}
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
            {dashboardData?.recentLogs && dashboardData.recentLogs.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>User</th>
                    <th>Details</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentLogs.map((log) => (
                    <tr key={log.log_id}>
                      <td><span className="badge badge-info">{log.action}</span></td>
                      <td>{log.user_name || 'Unknown'}</td>
                      <td>{log.details}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
