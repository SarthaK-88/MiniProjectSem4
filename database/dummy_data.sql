-- CampusConnect Dummy Data for Testing
-- This file contains sample data to populate the database

USE campus_connect;

-- Insert Departments
INSERT INTO departments (dept_name, dept_code, description) VALUES
('Computer Science and Engineering', 'CSE', 'Focus on software, hardware, and computing systems'),
('Electronics and Communication Engineering', 'ECE', 'Study of electronic devices and communication systems'),
('Mechanical Engineering', 'ME', 'Design and manufacturing of mechanical systems'),
('Civil Engineering', 'CE', 'Infrastructure and construction engineering'),
('Information Technology', 'IT', 'Information systems and technology management');

-- Insert Users (Admins)
INSERT INTO users (name, email, password, role, phone, is_active) VALUES
('Admin User 1', 'admin@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'admin', '9876543210', TRUE),
('Admin User 2', 'admin2@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'admin', '9876543211', TRUE);

-- Insert Users (Faculty)
INSERT INTO users (name, email, password, role, phone, is_active) VALUES
('Dr. John Smith', 'john.smith@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'faculty', '9876543212', TRUE),
('Prof. Sarah Johnson', 'sarah.johnson@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'faculty', '9876543213', TRUE),
('Dr. Michael Brown', 'michael.brown@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'faculty', '9876543214', TRUE),
('Prof. Emily Davis', 'emily.davis@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'faculty', '9876543215', TRUE),
('Dr. Robert Wilson', 'robert.wilson@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'faculty', '9876543216', TRUE);

-- Insert Faculty Details
INSERT INTO faculty (user_id, department_id, employee_id, designation, specialization, qualification, experience_years, office_room) VALUES
(3, 1, 'FAC001', 'Professor', 'Data Structures & Algorithms', 'Ph.D.', 15, 'Room 101'),
(4, 1, 'FAC002', 'Associate Professor', 'Database Management Systems', 'Ph.D.', 10, 'Room 102'),
(5, 1, 'FAC003', 'Assistant Professor', 'Web Technologies', 'M.Tech', 5, 'Room 103'),
(6, 2, 'FAC004', 'Professor', 'Digital Electronics', 'Ph.D.', 12, 'Room 201'),
(7, 5, 'FAC005', 'Associate Professor', 'Network Security', 'Ph.D.', 8, 'Room 301');

-- Insert Users (Students) - 20 students
INSERT INTO users (name, email, password, role, phone, is_active) VALUES
('Student 1', 'student1@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776601', TRUE),
('Student 2', 'student2@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776602', TRUE),
('Student 3', 'student3@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776603', TRUE),
('Student 4', 'student4@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776604', TRUE),
('Student 5', 'student5@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776605', TRUE),
('Student 6', 'student6@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776606', TRUE),
('Student 7', 'student7@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776607', TRUE),
('Student 8', 'student8@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776608', TRUE),
('Student 9', 'student9@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776609', TRUE),
('Student 10', 'student10@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776610', TRUE),
('Student 11', 'student11@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776611', TRUE),
('Student 12', 'student12@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776612', TRUE),
('Student 13', 'student13@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776613', TRUE),
('Student 14', 'student14@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776614', TRUE),
('Student 15', 'student15@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776615', TRUE),
('Student 16', 'student16@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776616', TRUE),
('Student 17', 'student17@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776617', TRUE),
('Student 18', 'student18@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776618', TRUE),
('Student 19', 'student19@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776619', TRUE),
('Student 20', 'student20@campusconnect.edu', '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N', 'student', '9988776620', TRUE);

-- Insert Student Details (All in CSE, Semester 3-6)
INSERT INTO students (user_id, department_id, semester, roll_number, enrollment_year, section, parent_name, parent_phone) VALUES
(8, 1, 3, 'CSE2024001', 2024, 'A', 'Parent 1', '9900110001'),
(9, 1, 3, 'CSE2024002', 2024, 'A', 'Parent 2', '9900110002'),
(10, 1, 3, 'CSE2024003', 2024, 'A', 'Parent 3', '9900110003'),
(11, 1, 3, 'CSE2024004', 2024, 'A', 'Parent 4', '9900110004'),
(12, 1, 3, 'CSE2024005', 2024, 'B', 'Parent 5', '9900110005'),
(13, 1, 4, 'CSE2023001', 2023, 'A', 'Parent 6', '9900110006'),
(14, 1, 4, 'CSE2023002', 2023, 'A', 'Parent 7', '9900110007'),
(15, 1, 4, 'CSE2023003', 2023, 'B', 'Parent 8', '9900110008'),
(16, 1, 5, 'CSE2022001', 2022, 'A', 'Parent 9', '9900110009'),
(17, 1, 5, 'CSE2022002', 2022, 'A', 'Parent 10', '9900110010'),
(18, 1, 5, 'CSE2022003', 2022, 'B', 'Parent 11', '9900110011'),
(19, 1, 5, 'CSE2022004', 2022, 'B', 'Parent 12', '9900110012'),
(20, 1, 6, 'CSE2021001', 2021, 'A', 'Parent 13', '9900110013'),
(21, 1, 6, 'CSE2021002', 2021, 'A', 'Parent 14', '9900110014'),
(22, 1, 6, 'CSE2021003', 2021, 'B', 'Parent 15', '9900110015'),
(23, 1, 6, 'CSE2021004', 2021, 'B', 'Parent 16', '9900110016'),
(24, 1, 6, 'CSE2021005', 2021, 'A', 'Parent 17', '9900110017'),
(25, 1, 6, 'CSE2021006', 2021, 'B', 'Parent 18', '9900110018'),
(26, 1, 6, 'CSE2021007', 2021, 'A', 'Parent 19', '9900110019'),
(27, 1, 6, 'CSE2021008', 2021, 'B', 'Parent 20', '9900110020');

-- Insert Subjects
INSERT INTO subjects (subject_code, subject_name, department_id, semester, credits, description) VALUES
('CSE301', 'Data Structures and Algorithms', 1, 3, 4, 'Fundamental data structures and algorithm analysis'),
('CSE302', 'Object Oriented Programming', 1, 3, 4, 'OOP concepts using Java/C++'),
('CSE303', 'Discrete Mathematics', 1, 3, 3, 'Mathematical foundations for computer science'),
('CSE401', 'Database Management Systems', 1, 4, 4, 'Database design and SQL'),
('CSE402', 'Computer Architecture', 1, 4, 4, 'Computer organization and architecture'),
('CSE403', 'Operating Systems', 1, 4, 4, 'OS concepts and implementation'),
('CSE501', 'Web Programming', 1, 5, 4, 'Modern web development technologies'),
('CSE502', 'Computer Networks', 1, 5, 4, 'Network protocols and architecture'),
('CSE503', 'Software Engineering', 1, 5, 3, 'Software development methodologies'),
('CSE601', 'Advanced Database Systems', 1, 6, 4, 'Advanced DBMS concepts'),
('CSE602', 'Compiler Design', 1, 6, 4, 'Compiler construction principles'),
('CSE603', 'Artificial Intelligence', 1, 6, 4, 'Introduction to AI and ML');

-- Enroll Students in Subjects (Sample for Semester 3 students)
INSERT INTO subject_students (subject_id, student_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
(3, 1), (3, 2), (3, 3), (3, 4), (3, 5);

-- Assign Faculty to Subjects
INSERT INTO subject_faculty (subject_id, faculty_id, academic_year) VALUES
(1, 1, '2024-2025'),
(2, 2, '2024-2025'),
(3, 3, '2024-2025'),
(4, 1, '2024-2025'),
(5, 2, '2024-2025'),
(6, 3, '2024-2025'),
(7, 3, '2024-2025'),
(8, 1, '2024-2025'),
(9, 2, '2024-2025');

-- Sample Attendance Records
INSERT INTO attendance (student_id, subject_id, date, status, marked_by) VALUES
(1, 1, CURDATE() - INTERVAL 1 DAY, 'present', 1),
(1, 1, CURDATE() - INTERVAL 2 DAY, 'present', 1),
(1, 1, CURDATE() - INTERVAL 3 DAY, 'absent', 1),
(2, 1, CURDATE() - INTERVAL 1 DAY, 'present', 1),
(2, 1, CURDATE() - INTERVAL 2 DAY, 'present', 1),
(2, 1, CURDATE() - INTERVAL 3 DAY, 'present', 1),
(3, 1, CURDATE() - INTERVAL 1 DAY, 'late', 1),
(3, 1, CURDATE() - INTERVAL 2 DAY, 'present', 1),
(4, 1, CURDATE() - INTERVAL 1 DAY, 'present', 1),
(5, 1, CURDATE() - INTERVAL 1 DAY, 'absent', 1);

-- Sample Assignments
INSERT INTO assignments (subject_id, faculty_id, title, description, instructions, deadline, total_marks) VALUES
(1, 1, 'Array Implementation', 'Implement various array operations including insertion, deletion, and searching', 'Submit complete code with test cases', DATE_ADD(NOW(), INTERVAL 7 DAY), 100),
(1, 1, 'Linked List Operations', 'Create a singly linked list with insert, delete, and traverse functions', 'Use proper documentation and comments', DATE_ADD(NOW(), INTERVAL 14 DAY), 100),
(2, 2, 'OOP Project', 'Design a library management system using OOP principles', 'Include all four pillars of OOP', DATE_ADD(NOW(), INTERVAL 10 DAY), 150),
(4, 1, 'SQL Queries', 'Write complex SQL queries for given database schema', 'Test all queries before submission', DATE_ADD(NOW(), INTERVAL 5 DAY), 50);

-- Sample Announcements
INSERT INTO announcements (title, content, created_by, target_audience, priority) VALUES
('Welcome to New Semester', 'The new semester begins from next Monday. All students are requested to check their timetable and attend classes regularly.', 1, 'students', 'medium'),
('Assignment Submission Extended', 'The deadline for Data Structures assignment has been extended by 2 days.', 3, 'specific_department', 'high'),
('Guest Lecture Announcement', 'Dr. Expert from IIT will deliver a guest lecture on AI/ML this Friday at 2 PM in Main Auditorium.', 1, 'all', 'high'),
('Holiday Notice', 'College will remain closed on Saturday due to national holiday.', 1, 'all', 'urgent');

-- Sample Messages
INSERT INTO messages (sender_id, receiver_id, message_text, message_type) VALUES
(8, 3, 'Hello Sir, I have a doubt about the assignment.', 'text'),
(3, 8, 'Sure, please ask. I am available.', 'text'),
(8, 3, 'Can you explain the linked list question?', 'text'),
(9, 3, 'Good morning Sir, when is the submission deadline?', 'text'),
(3, 9, 'The deadline is next week Friday.', 'text');

-- Sample Study Materials (file_path required by schema)
INSERT INTO study_materials (subject_id, faculty_id, title, description, file_path, file_type) VALUES
(1, 1, 'Introduction to Arrays', 'Basic concepts of arrays with examples', '/uploads/materials/arrays-intro.pdf', 'pdf'),
(1, 1, 'Linked List Notes', 'Comprehensive notes on linked lists', '/uploads/materials/linkedlist.pdf', 'pdf'),
(2, 2, 'OOP Concepts', 'Four pillars of OOP explained', '/uploads/materials/oop.pptx', 'ppt'),
(4, 1, 'SQL Basics', 'Introduction to SQL and database queries', '/uploads/materials/sql-basics.pdf', 'pdf');

-- Sample Timetable (for CSE Semester 3)
INSERT INTO timetable (department_id, semester, section, day_of_week, slot_number, start_time, end_time, subject_id, faculty_id, room_number, academic_year) VALUES
(1, 3, 'A', 'Monday', 1, '09:00:00', '10:00:00', 1, 1, 'Room 101', '2024-2025'),
(1, 3, 'A', 'Monday', 2, '10:00:00', '11:00:00', 2, 2, 'Room 101', '2024-2025'),
(1, 3, 'A', 'Tuesday', 1, '09:00:00', '10:00:00', 3, 3, 'Room 102', '2024-2025'),
(1, 3, 'A', 'Wednesday', 1, '09:00:00', '10:00:00', 1, 1, 'Lab 1', '2024-2025'),
(1, 3, 'A', 'Thursday', 2, '10:00:00', '11:00:00', 2, 2, 'Room 101', '2024-2025'),
(1, 3, 'A', 'Friday', 1, '09:00:00', '10:00:00', 3, 3, 'Room 102', '2024-2025');

-- Class Groups
INSERT INTO class_groups (name, department_id, semester, section, faculty_incharge) VALUES
('CSE Sem 3 Division A', 1, 3, 'A', 1),
('CSE Sem 3 Division B', 1, 3, 'B', 2);

-- Add members to groups
INSERT INTO group_members (group_id, student_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4),
(2, 5), (2, 6), (2, 7), (2, 8);

-- Sample Notifications
INSERT INTO notifications (user_id, title, message, type) VALUES
(8, 'New Assignment Posted', 'Data Structures assignment has been posted with deadline next week', 'assignment'),
(9, 'Attendance Alert', 'Your attendance in Data Structures is below 75%', 'attendance'),
(10, 'Grade Published', 'Grades for OOP assignment have been published', 'grade');

-- Activity Logs (Sample)
INSERT INTO activity_logs (user_id, action, entity_type, details) VALUES
(1, 'LOGIN', 'user', 'Admin logged in'),
(3, 'CREATE_ASSIGNMENT', 'assignment', 'Created new assignment for CSE301'),
(8, 'SUBMIT_ASSIGNMENT', 'submission', 'Submitted assignment for CSE301');
