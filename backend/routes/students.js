const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// All routes are protected and require student role
router.use(authenticateToken);
router.use(authorizeRole('student'));

// Dashboard
router.get('/dashboard', studentController.getDashboard);

// Attendance
router.get('/attendance', studentController.getAttendance);

// Timetable
router.get('/timetable', studentController.getTimetable);

// Assignments
router.get('/assignments', studentController.getAssignments);
router.post('/submit/:assignmentId', upload.single('file'), handleMulterError, studentController.submitAssignment);

// Study Materials
router.get('/materials', studentController.getMaterials);

// Grades
router.get('/grades', studentController.getGrades);

module.exports = router;
