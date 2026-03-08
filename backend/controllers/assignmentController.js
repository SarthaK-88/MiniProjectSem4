const { query, pool } = require('../config/database');
const path = require('path');

// Create new assignment
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, subjectId, deadline, totalMarks } = req.body;
    const facultyId = req.user.facultyId;
    
    if (!title || !subjectId || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Title, subject ID, and deadline are required'
      });
    }

    const resourceFile = req.file ? `/uploads/assignments/${req.file.filename}` : null;

    const [result] = await pool.execute(
      `INSERT INTO assignments (faculty_id, subject_id, title, description, resource_file, deadline, total_marks) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [facultyId, subjectId, title, description, resourceFile, deadline, totalMarks || null]
    );

    res.status(201).json({
      success: true,
      message: 'Assignment created successfully',
      data: {
        assignment_id: result.insertId,
        title,
        subjectId,
        deadline,
        resourceFile
      }
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create assignment'
    });
  }
};

// Get assignments by faculty
exports.getAssignmentsByFaculty = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;

    const assignments = await query(
      `SELECT a.*, s.subject_name, 
              COUNT(sub.submission_id) as submission_count
       FROM assignments a
       JOIN subjects s ON a.subject_id = s.subject_id
       LEFT JOIN submissions sub ON a.assignment_id = sub.assignment_id
       WHERE a.faculty_id = ?
       GROUP BY a.assignment_id
       ORDER BY a.deadline DESC`,
      [facultyId]
    );

    res.json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignments'
    });
  }
};

// Get single assignment
exports.getAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const [assignment] = await pool.execute(
      `SELECT a.*, s.subject_name, f.name as faculty_name
       FROM assignments a
       JOIN subjects s ON a.subject_id = s.subject_id
       JOIN faculty fac ON a.faculty_id = fac.faculty_id
       JOIN users f ON fac.user_id = f.user_id
       WHERE a.assignment_id = ?`,
      [id]
    );

    if (assignment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      data: assignment[0]
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignment'
    });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, totalMarks } = req.body;
    const facultyId = req.user.facultyId;

    // Check if assignment belongs to faculty
    const [existing] = await pool.execute(
      'SELECT * FROM assignments WHERE assignment_id = ? AND faculty_id = ?',
      [id, facultyId]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    const resourceFile = req.file ? `/uploads/assignments/${req.file.filename}` : existing[0].resource_file;

    await pool.execute(
      `UPDATE assignments 
       SET title = ?, description = ?, resource_file = ?, deadline = ?, total_marks = ?
       WHERE assignment_id = ?`,
      [title, description, resourceFile, deadline, totalMarks, id]
    );

    res.json({
      success: true,
      message: 'Assignment updated successfully'
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update assignment'
    });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.facultyId;

    const [result] = await pool.execute(
      'DELETE FROM assignments WHERE assignment_id = ? AND faculty_id = ?',
      [id, facultyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found or unauthorized'
      });
    }

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete assignment'
    });
  }
};

// Submit assignment
exports.submitAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.studentId;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Submission file is required'
      });
    }

    const submissionFile = `/uploads/submissions/${req.file.filename}`;

    const [result] = await pool.execute(
      `INSERT INTO submissions (assignment_id, student_id, submission_file, submission_date) 
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE submission_file = VALUES(submission_file), submission_date = NOW()`,
      [id, studentId, submissionFile]
    );

    res.json({
      success: true,
      message: 'Assignment submitted successfully',
      data: {
        submissionFile,
        submissionDate: new Date()
      }
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit assignment'
    });
  }
};

// Get submissions for an assignment
exports.getSubmissions = async (req, res) => {
  try {
    const { id } = req.params;
    const facultyId = req.user.facultyId;

    const submissions = await query(
      `SELECT sub.*, u.name as student_name, s.roll_number, sub.marks_obtained
       FROM submissions sub
       JOIN students s ON sub.student_id = s.student_id
       JOIN users u ON s.user_id = u.user_id
       WHERE sub.assignment_id = ?`,
      [id]
    );

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
};
