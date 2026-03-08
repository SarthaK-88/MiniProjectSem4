const { query, queryOne } = require('../config/database');

// Get faculty dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;

    // Get today's classes
    const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const classes = await query(
      `SELECT t.timetable_id, t.start_time, t.end_time, t.room_number,
              s.subject_name, s.subject_code,
              d.dept_name, sem.semester, sem.section
       FROM timetable t
       JOIN subjects s ON t.subject_id = s.subject_id
       JOIN departments d ON t.department_id = d.dept_id
       LEFT JOIN (SELECT DISTINCT department_id, semester, section FROM students) sem 
         ON t.department_id = sem.department_id AND t.semester = sem.semester
       WHERE t.faculty_id = ? AND t.day_of_week = ?
       ORDER BY t.slot_number`,
      [facultyId, dayName]
    );

    // Get pending submissions count
    const pendingSubmissions = await query(
      `SELECT COUNT(*) as count
       FROM assignments a
       LEFT JOIN submissions s ON a.assignment_id = s.assignment_id
       WHERE a.faculty_id = ? AND s.submission_id IS NOT NULL AND s.status != 'graded'`,
      [facultyId]
    );

    // Get attendance statistics for faculty's subjects
    const attendanceStats = await query(
      `SELECT s.subject_name,
              ROUND((COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / COUNT(*)), 2) as avg_attendance
       FROM subjects s
       JOIN subject_faculty sf ON s.subject_id = sf.subject_id
       LEFT JOIN attendance a ON s.subject_id = a.subject_id
       WHERE sf.faculty_id = ?
       GROUP BY s.subject_id, s.subject_name`,
      [facultyId]
    );

    // Get recent announcements created by faculty
    const announcements = await query(
      `SELECT announcement_id, title, content, priority, created_at
       FROM announcements
       WHERE created_by = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [req.user.userId]
    );

    res.json({
      success: true,
      data: {
        classes,
        pendingSubmissions: pendingSubmissions[0].count,
        attendanceStats,
        announcements
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;
    const { subjectId, studentIds, date, status, remarks } = req.body;

    if (!subjectId || !studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID and array of student IDs are required'
      });
    }

    const attendanceDate = date || new Date();

    // Insert attendance records
    const values = studentIds.map(studentId => [
      studentId,
      subjectId,
      attendanceDate,
      status || 'present',
      remarks || null,
      facultyId
    ]);

    await query(
      `INSERT INTO attendance (student_id, subject_id, date, status, remarks, marked_by)
       VALUES ?
       ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)`,
      [values]
    );

    res.json({
      success: true,
      message: `Attendance marked for ${studentIds.length} student(s)`
    });

  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// Get students list for faculty's subjects
exports.getStudents = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;

    const students = await query(
      `SELECT DISTINCT s.student_id, u.name, u.email, u.phone, u.profile_image,
              s.roll_number, s.semester, s.section, s.enrollment_year,
              d.dept_name
       FROM students s
       JOIN users u ON s.user_id = u.user_id
       JOIN departments d ON s.department_id = d.dept_id
       JOIN subject_students ss ON s.student_id = ss.student_id
       JOIN subject_faculty sf ON ss.subject_id = sf.subject_id
       WHERE sf.faculty_id = ?
       ORDER BY s.semester, s.roll_number`,
      [facultyId]
    );

    res.json({
      success: true,
      data: students
    });

  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

// Create assignment
exports.createAssignment = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;
    const { subjectId, title, description, instructions, deadline, totalMarks } = req.body;

    if (!subjectId || !title || !description || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID, title, description, and deadline are required'
      });
    }

    const file = req.file;
    const filePath = file ? file.path : null;

    const [result] = await query(
      `INSERT INTO assignments (subject_id, faculty_id, title, description, instructions, deadline, total_marks, file_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [subjectId, facultyId, title, description, instructions, deadline, totalMarks || 100, filePath]
    );

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: { assignmentId: result.insertId }
    });

  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment',
      error: error.message
    });
  }
};

// Get assignments created by faculty
exports.getAssignments = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;

    const assignments = await query(
      `SELECT a.assignment_id, a.title, a.description, a.deadline, a.total_marks,
              a.created_at, s.subject_name, s.subject_code,
              COUNT(sub.submission_id) as submission_count,
              SUM(CASE WHEN sub.status = 'graded' THEN 1 ELSE 0 END) as graded_count
       FROM assignments a
       JOIN subjects s ON a.subject_id = s.subject_id
       LEFT JOIN submissions sub ON a.assignment_id = sub.assignment_id
       WHERE a.faculty_id = ?
       GROUP BY a.assignment_id
       ORDER BY a.created_at DESC`,
      [facultyId]
    );

    res.json({
      success: true,
      data: assignments
    });

  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments',
      error: error.message
    });
  }
};

// Get submissions for an assignment
exports.getSubmissions = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const submissions = await query(
      `SELECT sub.submission_id, sub.file_path, sub.original_filename, sub.submitted_at,
              sub.grade, sub.feedback, sub.status,
              s.student_id, u.name as student_name, u.email, s.roll_number
       FROM submissions sub
       JOIN students s ON sub.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       WHERE sub.assignment_id = ?
       ORDER BY sub.submitted_at DESC`,
      [assignmentId]
    );

    res.json({
      success: true,
      data: submissions
    });

  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
};

// Grade submission
exports.gradeSubmission = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;
    const { submissionId, grade, feedback } = req.body;

    if (!submissionId || grade === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Submission ID and grade are required'
      });
    }

    await query(
      `UPDATE submissions 
       SET grade = ?, feedback = ?, status = 'graded', graded_at = NOW(), graded_by = ?
       WHERE submission_id = ?`,
      [grade, feedback, facultyId, submissionId]
    );

    res.json({
      success: true,
      message: 'Submission graded successfully'
    });

  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grade submission',
      error: error.message
    });
  }
};

// Upload study material
exports.uploadMaterial = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;
    const { subjectId, title, description } = req.body;
    const file = req.file;

    if (!file || !subjectId || !title) {
      return res.status(400).json({
        success: false,
        message: 'File, subject ID, and title are required'
      });
    }

    const [result] = await query(
      `INSERT INTO study_materials (subject_id, faculty_id, title, description, file_path, original_filename, file_type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [subjectId, facultyId, title, description, file.path, file.originalname, file.mimetype]
    );

    res.status(201).json({
      success: true,
      message: 'Study material uploaded successfully',
      data: { materialId: result.insertId }
    });

  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload study material',
      error: error.message
    });
  }
};

// Create announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, content, targetAudience, priority, expiresAt } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const [result] = await query(
      `INSERT INTO announcements (title, content, created_by, target_audience, priority, expires_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, content, userId, targetAudience || 'all', priority || 'medium', expiresAt]
    );

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { announcementId: result.insertId }
    });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create announcement',
      error: error.message
    });
  }
};

module.exports = exports;
