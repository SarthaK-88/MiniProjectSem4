const { query, pool } = require('../config/database');

exports.sendMessage = async (req, res) => {
  try {
    const receiverId = req.body.receiver_id || req.body.receiverId;
    const content = req.body.message || req.body.content;
    const senderId = req.user.userId;

    if (!content && !req.file) {
      return res.status(400).json({ success: false, message: 'Message content or file is required' });
    }

    const filePath = req.file ? `/uploads/messages/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO messages (sender_id, receiver_id, group_id, message_text, file_path) VALUES (?, ?, ?, ?, ?)`,
      [senderId, receiverId || null, null, content || null, filePath]
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
      `SELECT m.message_id, m.sender_id, m.receiver_id, m.message_text as content, m.sent_at, m.message_type,
              s.name as sender_name, r.name as receiver_name 
       FROM messages m 
       JOIN users s ON m.sender_id = s.user_id 
       LEFT JOIN users r ON m.receiver_id = r.user_id 
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?) 
       ORDER BY m.sent_at ASC`,
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
        u.name as other_user_name
       FROM messages m
       JOIN users u ON (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END) = u.user_id
       WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.user_id != ?
       GROUP BY (CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END), u.name
       ORDER BY u.name`,
      [userId, userId, userId, userId, userId]
    );

    res.json({ success: true, data: conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};

// Get list of users the current user can chat with (faculty + students, excluding self)
exports.getChatUsers = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const role = req.user.role;

    let users;
    if (role === 'student') {
      users = await query(
        `SELECT u.user_id, u.name, u.role FROM users u
         WHERE u.role IN ('faculty', 'student') AND u.user_id != ? AND u.is_active = 1
         ORDER BY u.role DESC, u.name ASC`,
        [currentUserId]
      );
    } else {
      users = await query(
        `SELECT u.user_id, u.name, u.role FROM users u
         WHERE u.role IN ('faculty', 'student') AND u.user_id != ? AND u.is_active = 1
         ORDER BY u.role DESC, u.name ASC`,
        [currentUserId]
      );
    }

    res.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching chat users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};
