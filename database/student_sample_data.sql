-- Extra sample data for Student section (Attendance, Assignments, Study Materials, Grades, Messages)
-- Run this AFTER schema.sql and dummy_data.sql
-- Use: mysql -u root -p campus_connect < student_sample_data.sql

USE campus_connect;

-- ========== ATTENDANCE: More records for Student 1 (student_id=1) for subjects 2 and 3 ==========
INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES
(1, 2, CURDATE() - INTERVAL 1 DAY, 'present', 1),
(1, 2, CURDATE() - INTERVAL 2 DAY, 'present', 1),
(1, 2, CURDATE() - INTERVAL 3 DAY, 'present', 2),
(1, 3, CURDATE() - INTERVAL 1 DAY, 'present', 1),
(1, 3, CURDATE() - INTERVAL 2 DAY, 'late', 3),
(1, 3, CURDATE() - INTERVAL 3 DAY, 'present', 3)
ON DUPLICATE KEY UPDATE status = VALUES(status);

-- ========== STUDY MATERIALS: Ensure materials have file_path (if your schema has file_path NOT NULL) ==========
-- If study_materials already has rows without file_path, run: UPDATE study_materials SET file_path = CONCAT('/uploads/materials/doc', material_id, '.pdf') WHERE file_path IS NULL OR file_path = '';
-- Otherwise insert additional materials with file_path for subjects 1,2,3 (for Student 1):
INSERT INTO study_materials (subject_id, faculty_id, title, description, file_path, file_type) VALUES
(1, 1, 'Unit 1 - Arrays and Complexity', 'Basic concepts of arrays with examples', '/uploads/materials/arrays.pdf', 'pdf'),
(1, 1, 'Unit 2 - Linked Lists', 'Comprehensive notes on linked lists', '/uploads/materials/linkedlist.pdf', 'pdf'),
(2, 2, 'OOP Principles', 'Four pillars of OOP explained', '/uploads/materials/oop.pdf', 'ppt'),
(3, 3, 'Discrete Math Basics', 'Sets, relations and functions', '/uploads/materials/discrete.pdf', 'pdf');

-- ========== SUBMISSIONS + GRADES: One graded submission for Student 1 so Grades page shows data ==========
INSERT INTO submissions (assignment_id, student_id, file_path, original_filename, submitted_at, grade, feedback, graded_at, graded_by, status) VALUES
(1, 1, '/uploads/submissions/s1_assignment1.pdf', 'assignment1.pdf', NOW() - INTERVAL 2 DAY, 85, 'Good work. Improve comments.', NOW() - INTERVAL 1 DAY, 1, 'graded')
ON DUPLICATE KEY UPDATE grade = VALUES(grade), feedback = VALUES(feedback), graded_at = VALUES(graded_at), graded_by = VALUES(graded_by), status = 'graded';

-- ========== MESSAGES: Already in dummy_data for user 8 (Student 1) with user 3 (Dr. John Smith). No change needed. ==========
-- Ensure messages table uses message_text and sent_at (schema). Dummy_data uses message_text; sent_at defaults to CURRENT_TIMESTAMP.
