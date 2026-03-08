import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Logs = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('logs');

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleNavigation = (tab, route) => { setActiveTab(tab); if(route) navigate(route); };

  const mockLogs = [
    { log_id: 1, action: 'LOGIN', user_name: 'Student 1', details: 'User logged in successfully', created_at: new Date().toISOString() },
    { log_id: 2, action: 'ATTENDANCE_MARKED', user_name: 'Dr. Smith', details: 'Marked attendance for CSE101', created_at: new Date().toISOString() },
    { log_id: 3, action: 'ASSIGNMENT_CREATED', user_name: 'Dr. Johnson', details: 'Created assignment for DBMS', created_at: new Date().toISOString() },
    { log_id: 4, action: 'MATERIAL_UPLOADED', user_name: 'Dr. Williams', details: 'Uploaded lecture notes', created_at: new Date().toISOString() },
    { log_id: 5, action: 'USER_ADDED', user_name: 'Admin', details: 'Added new student to CSE department', created_at: new Date().toISOString() },
  ];

  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-header"><h2>🎓 CampusConnect</h2><p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Admin Portal</p></div>
        <ul className="sidebar-menu">
          <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('dashboard', '/admin/dashboard')}>📊 Dashboard</li>
          <li className={`sidebar-menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => handleNavigation('users', '/admin/users')}>👥 Manage Users</li>
          <li className={`sidebar-menu-item ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => handleNavigation('departments', '/admin/departments')}>🏛️ Departments</li>
          <li className={`sidebar-menu-item ${activeTab === 'subjects' ? 'active' : ''}`} onClick={() => handleNavigation('subjects', '/admin/subjects')}>📚 Subjects</li>
          <li className={`sidebar-menu-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => handleNavigation('reports', '/admin/reports')}>📈 Reports</li>
          <li className={`sidebar-menu-item ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => handleNavigation('logs', '/admin/logs')}>📋 Activity Logs</li>
          <li className="sidebar-menu-item" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="navbar"><div className="navbar-brand">Activity Logs</div><div className="navbar-menu"><span>Welcome, {user?.name}</span></div></div>
        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>System Activity Logs</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Details</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.map((log) => (
                  <tr key={log.log_id}>
                    <td><span className="badge badge-info">{log.action.replace('_', ' ')}</span></td>
                    <td>{log.user_name}</td>
                    <td>{log.details}</td>
                    <td>{new Date(log.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logs;
