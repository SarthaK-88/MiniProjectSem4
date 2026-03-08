const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query, queryOne, transaction, pool } = require('../config/database');

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// User Registration
exports.signup = async (req, res) => {
  const { name, email, password, role, phone, departmentId, semester, rollNumber, employeeId } = req.body;

  try {
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, password, and role are required'
      });
    }

    // Validate role
    if (!['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be student, faculty, or admin'
      });
    }

    // Check if user already exists
    const existingUser = await queryOne(
      'SELECT user_id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user based on role
    let result;
    
    if (role === 'student') {
      if (!departmentId || !semester || !rollNumber) {
        return res.status(400).json({
          success: false,
          message: 'Department, semester, and roll number are required for students'
        });
      }

      result = await transaction(async (connection) => {
        // Insert into users table
        const [userResult] = await connection.execute(
          `INSERT INTO users (name, email, password, role, phone) 
           VALUES (?, ?, ?, ?, ?)`,
          [name, email, hashedPassword, role, phone]
        );

        const userId = userResult.insertId;

        // Insert into students table
        await connection.execute(
          `INSERT INTO students (user_id, department_id, semester, roll_number, enrollment_year) 
           VALUES (?, ?, ?, ?, YEAR(CURDATE()))`,
          [userId, departmentId, semester, rollNumber]
        );

        return { userId, role };
      });
    } else if (role === 'faculty') {
      if (!departmentId || !employeeId) {
        return res.status(400).json({
          success: false,
          message: 'Department and employee ID are required for faculty'
        });
      }

      result = await transaction(async (connection) => {
        const [userResult] = await connection.execute(
          `INSERT INTO users (name, email, password, role, phone) 
           VALUES (?, ?, ?, ?, ?)`,
          [name, email, hashedPassword, role, phone]
        );

        const userId = userResult.insertId;

        await connection.execute(
          `INSERT INTO faculty (user_id, department_id, employee_id) 
           VALUES (?, ?, ?)`,
          [userId, departmentId, employeeId]
        );

        return { userId, role };
      });
    } else {
      // Admin - only insert in users table
      const [userResult] = await query(
        `INSERT INTO users (name, email, password, role, phone) 
         VALUES (?, ?, ?, ?, ?)`,
        [name, email, hashedPassword, role, phone]
      );

      result = { userId: userResult.insertId, role };
    }

    // Generate token
    const token = generateToken(result.userId, result.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: result.userId,
          name,
          email,
          role: result.role
        }
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log('=== LOGIN ATTEMPT ===');
  console.log('Email:', email);
  console.log('Password provided:', password ? 'Yes' : 'No');

  try {
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Get user with role-specific data
    const [userRows] = await pool.execute(
      `SELECT u.user_id, u.name, u.email, u.password, u.role, u.is_active, u.profile_image,
              s.student_id, s.department_id as student_dept, s.semester, s.roll_number,
              f.faculty_id, f.department_id as faculty_dept, f.employee_id, f.designation
       FROM users u
       LEFT JOIN students s ON u.user_id = s.user_id
       LEFT JOIN faculty f ON u.user_id = f.user_id
       WHERE u.email = ?`,
      [email]
    );
    
    const user = userRows && userRows.length > 0 ? userRows[0] : null;

    console.log('User found:', user ? 'Yes' : 'No');
    console.log('Full user object:', JSON.stringify(user, null, 2));
    
    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('User is_active value:', user.is_active, 'Type:', typeof user.is_active);

    // Check if user is active
    if (!user.is_active) {
      console.log('Account deactivated for:', email);
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Contact admin.'
      });
    }

    // Verify password
    console.log('Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = NOW() WHERE user_id = ?',
      [user.user_id]
    );

    // Generate token
    const token = generateToken(user.user_id, user.role);

    // Prepare user data based on role
    let userData = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profile_image
    };

    if (user.role === 'student') {
      userData = {
        ...userData,
        studentId: user.student_id,
        departmentId: user.student_dept,
        semester: user.semester,
        rollNumber: user.roll_number
      };
    } else if (user.role === 'faculty') {
      userData = {
        ...userData,
        facultyId: user.faculty_id,
        departmentId: user.faculty_dept,
        employeeId: user.employee_id,
        designation: user.designation
      };
    }

    console.log('Login successful, userData:', JSON.stringify(userData, null, 2));

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userData
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await queryOne(
      `SELECT u.user_id, u.name, u.email, u.role, u.phone, u.profile_image, u.created_at,
              s.student_id, s.department_id as student_dept, s.semester, s.roll_number, s.section,
              f.faculty_id, f.department_id as faculty_dept, f.employee_id, f.designation, f.specialization
       FROM users u
       LEFT JOIN students s ON u.user_id = s.user_id
       LEFT JOIN faculty f ON u.user_id = f.user_id
       WHERE u.user_id = ?`,
      [userId]
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profileData = {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profileImage: user.profile_image,
      createdAt: user.created_at
    };

    if (user.role === 'student') {
      profileData = {
        ...profileData,
        studentId: user.student_id,
        departmentId: user.student_dept,
        semester: user.semester,
        rollNumber: user.roll_number,
        section: user.section
      };
    } else if (user.role === 'faculty') {
      profileData = {
        ...profileData,
        facultyId: user.faculty_id,
        departmentId: user.faculty_dept,
        employeeId: user.employee_id,
        designation: user.designation,
        specialization: user.specialization
      };
    }

    res.json({
      success: true,
      data: profileData
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  const { name, phone } = req.body;
  const userId = req.user.userId;

  try {
    await query(
      'UPDATE users SET name = ?, phone = ? WHERE user_id = ?',
      [name, phone, userId]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    // Get current password from database
    const user = await queryOne(
      'SELECT password FROM users WHERE user_id = ?',
      [userId]
    );

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};
