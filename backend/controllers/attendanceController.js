const { query, pool } = require('../config/database');

// Mark attendance for students
exports.markAttendance = async (req, res) => {
  try {
    const { subjectId, date, studentIds } = req.body;
    const facultyId = req.user.facultyId;

    if (!subjectId || !date || !studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID, date, and student IDs array are required'
      });
    }

    // Verify faculty teaches this subject
    const [facultySubjects] = await pool.execute(
      'SELECT * FROM faculty_subjects WHERE faculty_id = ? AND subject_id = ?',
      [facultyId, subjectId]
    );

    if (facultySubjects.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to mark attendance for this subject'
      });
    }

    // Insert attendance records
    const attendanceRecords = studentIds.map(studentId => ({
      student_id: studentId,
      subject_id: subjectId,
      date: date,
      status: 'present'
    }));

    // Use INSERT ... ON DUPLICATE KEY UPDATE to handle existing records
    for (const record of attendanceRecords) {
      await pool.execute(
        `INSERT INTO attendance (student_id, subject_id, date, status, marked_by) 
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE status = VALUES(status)`,
        [record.student_id, record.subject_id, record.date, record.status, facultyId]
      );
    }

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        count: studentIds.length,
        date: date,
        subjectId: subjectId
      }
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    console.error('Error details:', error.message);
    console.error('SQL error:', error.sql);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// Get attendance by subject for faculty
exports.getAttendanceBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { date } = req.query;

    const attendanceData = await query(
      `SELECT s.student_id, s.roll_number, u.name, a.status, a.date
       FROM students s
       JOIN users u ON s.user_id = u.user_id
       LEFT JOIN attendance a ON s.student_id = a.student_id AND a.subject_id = ? ${date ? 'AND a.date = ?' : ''}
       WHERE s.department_id IN (
         SELECT department_id FROM subjects WHERE subject_id = ?
       )
       ORDER BY s.roll_number`,
      date ? [subjectId, date, subjectId] : [subjectId, subjectId]
    );

    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance'
    });
  }
};

// Get student's own attendance
exports.getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const attendanceData = await query(
      `SELECT s.subject_name, 
              COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) as present_count,
              COUNT(*) as total_count,
              ROUND((COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / COUNT(*)), 2) as percentage
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.subject_id
       WHERE a.student_id = ?
       GROUP BY s.subject_id, s.subject_name`,
      [studentId]
    );

    res.json({
      success: true,
      data: attendanceData
    });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance'
    });
  }
};
