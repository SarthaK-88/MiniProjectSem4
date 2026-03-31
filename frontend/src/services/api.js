import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

// Student APIs
export const studentAPI = {
  getDashboard: () => api.get('/student/dashboard'),
  getAttendance: () => api.get('/student/attendance'),
  getTimetable: () => api.get('/student/timetable'),
  getAssignments: () => api.get('/student/assignments'),
  submitAssignment: (assignmentId, formData) => 
    api.post(`/student/submit/${assignmentId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getMaterials: () => api.get('/student/materials'),
  getGrades: () => api.get('/student/grades')
};

// Faculty APIs
export const facultyAPI = {
  getDashboard: () => api.get('/faculty/dashboard'),
  markAttendance: (data) => api.post('/faculty/attendance', data),
  getStudents: () => api.get('/faculty/students'),
  getSubjects: () => api.get('/faculty/subjects'),
  getAssignments: () => api.get('/faculty/assignments'),
  createAssignment: (formData) => 
    api.post('/faculty/assignment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getSubmissions: (assignmentId) => api.get(`/faculty/submissions/${assignmentId}`),
  gradeSubmission: (data) => api.put('/faculty/grade', data),
  getMaterials: () => api.get('/faculty/materials'),
  uploadMaterial: (formData) => 
    api.post('/faculty/material', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  createAnnouncement: (data) => api.post('/faculty/announcement', data)
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getDepartments: () => api.get('/admin/departments'),
  getSubjects: () => api.get('/admin/subjects'),
  getAllUsers: (role) => api.get(`/admin/users${role ? `?role=${role}` : ''}`),
  addStudent: (data) => api.post('/admin/student', data),
  removeStudent: (id) => api.delete(`/admin/student/${id}`),
  addFaculty: (data) => api.post('/admin/faculty', data),
  removeFaculty: (id) => api.delete(`/admin/faculty/${id}`),
  createDepartment: (data) => api.post('/admin/department', data),
  createSubject: (data) => api.post('/admin/subject', data),
  assignFacultyToSubject: (data) => api.post('/admin/assign', data),
  getActivityLogs: () => api.get('/admin/logs'),
  generateReport: (params) => api.get('/admin/reports', { params })
};

// Message APIs
export const messageAPI = {
  getConversations: () => api.get('/messages/conversations'),
  getChatHistory: (otherUserId) => api.get(`/messages/chat/${otherUserId}`),
  sendMessage: (data) => api.post('/messages/send', data),
  sendGroupMessage: (data) => api.post('/messages/group/send', data),
  getGroupMessages: (groupId) => api.get(`/messages/groups/${groupId}/messages`),
  getUserGroups: () => api.get('/messages/groups'),
  getNewMessages: (lastMessageTime) => api.get('/messages/new', { params: { lastMessageTime } })
};

export default api;
