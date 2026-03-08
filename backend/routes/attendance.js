const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceBySubject, getStudentAttendance } = require('../controllers/attendanceController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Faculty routes
router.post('/mark', authenticateToken, authorizeRole('faculty'), markAttendance);
router.get('/subject/:subjectId', authenticateToken, authorizeRole('faculty'), getAttendanceBySubject);

// Student routes
router.get('/my-attendance', authenticateToken, authorizeRole('student'), getStudentAttendance);

module.exports = router;
