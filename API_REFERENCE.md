# 📡 CampusConnect - Complete API Reference

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### POST /api/auth/signup
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "phone": "1234567890",
  "departmentId": 1,
  "semester": 3,
  "rollNumber": "CSE2024001",
  "employeeId": "FAC001" // for faculty only
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  }
}
```

---

### POST /api/auth/login
User login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "studentId": 1,
      "departmentId": 1,
      "semester": 3
    }
  }
}
```

---

### GET /api/auth/profile
Get current user profile

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "phone": "1234567890",
    "profileImage": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "studentId": 1,
    "departmentId": 1,
    "semester": 3,
    "rollNumber": "CSE2024001"
  }
}
```

---

### PUT /api/auth/profile
Update user profile

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "9876543210"
}
```

---

### PUT /api/auth/change-password
Change password

**Headers:** Authorization required

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 👨‍🎓 Student Endpoints

### GET /api/student/dashboard
Get student dashboard data

**Headers:** Authorization required (student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "subject_name": "Data Structures",
        "present_count": 18,
        "total_count": 20,
        "percentage": 90.00
      }
    ],
    "assignments": [
      {
        "assignment_id": 1,
        "title": "Array Implementation",
        "deadline": "2024-01-20T23:59:59.000Z",
        "is_submitted": false
      }
    ],
    "announcements": [...],
    "unreadNotifications": 3
  }
}
```

---

### GET /api/student/attendance
Get attendance records

**Headers:** Authorization required (student role)

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "attendance_id": 1,
        "date": "2024-01-15",
        "status": "present",
        "remarks": null,
        "subject_name": "Data Structures",
        "faculty_name": "Dr. John Smith"
      }
    ],
    "summary": {
      "present_days": 45,
      "total_days": 50,
      "percentage": 90.00
    }
  }
}
```

---

### GET /api/student/timetable
Get class timetable

**Headers:** Authorization required (student role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "timetable_id": 1,
      "day_of_week": "Monday",
      "slot_number": 1,
      "start_time": "09:00:00",
      "end_time": "10:00:00",
      "subject_name": "Data Structures",
      "room_number": "Room 101",
      "faculty_name": "Dr. John Smith"
    }
  ]
}
```

---

### GET /api/student/assignments
Get all assignments

**Headers:** Authorization required (student role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "assignment_id": 1,
      "title": "Array Implementation",
      "description": "Implement array operations",
      "deadline": "2024-01-20T23:59:59.000Z",
      "total_marks": 100,
      "subject_name": "Data Structures",
      "submitted_at": null,
      "grade": null,
      "feedback": null,
      "submission_status": "pending"
    }
  ]
}
```

---

### POST /api/student/submit/:assignmentId
Submit assignment

**Headers:** Authorization required (student role)  
**Content-Type:** multipart/form-data

**Form Data:**
```
file: <assignment_file.pdf>
```

**Response:**
```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "data": {
    "submissionId": 1
  }
}
```

---

### GET /api/student/materials
Get study materials

**Headers:** Authorization required (student role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "material_id": 1,
      "title": "Introduction to Arrays",
      "description": "Basic concepts",
      "file_path": "/uploads/materials/file.pdf",
      "file_type": "application/pdf",
      "subject_name": "Data Structures",
      "download_count": 15
    }
  ]
}
```

---

### GET /api/student/grades
Get grades

**Headers:** Authorization required (student role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "grade_id": 1,
      "subject_name": "Data Structures",
      "grade": "A",
      "gpa": 9.5,
      "semester": 3,
      "academic_year": "2024-2025",
      "remarks": "Excellent performance"
    }
  ]
}
```

---

## 👨‍🏫 Faculty Endpoints

### GET /api/faculty/dashboard
Get faculty dashboard data

**Headers:** Authorization required (faculty role)

**Response:**
```json
{
  "success": true,
  "data": {
    "classes": [...],
    "pendingSubmissions": 5,
    "attendanceStats": [...],
    "announcements": [...]
  }
}
```

---

### POST /api/faculty/attendance
Mark attendance

