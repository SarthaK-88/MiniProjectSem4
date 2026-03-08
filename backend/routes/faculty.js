const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/facultyController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// All routes are protected and require faculty role
router.use(authenticateToken);
router.use(authorizeRole('faculty'));

// Dashboard
router.get('/dashboard', facultyController.getDashboard);

// Attendance
router.post('/attendance', facultyController.markAttendance);

// Students
router.get('/students', facultyController.getStudents);

// Assignments
router.get('/assignments', facultyController.getAssignments);
router.post('/assignment', upload.single('file'), handleMulterError, facultyController.createAssignment);
router.get('/submissions/:assignmentId', facultyController.getSubmissions);
router.put('/grade', facultyController.gradeSubmission);

// Study Materials
router.post('/material', upload.single('file'), handleMulterError, facultyController.uploadMaterial);

// Announcements
router.post('/announcement', facultyController.createAnnouncement);

module.exports = router;
