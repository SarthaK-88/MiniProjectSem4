import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const Attendance = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      const response = await studentAPI.getDashboard();
      setAttendance(response.data.data.attendance || []);
    } catch (error) {
      console.error('Failed to load attendance:', error);
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
          <li className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleNavigation('dashboard', '/student/dashboard')}>📊 Dashboard</li>
          <li className={`sidebar-menu-item ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => handleNavigation('attendance', '/student/attendance')}>📅 Attendance</li>
          <li className={`sidebar-menu-item ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => handleNavigation('assignments', '/student/assignments')}>📚 Assignments</li>
          <li className={`sidebar-menu-item ${activeTab === 'materials' ? 'active' : ''}`} onClick={() => handleNavigation('materials', '/student/materials')}>📖 Study Materials</li>
          <li className={`sidebar-menu-item ${activeTab === 'grades' ? 'active' : ''}`} onClick={() => handleNavigation('grades', '/student/grades')}>🏆 Grades</li>
          <li className={`sidebar-menu-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => handleNavigation('messages', '/student/messages')}>💬 Messages</li>
          <li className="sidebar-menu-item" onClick={handleLogout}>🚪 Logout</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="navbar-brand">My Attendance</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Subject-wise Attendance</h3>
            {attendance.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Classes Attended</th>
                    <th>Total Classes</th>
                    <th>Percentage</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((subject) => (
                    <tr key={subject.subject_id}>
                      <td>{subject.subject_name}</td>
                      <td>{subject.present_count}</td>
                      <td>{subject.total_count}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ flex: 1, height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                            <div 
                              style={{ 
                                width: `${subject.percentage}%`, 
                                height: '100%', 
                                backgroundColor: subject.percentage >= 75 ? '#10b981' : subject.percentage >= 60 ? '#f59e0b' : '#ef4444',
                                borderRadius: '4px'
                              }}
                            ></div>
                          </div>
                          <span style={{ fontWeight: 'bold', minWidth: '50px' }}>{subject.percentage}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${subject.percentage >= 75 ? 'badge-success' : subject.percentage >= 60 ? 'badge-warning' : 'badge-danger'}`}>
                          {subject.percentage >= 75 ? 'Good' : subject.percentage >= 60 ? 'Average' : 'Low'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No attendance records found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
