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
      `UPDATE submissions SET grade = ?, feedback = ?, graded_by = ?, graded_at = NOW() WHERE submission_id = ?`,
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
      `SELECT s.submission_id as grade_id, a.title as assignment_title, a.total_marks, 
              s.grade as marks_obtained, s.feedback, 
              sub.subject_name, f.name as faculty_name, s.graded_at as graded_date,
              ROUND((s.grade * 100.0 / NULLIF(a.total_marks, 0)), 2) as percentage
       FROM submissions s
       JOIN assignments a ON s.assignment_id = a.assignment_id
       JOIN subjects sub ON a.subject_id = sub.subject_id
       JOIN faculty fac ON a.faculty_id = fac.faculty_id
       JOIN users f ON fac.user_id = f.user_id
       WHERE s.student_id = ? AND s.grade IS NOT NULL
       ORDER BY s.graded_at DESC`,
      [studentId]
    );

    const data = grades.map(g => ({
      ...g,
      assessment_type: g.assignment_title,
      percentage: g.percentage != null ? g.percentage : (g.total_marks ? Math.round((g.marks_obtained / g.total_marks) * 1000) / 10 : 0)
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching grades:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch grades' });
  }
};
