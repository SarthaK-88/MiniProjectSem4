const { query, pool } = require('../config/database');

exports.gradeSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { marksObtained, feedback } = req.body;
    const facultyId = req.user.facultyId;

    if (marksObtained === undefined || marksObtained === null) {
      return res.status(400).json({ success: false, message: 'Marks are required' });
    }

    await pool.execute(
      `UPDATE submissions SET marks_obtained = ?, feedback = ?, graded_by = ?, graded_date = NOW() WHERE submission_id = ?`,
      [marksObtained, feedback, facultyId, id]
    );

    res.json({ success: true, message: 'Submission graded successfully' });
  } catch (error) {
    console.error('Error grading submission:', error);
    res.status(500).json({ success: false, message: 'Failed to grade submission' });
  }
};

exports.getGrades = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const grades = await query(
      `SELECT s.submission_id, a.title as assignment_title, a.total_marks, s.marks_obtained, s.feedback, 
              sub.subject_name, f.name as faculty_name, s.graded_date
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.assignment_id
       JOIN subjects sub ON a.subject_id = sub.subject_id
       JOIN faculty fac ON a.faculty_id = fac.faculty_id
       JOIN users f ON fac.user_id = f.user_id
       WHERE s.student_id = ? AND s.marks_obtained IS NOT NULL
       ORDER BY s.graded_date DESC`,
      [studentId]
    );

    res.json({ success: true, data: grades });
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grades' });
  }
};
