const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// List departments and subjects
router.get('/departments', adminController.getDepartments);
router.get('/subjects', adminController.getSubjects);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/student', adminController.addStudent);
router.delete('/student/:id', adminController.removeStudent);
router.post('/faculty', adminController.addFaculty);
router.delete('/faculty/:id', adminController.removeFaculty);

// Department & Subject Management
router.post('/department', adminController.createDepartment);
router.post('/subject', adminController.createSubject);
router.post('/assign', adminController.assignFacultyToSubject);

// Reports & Logs
router.get('/reports', adminController.generateReport);
router.get('/logs', adminController.getActivityLogs);

module.exports = router;
