const { query, pool } = require('../config/database');

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, groupId } = req.body;
    const senderId = req.user.userId;

    if (!content && !req.file) {
      return res.status(400).json({ success: false, message: 'Message content or file is required' });
    }

    const fileUrl = req.file ? `/uploads/messages/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO messages (sender_id, receiver_id, group_id, content, file_url) VALUES (?, ?, ?, ?, ?)`,
      [senderId, receiverId || null, groupId || null, content || null, fileUrl]
    );

    res.json({ success: true, message: 'Message sent', data: { id: result.insertId } });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.userId;

    const messages = await query(
      `SELECT m.*, s.name as sender_name, r.name as receiver_name 
       FROM messages m 
       JOIN users s ON m.sender_id = s.user_id 
       LEFT JOIN users r ON m.receiver_id = r.user_id 
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) 
       ORDER BY m.sent_date ASC`,
      [currentUserId, userId, userId, currentUserId]
    );

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    const conversations = await query(
      `SELECT DISTINCT 
        CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END as other_user_id,
        u.name as other_user_name,
        (SELECT content FROM messages WHERE sender_id = ? AND receiver_id = other_user_id OR sender_id = other_user_id AND receiver_id = ? ORDER BY sent_date DESC LIMIT 1) as last_message,
        (SELECT sent_date FROM messages WHERE sender_id = ? AND receiver_id = other_user_id OR sender_id = other_user_id AND receiver_id = ? ORDER BY sent_date DESC LIMIT 1) as last_message_date
       FROM messages m
       JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = u.user_id
       WHERE m.sender_id = ? OR m.receiver_id = ?
       GROUP BY other_user_id
       ORDER BY last_message_date DESC`,
      [userId, userId, userId, userId, userId, userId, userId, userId]
    );

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};
