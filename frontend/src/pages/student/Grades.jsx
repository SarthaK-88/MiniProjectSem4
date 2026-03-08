import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Grades = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grades');

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/grades/my-grades', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGrades(response.data.data || []);
    } catch (error) {
      console.error('Failed to load grades:', error);
      alert('Failed to load grades: ' + (error.response?.data?.message || error.message));
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
          <div className="navbar-brand">My Grades</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Academic Performance</h3>
            {grades.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Assignment/Test</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.grade_id}>
                      <td>{grade.subject_name}</td>
                      <td>{grade.assessment_type}</td>
                      <td><strong>{grade.marks_obtained}</strong></td>
                      <td>{grade.total_marks}</td>
                      <td>{((grade.marks_obtained / grade.total_marks) * 100).toFixed(1)}%</td>
                      <td>
                        <span className={`badge ${
                          grade.percentage >= 90 ? 'badge-success' :
                          grade.percentage >= 80 ? 'badge-info' :
                          grade.percentage >= 70 ? 'badge-warning' : 'badge-danger'
                        }`}>
                          {grade.percentage >= 90 ? 'A+' :
                           grade.percentage >= 80 ? 'A' :
                           grade.percentage >= 70 ? 'B' :
                           grade.percentage >= 60 ? 'C' : 'F'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#9ca3af' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                <h4>No grades available yet</h4>
                <p>Your grades will be displayed here once faculty publishes them.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grades;
