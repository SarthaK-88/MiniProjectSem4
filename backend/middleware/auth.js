const jwt = require('jsonwebtoken');
const { queryOne, pool } = require('../config/database');

// Verify JWT Token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verify user still exists and is active
    const [rows] = await pool.execute(
      `SELECT u.user_id, u.email, u.role, u.is_active,
              s.student_id, s.department_id as department_id, s.semester, s.roll_number,
              f.faculty_id, f.employee_id
       FROM users u
       LEFT JOIN students s ON u.user_id = s.user_id
       LEFT JOIN faculty f ON u.user_id = f.user_id
       WHERE u.user_id = ?`,
      [decoded.userId]
    );
    
    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated.'
      });
    }

    req.user = {
      userId: user.user_id,
      email: user.email,
      role: user.role
    };

    // Add role-specific data
    if (user.role === 'student' && user.student_id) {
      req.user.studentId = user.student_id;
      req.user.departmentId = user.department_id;
      req.user.semester = user.semester;
      req.user.rollNumber = user.roll_number;
    } else if (user.role === 'faculty' && user.faculty_id) {
      req.user.facultyId = user.faculty_id;
      req.user.departmentId = user.department_id;
      req.user.employeeId = user.employee_id;
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Authentication failed.',
      error: error.message
    });
  }
};

// Role-based authorization middleware
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Insufficient permissions'
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await queryOne(
        'SELECT user_id, email, role FROM users WHERE user_id = ?',
        [decoded.userId]
      );
      
      if (user) {
        req.user = {
          userId: user.user_id,
          email: user.email,
          role: user.role
        };
      }
    }
    next();
  } catch (error) {
    next(); // Continue without authentication
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  optionalAuth
};
