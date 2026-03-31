import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const Assignments = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assignments');
  const [filter, setFilter] = useState('all'); // all, pending, submitted
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/student/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const list = response.data.data || [];
      setAssignments(list.map(a => ({ ...a, is_submitted: !!(a.submission_id || a.is_submitted) })));
    } catch (error) {
      console.error('Failed to load assignments:', error);
      alert('Failed to load assignments: ' + (error.response?.data?.message || error.message));
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

  const handleViewDetails = (assignment) => {
    setSelectedAssignment(assignment);
  };

  const handleSubmitAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionModal(true);
    setSubmissionFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    setSubmissionFile(file);
  };

  const submitAssignment = async () => {
    if (!submissionFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('assignment_id', selectedAssignment.assignment_id);
      formData.append('file', submissionFile);

      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/student/submit/${selectedAssignment.assignment_id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Assignment submitted successfully!');
      setShowSubmissionModal(false);
      loadAssignments();
    } catch (error) {
      console.error('Failed to submit assignment:', error);
      alert('Failed to submit assignment: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'pending') return !assignment.is_submitted;
    if (filter === 'submitted') return assignment.is_submitted;
    return true;
  });

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
          <div className="navbar-brand">My Assignments</div>
          <div className="navbar-menu">
            <span>Welcome, {user?.name}</span>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>All Assignments</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'pending' ? 'btn-warning' : 'btn-outline'}`}
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button 
                  className={`btn btn-sm ${filter === 'submitted' ? 'btn-success' : 'btn-outline'}`}
                  onClick={() => setFilter('submitted')}
                >
                  Submitted
                </button>
              </div>
            </div>

            {filteredAssignments.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Subject</th>
                    <th>Faculty</th>
                    <th>Deadline</th>
                    <th>Total Marks</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssignments.map((assignment) => (
                    <tr key={assignment.assignment_id}>
                      <td>
                        <div>
                          <strong>{assignment.title}</strong>
                          <p style={{ fontSize: '0.875rem', color: '#718096', margin: '0.25rem 0 0 0' }}>
                            {assignment.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </td>
                      <td>{assignment.subject_name}</td>
                      <td>{assignment.faculty_name}</td>
                      <td>
                        <span style={{ color: new Date(assignment.deadline) < new Date() ? '#ef4444' : '#718096' }}>
                          {new Date(assignment.deadline).toLocaleDateString()}
                        </span>
                      </td>
                      <td>{assignment.total_marks || 'N/A'}</td>
                      <td>
                        <span className={`badge ${assignment.is_submitted ? 'badge-success' : 'badge-warning'}`}>
                          {assignment.is_submitted ? 'Submitted' : 'Pending'}
                        </span>
                      </td>
                      <td>
                        {assignment.is_submitted ? (
                          <span className="badge badge-success">Submitted</span>
                        ) : (
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => handleSubmitAssignment(assignment)}
                            disabled={new Date(assignment.deadline) < new Date()}
                          >
                            {new Date(assignment.deadline) < new Date() ? 'Expired' : 'Submit'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No assignments found</p>
            )}
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '600px', maxWidth: '90%' }}>
            <h3>Submit Assignment</h3>
            <div style={{ marginBottom: '1rem' }}>
              <p><strong>Title:</strong> {selectedAssignment.title}</p>
              <p><strong>Subject:</strong> {selectedAssignment.subject_name}</p>
              <p><strong>Deadline:</strong> {new Date(selectedAssignment.deadline).toLocaleString()}</p>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Upload File (Max 10MB)</label>
              <input 
                type="file" 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
              />
              {submissionFile && (
                <p style={{ marginTop: '0.5rem', color: '#059669' }}>Selected: {submissionFile.name}</p>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowSubmissionModal(false)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={submitAssignment}
                disabled={!submissionFile || submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
