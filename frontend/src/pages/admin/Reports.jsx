import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Reports = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('reports');
  const [reportType, setReportType] = useState('attendance');

  const handleLogout = () => { logout(); navigate('/login'); };
  const handleNavigation = (tab, route) => { setActiveTab(tab); if(route) navigate(route); };

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
        <div className="navbar"><div className="navbar-brand">Reports & Analytics</div><div className="navbar-menu"><span>Welcome, {user?.name}</span></div></div>
        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Generate Reports</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Report Type</label>
                <select value={reportType} onChange={(e) => setReportType(e.target.value)} style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                  <option value="attendance">Attendance Report</option>
                  <option value="grades">Grade Report</option>
                  <option value="assignments">Assignment Report</option>
                  <option value="faculty">Faculty Performance</option>
                  <option value="student">Student Performance</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date Range</label>
                <input type="date" style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', marginBottom: '0.5rem' }} />
                <input type="date" style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
              </div>
            </div>
            <button className="btn btn-primary">Generate Report</button>
            
            <div style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
              <h4>Select filters and generate report</h4>
              <p style={{ color: '#9ca3af' }}>Report will be displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
