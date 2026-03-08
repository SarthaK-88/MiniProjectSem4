-- Fix for deactivated accounts
-- Run this in phpMyAdmin to activate all demo accounts

USE campus_connect;

-- Activate all demo user accounts
UPDATE users SET is_active = TRUE 
WHERE email IN (
    'student1@campusconnect.edu',
    'student2@campusconnect.edu',
    'student3@campusconnect.edu',
    'student4@campusconnect.edu',
    'student5@campusconnect.edu',
    'john.smith@campusconnect.edu',
    'sarah.johnson@campusconnect.edu',
    'michael.brown@campusconnect.edu',
    'emily.davis@campusconnect.edu',
    'robert.wilson@campusconnect.edu',
    'admin@campusconnect.edu',
    'admin2@campusconnect.edu'
);

-- Verify the update
SELECT user_id, name, email, role, is_active 
FROM users 
WHERE email IN (
    'student1@campusconnect.edu',
    'john.smith@campusconnect.edu',
    'admin@campusconnect.edu'
);
