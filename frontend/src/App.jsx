import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentAssignments from './pages/student/Assignments';
import StudentMaterials from './pages/student/Materials';
import StudentGrades from './pages/student/Grades';
import StudentMessages from './pages/student/Messages';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyAssignments from './pages/faculty/Assignments';
import FacultyMaterials from './pages/faculty/Materials';
import FacultyAnnouncements from './pages/faculty/Announcements';
import FacultyMessages from './pages/faculty/Messages';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
import AdminSubjects from './pages/admin/Subjects';
import AdminReports from './pages/admin/Reports';
import AdminLogs from './pages/admin/Logs';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes - Student */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/attendance" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/assignments" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentAssignments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/materials" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMaterials />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/grades" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentGrades />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/messages" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentMessages />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Faculty */}
          <Route 
            path="/faculty/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty/attendance" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty/assignments" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyAssignments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty/materials" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyMaterials />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty/announcements" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyAnnouncements />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty/messages" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyMessages />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected Routes - Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/departments" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDepartments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/subjects" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSubjects />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/logs" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLogs />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
