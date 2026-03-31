import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { facultyAPI } from '../../services/api';

const Attendance = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [subjectId, setSubjectId] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('attendance');
  const [saved, setSaved] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    loadSubjects();
    loadStudents();
  }, []);

  const loadSubjects = async () => {
    try {
      const response = await facultyAPI.getSubjects();
      setSubjects(response.data.data || []);
    } catch (error) {
      console.error('Failed to load subjects:', error);
      setSubjects([]);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await facultyAPI.getStudents();
      const list = (response.data.data || []).map(s => ({ ...s, present: false }));
      setStudents(list);
    } catch (error) {
      console.error('Failed to load students:', error);
      setStudents([]);
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

  const toggleAttendance = (studentId) => {
    setStudents(students.map(student => 
      student.student_id === studentId 
        ? { ...student, present: !student.present }
        : student
    ));
  };

  const handleSubmit = async () => {
    try {
      if (!subjectId) {
        alert('Please select a subject');
        return;
      }

      const presentStudents = students.filter(s => s.present).map(s => s.student_id);
      
      await facultyAPI.markAttendance({
        subjectId: parseInt(subjectId),
        date: selectedDate,
        studentIds: presentStudents
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save attendance:', error);
      alert('Failed to save attendance: ' + (error.response?.data?.message || error.message));
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
          <div className="navbar-brand">Mark Attendance</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Take Attendance</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                >
                  <option value="">Select Subject</option>
                  {subjects.map((sub) => (
                    <option key={sub.subject_id} value={sub.subject_id}>{sub.subject_name}</option>
                  ))}
                </select>
              </div>
            </div>

            {saved && (
              <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
                ✅ Attendance saved successfully!
              </div>
            )}

            <table className="table">
              <thead>
                <tr>
                  <th>Roll Number</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>{student.roll_number}</td>
                    <td>{student.name}</td>
                    <td>
                      <span className={`badge ${student.present ? 'badge-success' : 'badge-danger'}`}>
                        {student.present ? 'Present' : 'Absent'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${student.present ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => toggleAttendance(student.student_id)}
                      >
                        {student.present ? 'Mark Absent' : 'Mark Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={() => setStudents(students.map(s => ({ ...s, present: true })))}>
                Mark All Present
              </button>
              <button className="btn btn-outline" onClick={() => setStudents(students.map(s => ({ ...s, present: false })))}>
                Mark All Absent
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={!subjectId}
              >
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
