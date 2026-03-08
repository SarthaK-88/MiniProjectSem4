const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  createAssignment, 
  getAssignmentsByFaculty, 
  getAssignmentById, 
  updateAssignment, 
  deleteAssignment,
  submitAssignment,
  getSubmissions 
} = require('../controllers/assignmentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/assignments/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'assignment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|zip|rar/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only documents and archives are allowed.'));
    }
  }
});

// Faculty routes
router.post('/', authenticateToken, authorizeRole('faculty'), upload.single('resource'), createAssignment);
router.get('/my', authenticateToken, authorizeRole('faculty'), getAssignmentsByFaculty);
router.put('/:id', authenticateToken, authorizeRole('faculty'), upload.single('resource'), updateAssignment);
router.delete('/:id', authenticateToken, authorizeRole('faculty'), deleteAssignment);
router.get('/:id/submissions', authenticateToken, authorizeRole('faculty'), getSubmissions);

// Student routes
router.get('/', authenticateToken, authorizeRole('student'), getAssignmentById);
router.post('/:id/submit', authenticateToken, authorizeRole('student'), upload.single('file'), submitAssignment);

module.exports = router;