**Headers:** Authorization required (faculty role)

**Request Body:**
```json
{
  "subjectId": 1,
  "studentIds": [1, 2, 3, 4, 5],
  "date": "2024-01-15",
  "status": "present",
  "remarks": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance marked for 5 student(s)"
}
```

---

### GET /api/faculty/students
Get students list

**Headers:** Authorization required (faculty role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": 1,
      "name": "Student One",
      "email": "student1@campusconnect.edu",
      "roll_number": "CSE2024001",
      "semester": 3,
      "dept_name": "Computer Science and Engineering"
    }
  ]
}
```

---

### POST /api/faculty/assignment
Create assignment

**Headers:** Authorization required (faculty role)  
**Content-Type:** multipart/form-data

**Form Data:**
```
file: <assignment.pdf>
subjectId: 1
title: "Array Operations"
description: "Implement various array operations"
instructions: "Submit with test cases"
deadline: "2024-01-20T23:59:59"
totalMarks: 100
```

**Response:**
```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "assignmentId": 1
  }
}
```

---

### GET /api/faculty/submissions/:assignmentId
Get submissions for an assignment

**Headers:** Authorization required (faculty role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "submission_id": 1,
      "student_id": 1,
      "student_name": "Student One",
      "file_path": "/uploads/assignments/file.pdf",
      "submitted_at": "2024-01-18T14:30:00.000Z",
      "grade": null,
      "feedback": null,
      "status": "submitted"
    }
  ]
}
```

---

### PUT /api/faculty/grade
Grade submission

**Headers:** Authorization required (faculty role)

**Request Body:**
```json
{
  "submissionId": 1,
  "grade": 85.5,
  "feedback": "Good work! Well documented."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission graded successfully"
}
```

---

### POST /api/faculty/material
Upload study material

**Headers:** Authorization required (faculty role)  
**Content-Type:** multipart/form-data

**Form Data:**
```
file: <lecture_notes.pdf>
subjectId: 1
title: "Lecture Notes - Chapter 1"
description: "Introduction to the subject"
```

**Response:**
```json
{
  "success": true,
  "message": "Study material uploaded successfully",
  "data": {
    "materialId": 1
  }
}
```

---

### POST /api/faculty/announcement
Create announcement

**Headers:** Authorization required (faculty role)

**Request Body:**
```json
{
  "title": "Mid-term Exam Schedule",
  "content": "Mid-term exams will be held from next week.",
  "targetAudience": "students",
  "priority": "high",
  "expiresAt": "2024-02-01T23:59:59"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Announcement created successfully",
  "data": {
    "announcementId": 1
  }
}
```

---

## 👤 Admin Endpoints

### GET /api/admin/dashboard
Get admin dashboard statistics

**Headers:** Authorization required (admin role)

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalStudents": 100,
      "totalFaculty": 25,
      "totalUsers": 127,
      "totalDepartments": 5
    },
    "todayActivity": {
      "logins": 45,
      "attendanceMarked": 120,
      "submissions": 30
    },
    "recentLogs": [...],
    "departmentStats": [...]
  }
}
```

---

### GET /api/admin/users
Get all users

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `role` (optional): Filter by role (student/faculty/admin)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "user_id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "is_active": true,
      "roll_number": "CSE2024001"
    }
  ]
}
```

---

### POST /api/admin/student
Add new student

**Headers:** Authorization required (admin role)

**Request Body:**
```json
{
  "name": "New Student",
  "email": "newstudent@campusconnect.edu",
  "password": "password123",
  "phone": "1234567890",
  "departmentId": 1,
  "semester": 3,
  "rollNumber": "CSE2024099",
  "section": "A",
  "parentName": "Parent Name",
  "parentPhone": "9876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully"
}
```

---

### DELETE /api/admin/student/:id
Remove student

**Headers:** Authorization required (admin role)

**Response:**
```json
{
  "success": true,
  "message": "Student removed successfully"
}
```

---

### POST /api/admin/faculty
Add new faculty

**Headers:** Authorization required (admin role)

