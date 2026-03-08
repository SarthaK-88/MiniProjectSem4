import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Subjects = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('subjects');
  const [showModal, setShowModal] = useState(false);

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
        <div className="navbar"><div className="navbar-brand">Subjects</div><div className="navbar-menu"><span>Welcome, {user?.name}</span></div></div>
        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>All Subjects</h3>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Subject</button>
            </div>
            <table className="table">
              <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Credits</th><th>Actions</th></tr></thead>
              <tbody>
                <tr><td>CSE101</td><td>Data Structures</td><td>CSE</td><td>4</td><td><button className="btn btn-sm btn-outline">Edit</button></td></tr>
                <tr><td>CSE202</td><td>DBMS</td><td>CSE</td><td>4</td><td><button className="btn btn-sm btn-outline">Edit</button></td></tr>
                <tr><td>ME301</td><td>Thermodynamics</td><td>ME</td><td>3</td><td><button className="btn btn-sm btn-outline">Edit</button></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%' }}>
            <h3>Add Subject</h3>
            <input type="text" placeholder="Subject Code" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            <input type="text" placeholder="Subject Name" style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            <select style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
              <option>Select Department</option>
              <option>CSE</option>
              <option>ME</option>
              <option>ECE</option>
            </select>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowModal(false)}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subjects;
