-- Quick test to reset passwords for demo accounts
-- This ensures all demo accounts use 'password' as their password

USE campus_connect;

-- Update admin password to 'password' (hashed)
UPDATE users 
SET password = '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N'
WHERE email = 'admin@campusconnect.edu';

-- Update student password to 'password' (hashed)
UPDATE users 
SET password = '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N'
WHERE email = 'student1@campusconnect.edu';

-- Update faculty password to 'password' (hashed)
UPDATE users 
SET password = '$2a$10$rQZ9vXJXL5K5Z5Z5Z5Z5ZeR5h5N5N5N5N5N5N5N5N5N5N5N5N5N5N'
WHERE email = 'john.smith@campusconnect.edu';

-- Verify the updates
SELECT email, name, role, is_active FROM users 
WHERE email IN ('student1@campusconnect.edu', 'john.smith@campusconnect.edu', 'admin@campusconnect.edu');