**Request Body:**
```json
{
  "name": "New Faculty",
  "email": "newfaculty@campusconnect.edu",
  "password": "password123",
  "phone": "1234567890",
  "departmentId": 1,
  "employeeId": "FAC099",
  "designation": "Assistant Professor",
  "specialization": "AI/ML",
  "qualification": "Ph.D."
}
```

---

### POST /api/admin/department
Create department

**Headers:** Authorization required (admin role)

**Request Body:**
```json
{
  "deptName": "Information Technology",
  "deptCode": "IT",
  "description": "IT department"
}
```

---

### POST /api/admin/subject
Create subject

**Headers:** Authorization required (admin role)

**Request Body:**
```json
{
  "subjectCode": "CSE701",
  "subjectName": "Machine Learning",
  "departmentId": 1,
  "semester": 7,
  "credits": 4,
  "description": "Introduction to ML"
}
```

---

### POST /api/admin/assign
Assign faculty to subject

**Headers:** Authorization required (admin role)

**Request Body:**
```json
{
  "subjectId": 1,
  "facultyId": 1,
  "academicYear": "2024-2025"
}
```

---

### GET /api/admin/reports
Generate reports

**Headers:** Authorization required (admin role)

**Query Parameters:**
- `type`: Report type (attendance, grades, etc.)
- `departmentId`: Filter by department
- `semester`: Filter by semester
- `startDate`: Start date
- `endDate`: End date

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [...]
  }
}
```

---

### GET /api/admin/logs
Get activity logs

**Headers:** Authorization required (admin role)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "log_id": 1,
      "action": "LOGIN",
      "user_name": "John Doe",
      "details": "User logged in",
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 💬 Messaging Endpoints

### GET /api/messages/conversations
Get all conversations

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "other_user_id": 2,
      "name": "John Doe",
      "last_message": "Hello!",
      "last_message_time": "2024-01-15T14:30:00.000Z",
      "unread_count": 2
    }
  ]
}
```

---

### GET /api/messages/chat/:otherUserId
Get chat history with specific user

**Headers:** Authorization required

**Query Parameters:**
- `limit` (optional): Number of messages (default: 50)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "message_id": 1,
      "sender_id": 1,
      "message_text": "Hello!",
      "sent_at": "2024-01-15T14:30:00.000Z",
      "is_own_message": true
    }
  ]
}
```

---

### POST /api/messages/send
Send message

**Headers:** Authorization required  
**Content-Type:** multipart/form-data (if sending file)

**Form Data:**
```
receiverId: 2
messageText: "Hello!"
file: <optional_file>
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message_id": 1,
    "sender_id": 1,
    "receiver_id": 2,
    "message_text": "Hello!",
    "sent_at": "2024-01-15T14:30:00.000Z"
  }
}
```

---

### GET /api/messages/groups/:groupId/messages
Get group messages

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

---

### POST /api/messages/group/send
Send group message

**Headers:** Authorization required

**Request Body:**
```json
{
  "groupId": 1,
  "messageText": "Hello everyone!"
}
```

---

### GET /api/messages/groups
Get user's groups

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "group_id": 1,
      "name": "CSE Sem 3 Division A",
      "member_count": 25
    }
  ]
}
```

---

### GET /api/messages/new
Get new messages (for polling)

**Headers:** Authorization required

**Query Parameters:**
- `lastMessageTime`: Timestamp of last received message

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "message_id": 5,
      "sender_id": 2,
      "message_text": "New message",
      "sent_at": "2024-01-15T14:35:00.000Z"
    }
  ]
}
```

---

## 📊 Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

---

## 🔑 Demo Credentials

Use these for testing:

**Student:**
- Email: `student1@campusconnect.edu`
- Password: `password`

**Faculty:**
- Email: `john.smith@campusconnect.edu`
- Password: `password`

**Admin:**
- Email: `admin@campusconnect.edu`
- Password: `password`

---

## 📝 Testing with cURL

Example: Login request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student1@campusconnect.edu",
    "password": "password"
  }'
```

Example: Get profile (after getting token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**Complete API Reference - All endpoints documented!** 🎉
