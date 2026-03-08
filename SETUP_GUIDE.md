# 🚀 Quick Setup Guide - CampusConnect

## Step-by-Step Setup (5 Minutes)

### Step 1: Install MySQL or XAMPP ⭐

**Option A: Using XAMPP (Recommended for Beginners)**
1. Download XAMPP from: https://www.apachefriends.org/
2. Install XAMPP
3. Open XAMPP Control Panel
4. Start **MySQL** service

**Option B: Using Standalone MySQL**
1. Download MySQL from: https://dev.mysql.com/downloads/
2. Install MySQL Server
3. Note your root password

---

### Step 2: Setup Database 🗄️

**Using phpMyAdmin (XAMPP):**
1. Open browser: `http://localhost/phpmyadmin`
2. Click "New" to create a new database
3. Name it: `campus_connect`
4. Click on the database
5. Click "Import" tab
6. Choose file: `campus-connect/database/schema.sql`
7. Click "Go"
8. Repeat for `dummy_data.sql`

**Using MySQL Command Line:**
```bash
mysql -u root -p
CREATE DATABASE campus_connect;
USE campus_connect;
source path/to/schema.sql;
source path/to/dummy_data.sql;
exit;
```

---

### Step 3: Install Backend Dependencies 🔧

Open terminal/command prompt:

```bash
cd campus-connect/backend
npm install
```

This will install:
- express
- mysql2
- bcrypt
- jsonwebtoken
- dotenv
- cors
- multer
- And more...

**Wait for installation to complete** (may take 2-3 minutes)

---

### Step 4: Configure Backend .env ⚙️

The `.env` file is already created with default settings.

**Default Configuration:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=campus_connect
JWT_SECRET=campusconnect_super_secret_key_2024_change_in_production
FRONTEND_URL=http://localhost:5173
```

**If using XAMPP:** Keep as is (no changes needed)

**If using standalone MySQL:** Update `DB_PASSWORD` if you set one

---

### Step 5: Start Backend Server 🖥️

```bash
cd campus-connect/backend
npm run dev
```

**You should see:**
```
✅ Database connected successfully!
╔════════════════════════════════════════════╗
║   🎓 CampusConnect Server Running!        ║
║                                            ║
║   Port: 5000                               ║
║   Environment: development                 ║
╚════════════════════════════════════════════╝
```

**Keep this terminal open!** ✅

---

### Step 6: Install Frontend Dependencies 🎨

Open a **NEW terminal/command prompt**:

```bash
cd campus-connect/frontend
npm install
```

This will install:
- react
- react-dom
- react-router-dom
- axios
- vite
- And more...

**Wait for installation to complete** (may take 2-3 minutes)

---

### Step 7: Start Frontend Application 🌐

```bash
cd campus-connect/frontend
npm run dev
```

**You should see:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
```

**Keep this terminal open!** ✅

---

### Step 8: Access the Application 🎉

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the login page!

---

## 🔑 Login Credentials

### Student Account
```
Email: student1@campusconnect.edu
Password: password
```

### Faculty Account
```
Email: john.smith@campusconnect.edu
Password: password
```

### Admin Account
```
Email: admin@campusconnect.edu
Password: password
```

---

## ✅ Verification Checklist

- [ ] MySQL/XAMPP is running
- [ ] Database `campus_connect` created
- [ ] Tables imported from schema.sql
- [ ] Dummy data imported
- [ ] Backend dependencies installed
- [ ] Backend server running on port 5000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 5173
- [ ] Can access login page
- [ ] Can login with demo credentials

---

## ❗ Common Issues & Solutions

### Issue 1: "Database connection failed"
**Solution:**
- Ensure MySQL is running in XAMPP
- Check database name is `campus_connect`
- Verify `.env` has correct credentials

### Issue 2: "Port 5000 already in use"
**Solution:**
```bash
# Windows - Find and kill process
netstat -ano | findstr :5000
taskkill /PID <NUMBER> /F
```

### Issue 3: "Cannot find module"
**Solution:**
```bash
# Delete and reinstall
rm -rf node_modules
npm install
```

### Issue 4: Frontend won't load
**Solution:**
- Ensure backend is running first
- Check console for errors
- Clear browser cache (Ctrl+Shift+Delete)

### Issue 5: Login fails with "Invalid credentials"
**Solution:**
- Make sure dummy data was imported
- Use exact email addresses from demo credentials
- Password is: `password` (all lowercase)

---

## 📱 What to Test First

1. **Login as Student**
   - View dashboard
   - Check attendance
   - View assignments

2. **Login as Faculty**
   - View dashboard
   - Mark attendance
   - Create assignment

3. **Login as Admin**
   - View statistics
   - Manage users
   - Check activity logs

---

## 🎯 Next Steps

After successful setup:
1. Explore all three roles
2. Test file upload (submit assignment)
3. Try messaging system
4. Create new user accounts via signup
5. Customize the UI colors/styling

---

## 💡 Tips

- Keep both terminals open while developing
- Use different browsers to test multiple users simultaneously
- Check browser console (F12) for errors
- Backend logs show all API requests
- Database changes are immediate (refresh frontend to see)

---

## 🆘 Need Help?

1. Check the main README.md
2. Review error messages carefully
3. Verify all services are running
4. Try restarting both servers
5. Clear browser cache and cookies

---

**Ready to start? Let's go! 🚀**

Visit: http://localhost:5173
