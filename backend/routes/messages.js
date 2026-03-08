const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { authenticateToken } = require('../middleware/auth');

router.post('/send', authenticateToken, sendMessage);
router.get('/conversations', authenticateToken, getConversations);
router.get('/:userId', authenticateToken, getMessages);

module.exports = router;
