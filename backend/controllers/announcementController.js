const { query, pool } = require('../config/database');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, subjectId, priority, isPinned } = req.body;
    const facultyId = req.user.facultyId || req.user.userId;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const [result] = await pool.execute(
      `INSERT INTO announcements (faculty_id, subject_id, title, content, priority, is_pinned) VALUES (?, ?, ?, ?, ?, ?)`,
      [facultyId, subjectId || null, title, content, priority || 'medium', isPinned || false]
    );

    res.status(201).json({ success: true, message: 'Announcement created', data: { id: result.insertId } });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ success: false, message: 'Failed to create announcement' });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const { subjectId } = req.params;
    
    const announcements = await query(
      `SELECT a.*, f.name as faculty_name FROM announcements a 
       LEFT JOIN faculty fac ON a.faculty_id = fac.faculty_id 
       LEFT JOIN users f ON fac.user_id = f.user_id 
       ${subjectId ? 'WHERE a.subject_id = ?' : ''}
       ORDER BY a.is_pinned DESC, a.created_date DESC`,
      subjectId ? [subjectId] : []
    );

    res.json({ success: true, data: announcements });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch announcements' });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM announcements WHERE announcement_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ success: false, message: 'Failed to delete announcement' });
  }
};
