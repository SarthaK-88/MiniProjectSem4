const { query, queryOne } = require('../config/database');

// Get admin dashboard statistics
exports.getDashboard = async (req, res) => {
  try {
    // Total counts
    const totalStudents = await queryOne('SELECT COUNT(*) as count FROM students');
    const totalFaculty = await queryOne('SELECT COUNT(*) as count FROM faculty');
    const totalUsers = await queryOne('SELECT COUNT(*) as count FROM users');
    const totalDepartments = await queryOne('SELECT COUNT(*) as count FROM departments');

    // Today's activity
    const todayLogins = await queryOne(
      `SELECT COUNT(*) as count FROM users 
       WHERE DATE(last_login) = CURDATE()`
    );

    const todayAttendance = await queryOne(
      `SELECT COUNT(*) as count FROM attendance WHERE DATE(date) = CURDATE()`
    );

    const todaySubmissions = await queryOne(
      `SELECT COUNT(*) as count FROM submissions WHERE DATE(submitted_at) = CURDATE()`
    );

    // Recent activity logs
    const recentLogs = await query(
      `SELECT al.log_id, al.action, al.entity_type, al.details, al.created_at,
              u.name as user_name, u.role
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.user_id
       ORDER BY al.created_at DESC
       LIMIT 10`
    );

    // Department-wise student count
    const deptStats = await query(
      `SELECT d.dept_name, COUNT(s.student_id) as student_count
       FROM departments d
       LEFT JOIN students s ON d.dept_id = s.department_id
       GROUP BY d.dept_id, d.dept_name`
    );

    res.json({
      success: true,
      data: {
        overview: {
          totalStudents: totalStudents?.count ?? 0,
          totalFaculty: totalFaculty?.count ?? 0,
          totalUsers: totalUsers?.count ?? 0,
          totalDepartments: totalDepartments?.count ?? 0
        },
        todayActivity: {
          logins: todayLogins?.count ?? 0,
          attendanceMarked: todayAttendance?.count ?? 0,
          submissions: todaySubmissions?.count ?? 0
        },
        recentLogs,
        departmentStats: deptStats
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

// Add new student
exports.addStudent = async (req, res) => {
  try {
    const { name, email, password, phone, departmentId, semester, rollNumber, section, parentName, parentPhone } = req.body;

    if (!name || !email || !password || !departmentId || !semester || !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    // Check if email exists
    const existing = await queryOne('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert student
    const result = await query(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'student', ?)`,
      [name, email, hashedPassword, phone]
    );

    const userId = result[0].insertId;

    await query(
      `INSERT INTO students (user_id, department_id, semester, roll_number, section, parent_name, parent_phone, enrollment_year)
       VALUES (?, ?, ?, ?, ?, ?, ?, YEAR(CURDATE()))`,
      [userId, departmentId, semester, rollNumber, section || 'A', parentName, parentPhone]
    );

    res.status(201).json({
      success: true,
      message: 'Student added successfully'
    });

  } catch (error) {
    console.error('Add student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add student',
      error: error.message
    });
  }
};

// Remove student
exports.removeStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM users WHERE user_id = ?', [id]);

    res.json({
      success: true,
      message: 'Student removed successfully'
    });

  } catch (error) {
    console.error('Remove student error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove student',
      error: error.message
    });
  }
};

// Add new faculty
exports.addFaculty = async (req, res) => {
  try {
    const { name, email, password, phone, departmentId, employeeId, designation, specialization, qualification } = req.body;

    if (!name || !email || !password || !departmentId || !employeeId) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    const existing = await queryOne('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, 'faculty', ?)`,
      [name, email, hashedPassword, phone]
    );

    const userId = result[0].insertId;

    await query(
      `INSERT INTO faculty (user_id, department_id, employee_id, designation, specialization, qualification)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, departmentId, employeeId, designation, specialization, qualification]
    );

    res.status(201).json({
      success: true,
      message: 'Faculty added successfully'
    });

  } catch (error) {
    console.error('Add faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add faculty',
      error: error.message
    });
  }
};

// Remove faculty
exports.removeFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM users WHERE user_id = ?', [id]);

    res.json({
      success: true,
      message: 'Faculty removed successfully'
    });

  } catch (error) {
    console.error('Remove faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove faculty',
      error: error.message
    });
  }
};

// Create department
exports.createDepartment = async (req, res) => {
  try {
    const { deptName, deptCode, description } = req.body;

    if (!deptName || !deptCode) {
      return res.status(400).json({
        success: false,
        message: 'Department name and code are required'
      });
    }

    await query(
      'INSERT INTO departments (dept_name, dept_code, description) VALUES (?, ?, ?)',
      [deptName, deptCode, description]
    );

    res.status(201).json({
      success: true,
      message: 'Department created successfully'
    });

  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create department',
      error: error.message
    });
  }
};

// Create subject
exports.createSubject = async (req, res) => {
  try {
    const { subjectCode, subjectName, departmentId, semester, credits, description } = req.body;

    if (!subjectCode || !subjectName || !departmentId || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Required fields missing'
      });
    }

    await query(
      `INSERT INTO subjects (subject_code, subject_name, department_id, semester, credits, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [subjectCode, subjectName, departmentId, semester, credits || 3, description]
    );

    res.status(201).json({
      success: true,
      message: 'Subject created successfully'
    });

  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subject',
      error: error.message
    });
  }
};

// Assign faculty to subject
exports.assignFacultyToSubject = async (req, res) => {
  try {
    const { subjectId, facultyId, academicYear } = req.body;

    if (!subjectId || !facultyId) {
      return res.status(400).json({
        success: false,
        message: 'Subject ID and faculty ID are required'
      });
    }

    const year = academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`;

    await query(
      'INSERT INTO subject_faculty (subject_id, faculty_id, academic_year) VALUES (?, ?, ?)',
      [subjectId, facultyId, year]
    );

    res.status(201).json({
      success: true,
      message: 'Faculty assigned to subject successfully'
    });

  } catch (error) {
    console.error('Assign faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign faculty',
      error: error.message
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;

    let queryStr = `
      SELECT u.user_id, u.name, u.email, u.role, u.phone, u.is_active, u.created_at,
             s.student_id, s.roll_number, s.semester,
             f.faculty_id, f.employee_id, f.designation
      FROM users u
      LEFT JOIN students s ON u.user_id = s.user_id
      LEFT JOIN faculty f ON u.user_id = f.user_id
    `;

    if (role) {
      queryStr += ' WHERE u.role = ?';
      const users = await query(queryStr, [role]);
      return res.json({ success: true, data: users });
    }

    const users = await query(queryStr);
    res.json({ success: true, data: users });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get all departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await query(
      'SELECT dept_id, dept_name, dept_code, description, created_at FROM departments ORDER BY dept_name'
    );
    res.json({ success: true, data: departments });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch departments' });
  }
};

// Get all subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await query(
      `SELECT s.subject_id, s.subject_code, s.subject_name, s.semester, s.credits, s.description,
              d.dept_name, d.dept_code
       FROM subjects s
       JOIN departments d ON s.department_id = d.dept_id
       ORDER BY d.dept_name, s.semester, s.subject_code`
    );
    res.json({ success: true, data: subjects });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch subjects' });
  }
};

// Get activity logs
exports.getActivityLogs = async (req, res) => {
  try {
    const logs = await query(
      `SELECT al.log_id, al.action, al.entity_type, al.entity_id, al.details,
              al.created_at, u.name as user_name, u.role
       FROM activity_logs al
       LEFT JOIN users u ON al.user_id = u.user_id
       ORDER BY al.created_at DESC
       LIMIT 100`
    );
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch activity logs' });
  }
};

// Generate reports
exports.generateReport = async (req, res) => {
  try {
    const { type, departmentId, semester, startDate, endDate } = req.query;

    let reportData = {};

    if (type === 'attendance') {
      reportData.attendance = await query(
        `SELECT s.student_id, u.name, s.roll_number,
                COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) as present_days,
                COUNT(*) as total_days,
                ROUND((COUNT(CASE WHEN a.status IN ('present', 'late') THEN 1 END) * 100.0 / COUNT(*)), 2) as percentage
         FROM students s
         JOIN users u ON s.user_id = u.user_id
         LEFT JOIN attendance a ON s.student_id = a.student_id
         WHERE (? IS NULL OR s.department_id = ?)
           AND (? IS NULL OR s.semester = ?)
           AND (? IS NULL OR a.date >= ?)
           AND (? IS NULL OR a.date <= ?)
         GROUP BY s.student_id, u.name, s.roll_number`,
        [departmentId, departmentId, semester, semester, startDate, startDate, endDate, endDate]
      );
    }

    res.json({
      success: true,
      data: reportData
    });

  } catch (error) {
    console.error('Generate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

module.exports = exports;
