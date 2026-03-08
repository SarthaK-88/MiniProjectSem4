# 🎓 CampusConnect - Integrated College Management System

Complete full-stack web application for college management with role-based access for Students, Faculty, and Admin.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [Demo Credentials](#demo-credentials)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure login/signup system with JWT tokens
- Role-based access control (Student, Faculty, Admin)
- Password hashing with bcrypt
- Session management

### 👨‍🎓 Student Module
- View attendance percentage and subject-wise details
- Access class timetable
- Submit assignments with file upload
- Download study materials
- View grades and feedback
- Real-time messaging with faculty
- View announcements and notifications

### 👨‍🏫 Faculty Module
- Mark and update student attendance
- Create and manage assignments
- Grade submissions with feedback
- Upload study materials
- Send announcements
- Chat with students
- Monitor class performance

### 👤 Admin Module
- Add/Remove students and faculty
- Create departments and subjects
- Assign faculty to subjects
- Monitor platform usage
- Generate reports
- View activity logs
- Manage announcements

### 💬 Communication System
- Private messaging between users
- Group chats for classes
- File sharing support
- Message history
- Real-time updates via polling

### 📊 Additional Features
- Modern responsive UI design
- REST API architecture
- MySQL database with proper relationships
- File upload support
- Activity logging
- Notification system

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** with custom styling
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MySQL** database
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Express Validator** for validation

---

## 📁 Project Structure

```
campus-connect/
├── backend/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── studentController.js # Student operations
│   │   ├── facultyController.js # Faculty operations
│   │   ├── adminController.js   # Admin operations
│   │   └── messageController.js # Messaging system
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handling
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── students.js          # Student routes
│   │   ├── faculty.js           # Faculty routes
│   │   ├── admin.js             # Admin routes
│   │   └── messages.js          # Message routes
│   ├── uploads/                  # Uploaded files storage
│   ├── .env                      # Environment variables
│   ├── server.js                 # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── student/
│   │   │   ├── faculty/
│   │   │   └── admin/
│   │   ├── services/
│   │   │   └── api.js            # API service layer
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── database/
│   ├── schema.sql                # Database schema
│   └── dummy_data.sql            # Sample data
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher) or **XAMPP**
- **Git** (optional)

### Step 1: Database Setup

1. **Start MySQL Server**
   - If using XAMPP: Start Apache and MySQL from XAMPP Control Panel
   - If using standalone MySQL: Ensure MySQL service is running

2. **Create Database and Import Schema**
   ```bash
   # Open MySQL command line or phpMyAdmin
   mysql -u root -p
   
   # Run the schema SQL file
   source path/to/campus-connect/database/schema.sql
   
   # Import dummy data (optional but recommended for testing)
   source path/to/campus-connect/database/dummy_data.sql
   ```
   
   Or use phpMyAdmin:
   - Open http://localhost/phpmyadmin
   - Create new database `campus_connect`
   - Import `schema.sql`
   - Import `dummy_data.sql`

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd campus-connect/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Update database credentials if needed:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=campus_connect
   JWT_SECRET=your_secret_key_here
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   
   Server should start on `http://localhost:5000`

### Step 3: Frontend Setup

1. **Open a new terminal and navigate to frontend directory**
   ```bash
   cd campus-connect/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   Frontend should start on `http://localhost:5173`

---

## 🎯 Usage

### Access the Application

1. Open your browser and go to `http://localhost:5173`
2. You'll be redirected to the login page
3. Use the demo credentials below to login

### Demo Credentials

**Student Account:**
- Email: `student1@campusconnect.edu`
- Password: `password`

**Faculty Account:**
- Email: `john.smith@campusconnect.edu`
- Password: `password`

**Admin Account:**
- Email: `admin@campusconnect.edu`
- Password: `password`

> Note: All demo accounts use the same password: `password`

### Testing Features

1. **As a Student:**
   - View dashboard with attendance and assignments
   - Check timetable
   - Submit assignments (file upload)
   - View study materials
   - Chat with faculty

2. **As Faculty:**
   - Mark attendance for students
   - Create assignments
   - Grade submissions
   - Upload study materials
   - Send announcements

3. **As Admin:**
   - Add/remove users
   - Create departments
   - Monitor system activity
   - Generate reports

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/login
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

#### POST /auth/signup
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "role": "student",
  "phone": "1234567890",
  "departmentId": 1,
  "semester": 3,
  "rollNumber": "CSE2024001"
}
```

#### GET /auth/profile
Headers: `Authorization: Bearer <token>`

### Student Endpoints

#### GET /student/dashboard
Get student dashboard data

#### GET /student/attendance
Get attendance records

#### GET /student/timetable
Get class timetable

#### GET /student/assignments
Get all assignments

#### POST /student/submit/:assignmentId
Submit assignment (multipart/form-data)

### Faculty Endpoints

#### GET /faculty/dashboard
Get faculty dashboard data

#### POST /faculty/attendance
Mark attendance
```json
{
  "subjectId": 1,
  "studentIds": [1, 2, 3],
  "date": "2024-01-15",
  "status": "present"
}
```

#### POST /faculty/assignment
Create assignment (multipart/form-data)

#### PUT /faculty/grade
Grade submission
```json
{
  "submissionId": 1,
  "grade": 85.5,
  "feedback": "Good work!"
}
```

### Admin Endpoints

#### GET /admin/dashboard
Get admin dashboard statistics

#### POST /admin/student
Add new student

#### POST /admin/department
Create department

### Message Endpoints

#### GET /messages/conversations
Get all conversations

#### GET /messages/chat/:otherUserId
Get chat history

#### POST /messages/send
Send message
```json
{
  "receiverId": 2,
  "messageText": "Hello!"
}
```

---

## 🔧 Troubleshooting

### Database Connection Error

**Problem:** Backend shows "Database connection failed"

**Solution:**
1. Ensure MySQL/XAMPP is running
2. Check database credentials in `.env`
3. Verify database `campus_connect` exists
4. Check MySQL port (default: 3306)

### Port Already in Use

**Problem:** "Port 5000 already in use" or "Port 5173 already in use"

**Solution:**
```bash
# Windows - Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Change port in .env (backend) or vite.config.js (frontend)
```

### CORS Error

**Problem:** Frontend can't connect to backend

**Solution:**
1. Ensure backend is running on port 5000
2. Check `FRONTEND_URL` in backend `.env`
3. Verify proxy configuration in `vite.config.js`

### Module Not Found

**Problem:** "Cannot find module..."

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### JWT Token Errors

**Problem:** "Invalid token" or "Token expired"

**Solution:**
1. Clear browser local storage
2. Login again
3. Ensure `JWT_SECRET` is set in `.env`

### File Upload Issues

**Problem:** File upload fails

**Solution:**
1. Check `uploads/` directory exists
2. Verify file size is under 10MB
3. Check allowed file types in `upload.js`

---

## 📝 Notes

- The dummy data uses placeholder passwords. In production, implement proper password reset functionality.
- File uploads are stored locally in `backend/uploads/`
- The messaging system uses HTTP polling (refresh every 5 seconds)
- For production deployment, configure proper environment variables and security settings

---

## 🛡️ Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens expire after 7 days
- Role-based access control on all routes
- SQL injection prevention via parameterized queries
- CORS configured for specific origins
- File upload validation and size limits

---

## 📄 License

MIT License - Feel free to use this project for educational purposes.

---

## 👨‍💻 Development

To extend this project:

1. Add more features to each role
2. Implement real-time chat with Socket.io
3. Add email notifications
4. Integrate video conferencing
5. Add mobile app version

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in browser console
3. Verify backend terminal output
4. Ensure all dependencies are installed

---

**Happy Coding! 🎉**
