const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { uploadMaterial, getMaterialsBySubject, deleteMaterial } = require('../controllers/materialController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/materials/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'material-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|zip|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

router.post('/', authenticateToken, authorizeRole('faculty'), upload.single('file'), uploadMaterial);
router.get('/subject/:subjectId', authenticateToken, getMaterialsBySubject);
router.delete('/:id', authenticateToken, authorizeRole('faculty'), deleteMaterial);

module.exports = router;
