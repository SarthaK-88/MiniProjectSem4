const express = require('express');
const router = express.Router();
const { gradeSubmission, getGrades } = require('../controllers/gradeController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.put('/submission/:id/grade', authenticateToken, authorizeRole('faculty'), gradeSubmission);
router.get('/my-grades', authenticateToken, authorizeRole('student'), getGrades);

module.exports = router;
