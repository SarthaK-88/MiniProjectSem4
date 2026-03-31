const { query, pool } = require('../config/database');

exports.uploadMaterial = async (req, res) => {
  try {
    const { title, description, subjectId } = req.body;
    const facultyId = req.user.facultyId;

    if (!title || !subjectId || !req.file) {
      return res.status(400).json({ success: false, message: 'Title, subject and file are required' });
    }

    const filePath = `/uploads/materials/${req.file.filename}`;

    const [result] = await pool.execute(
      `INSERT INTO study_materials (faculty_id, subject_id, title, description, file_path) VALUES (?, ?, ?, ?, ?)`,
      [facultyId, subjectId, title, description, filePath]
    );

    res.status(201).json({ success: true, message: 'Material uploaded', data: { id: result.insertId, fileUrl } });
  } catch (error) {
    console.error('Error uploading material:', error);
    res.status(500).json({ success: false, message: 'Failed to upload material' });
  }
};

exports.getMaterialsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const materials = await query(
      `SELECT m.*, f.name as faculty_name FROM study_materials m 
       JOIN faculty fac ON m.faculty_id = fac.faculty_id 
       JOIN users f ON fac.user_id = f.user_id 
       WHERE m.subject_id = ? ORDER BY m.uploaded_at DESC`,
      [subjectId]
    );

    res.json({ success: true, data: materials });
  } catch (error) {
    console.error('Error fetching materials:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch materials' });
  }
};

exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM study_materials WHERE material_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }

    res.json({ success: true, message: 'Material deleted' });
  } catch (error) {
    console.error('Error deleting material:', error);
    res.status(500).json({ success: false, message: 'Failed to delete material' });
  }
};
