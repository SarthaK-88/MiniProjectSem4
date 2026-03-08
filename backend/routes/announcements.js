const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, deleteAnnouncement } = require('../controllers/announcementController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRole('faculty'), createAnnouncement);
router.get('/subject/:subjectId', authenticateToken, getAnnouncements);
router.delete('/:id', authenticateToken, authorizeRole('faculty'), deleteAnnouncement);

module.exports = router;
