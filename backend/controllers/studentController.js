const { query, queryOne } = require('../config/database');

// Get student dashboard data
exports.getDashboard = async (req, res) => {
  try {
    console.log('=== STUDENT DASHBOARD REQUEST ===');
    console.log('req.user:', JSON.stringify(req.user, null, 2));
    
    const studentId = req.user.studentId;
    console.log('Student ID from req.user:', studentId);

    if (!studentId) {
      console.log('ERROR: No studentId found in req.user!');
      return res.status(403).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Get attendance percentage
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

    // Get upcoming assignments
    const assignments = await query(
      `SELECT a.assignment_id, a.title, a.description, a.deadline, a.total_marks,
              s.subject_name, f.name as faculty_name,
              CASE WHEN sub.submission_id IS NOT NULL THEN true ELSE false END as is_submitted
       FROM assignments a
       JOIN subjects s ON a.subject_id = s.subject_id
       JOIN faculty f ON a.faculty_id = f.faculty_id
       LEFT JOIN submissions sub ON a.assignment_id = sub.assignment_id AND sub.student_id = ?
       WHERE a.deadline > NOW()
       ORDER BY a.deadline ASC
       LIMIT 5`,
      [studentId]
    );

    // Get recent announcements
    const announcements = await query(
      `SELECT announcement_id, title, content, priority, created_at, 
              CASE WHEN is_pinned = 1 THEN true ELSE false END as is_pinned
       FROM announcements
       WHERE target_audience IN ('all', 'students') OR target_audience = 'specific_department'
       ORDER BY is_pinned DESC, created_at DESC
       LIMIT 5`
    );

    // Get unread notifications count
    const notificationCount = await queryOne(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false`,
      [req.user.userId]
    );

    res.json({
      success: true,
      data: {
        attendance: attendanceData,
        assignments,
        announcements,
        unreadNotifications: notificationCount.count
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

// Get attendance details
exports.getAttendance = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const attendance = await query(
      `SELECT a.attendance_id, a.date, a.status, a.remarks,
              s.subject_name, u.name as faculty_name
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.subject_id
       JOIN faculty f ON a.marked_by = f.faculty_id
       JOIN users u ON f.user_id = u.user_id
       WHERE a.student_id = ?
       ORDER BY a.date DESC
       LIMIT 100`,
      [studentId]
    );

    // Calculate overall attendance percentage
    const summary = await queryOne(
      `SELECT 
              COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END) as present_days,
              COUNT(*) as total_days,
              ROUND((COUNT(CASE WHEN status IN ('present', 'late') THEN 1 END) * 100.0 / COUNT(*)), 2) as percentage
       FROM attendance
       WHERE student_id = ?`,
      [studentId]
    );

    res.json({
      success: true,
      data: {
        attendance,
        summary
      }
    });

  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
      error: error.message
    });
  }
};

// Get timetable
exports.getTimetable = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    // Get student's department and semester
    const student = await queryOne(
      'SELECT department_id, semester, section FROM students WHERE student_id = ?',
      [studentId]
    );

    const timetable = await query(
      `SELECT t.timetable_id, t.day_of_week, t.slot_number, t.start_time, t.end_time,
              t.room_number, s.subject_name, s.subject_code, u.name as faculty_name
       FROM timetable t
       JOIN subjects s ON t.subject_id = s.subject_id
       JOIN faculty f ON t.faculty_id = f.faculty_id
       JOIN users u ON f.user_id = u.user_id
       WHERE t.department_id = ? AND t.semester = ? AND t.section = ?
       ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), t.slot_number`,
      [student.department_id, student.semester, student.section]
    );

    res.json({
      success: true,
      data: timetable
    });

  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable',
      error: error.message
    });
  }
};

// Get all assignments
exports.getAssignments = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const assignments = await query(
      `SELECT a.assignment_id, a.title, a.description, a.instructions, a.deadline, 
              a.total_marks, a.file_path, a.created_at,
              s.subject_name, s.subject_code, u.name as faculty_name,
              sub.submission_id, sub.submitted_at, sub.grade, sub.feedback, sub.status as submission_status
       FROM assignments a
       JOIN subjects s ON a.subject_id = s.subject_id
       JOIN faculty f ON a.faculty_id = f.faculty_id
       JOIN users u ON f.user_id = u.user_id
       LEFT JOIN submissions sub ON a.assignment_id = sub.assignment_id AND sub.student_id = ?
       ORDER BY a.deadline DESC`,
      [studentId]
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

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const studentId = req.user.studentId;
    const { assignmentId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if already submitted
    const existing = await queryOne(
      'SELECT submission_id FROM submissions WHERE assignment_id = ? AND student_id = ?',
      [assignmentId, studentId]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assignment'
      });
    }

    // Insert submission
    const [result] = await query(
      `INSERT INTO submissions (assignment_id, student_id, file_path, original_filename, status)
       VALUES (?, ?, ?, ?, 'submitted')`,
      [assignmentId, studentId, file.path, file.originalname]
    );

    res.status(201).json({
      success: true,
      message: 'Assignment submitted successfully',
      data: { submissionId: result.insertId }
    });

  } catch (error) {
    console.error('Submit assignment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment',
      error: error.message
    });
  }
};

// Get study materials
exports.getMaterials = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const materials = await query(
      `SELECT sm.material_id, sm.title, sm.description, sm.file_path, sm.original_filename,
              sm.file_type, sm.uploaded_at, sm.download_count,
              s.subject_name, s.subject_code, u.name as faculty_name
       FROM study_materials sm
       JOIN subjects s ON sm.subject_id = s.subject_id
       JOIN faculty f ON sm.faculty_id = f.faculty_id
       JOIN users u ON f.user_id = u.user_id
       ORDER BY sm.uploaded_at DESC`,
      [studentId]
    );

    res.json({
      success: true,
      data: materials
    });

  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch study materials',
      error: error.message
    });
  }
};

// Get grades
exports.getGrades = async (req, res) => {
  try {
    const studentId = req.user.studentId;

    const grades = await query(
      `SELECT g.grade_id, g.subject_id, g.grade, g.gpa, g.semester, g.academic_year, g.remarks,
              s.subject_name, s.subject_code
       FROM grades g
       JOIN subjects s ON g.subject_id = s.subject_id
       WHERE g.student_id = ?
       ORDER BY g.semester DESC, g.academic_year DESC`,
      [studentId]
    );

    res.json({
      success: true,
      data: grades
    });

  } catch (error) {
    console.error('Get grades error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch grades',
      error: error.message
    });
  }
};

module.exports = exports;
