import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';

const Users = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); // all, students, faculty, admin
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Failed to load users:', error);
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

  const filteredUsers = users.filter(u => {
    if (filter === 'students') return u.role === 'student';
    if (filter === 'faculty') return u.role === 'faculty';
    if (filter === 'admin') return u.role === 'admin';
    return true;
  });

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>🎓 CampusConnect</h2>
          <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Admin Portal</p>
        </div>
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

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="navbar-brand">Manage Users</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>All Users ({filteredUsers.length})</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('all')}>All</button>
                <button className={`btn btn-sm ${filter === 'students' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('students')}>Students</button>
                <button className={`btn btn-sm ${filter === 'faculty' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('faculty')}>Faculty</button>
                <button className={`btn btn-sm ${filter === 'admin' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFilter('admin')}>Admin</button>
              </div>
              <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add User</button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td><span className="badge badge-info">{u.role}</span></td>
                    <td><span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>{u.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>
                      <button className="btn btn-sm btn-outline">Edit</button>
                      <button className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '600px', maxWidth: '90%' }}>
            <h3>Add New User</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Name</label>
              <input type="text" style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email</label>
              <input type="email" style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Role</label>
              <select style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowAddModal(false)}>Add User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
