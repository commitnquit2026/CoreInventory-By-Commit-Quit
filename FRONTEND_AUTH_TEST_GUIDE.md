# Frontend Authentication - Quick Test Guide

**Date**: 14 March 2026  
**Status**: Ready for Testing ✅

---

## 🚀 Quick Start (2 Minutes)

### Terminal 1: Start Backend
```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit/backend
python3 app.py
```

**Expected Output**:
```
Running on http://127.0.0.1:5000
```

---

### Terminal 2: Start Frontend
```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit/frontend
npm run dev
```

**Expected Output**:
```
VITE v8.0.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🧪 Test Scenarios

### Test 1: Login with Demo Account

**Steps**:
1. Open http://localhost:5173 in browser
2. You should see **LoginPage** (not dashboard!)
3. Username: `testmanager`
4. Password: `TestPass123`
5. Click **"Sign In"**

**Expected Results**:
- ✅ Page redirects to http://localhost:5173/ (dashboard)
- ✅ "Warehouse Staff" name appears in top-right
- ✅ User avatar shows "WL" or initials
- ✅ Dashboard content loads

**If you see errors**:
- Check backend is running (curl http://localhost:5000/health)
- Check browser console for error messages
- Ensure token is being stored (check DevTools → Application → Local Storage)

---

### Test 2: Verify Token Persistence

**Steps**:
1. After successful login, refresh page (Ctrl+R or Cmd+R)
2. Should stay on dashboard (not redirect to login)
3. User name should still be visible

**Expected Results**:
- ✅ Still logged in after refresh
- ✅ No need to login again
- ✅ Token persisted in localStorage

**Check**:
- Open DevTools (F12)
- Go to Application tab
- Check Local Storage
- Look for key: `jwt_token`
- Value should be a long JWT token starting with `eyJ...`

---

### Test 3: Logout

**Steps**:
1. Click user avatar in top-right
2. Click **"Logout"** button
3. Should redirect to login page

**Expected Results**:
- ✅ Redirected to http://localhost:5173/login
- ✅ jwt_token removed from localStorage
- ✅ User info cleared from navbar

---

### Test 4: Register New User

**Steps**:
1. Go to http://localhost:5173/login
2. Click **"Create Account"** button
3. Fill form with test data:
   ```
   Username:    john_doe
   Email:       john@example.com
   First Name:  John
   Last Name:   Doe
   Role:        Inventory Manager
   Password:    TestPass123!
   Confirm:     TestPass123!
   ```
4. Click **"Create Account"**

**Expected Results**:
- ✅ Form validates all fields
- ✅ Shows error if password doesn't match confirmation
- ✅ Shows error if password doesn't have uppercase/lowercase/number
- ✅ Redirects to login page
- ✅ See message about successful registration

**Try to Login**:
1. Username: `john_doe`
2. Password: `TestPass123!`
3. Should see dashboard with "John" in top-right

---

### Test 5: Access Protected Route Without Login

**Steps**:
1. Logout (or clear localStorage manually)
2. Try to visit http://localhost:5173/products directly
3. Type /products in the URL

**Expected Results**:
- ✅ Redirected to http://localhost:5173/login
- ✅ Cannot access protected pages without token

**How to manually clear token**:
- Open DevTools (F12)
- Go to Application → Local Storage
- Find `jwt_token` key
- Delete it
- Try accessing /products
- Should redirect to /login

---

### Test 6: View User Profile

**Steps**:
1. Login with testmanager / TestPass123
2. Click user avatar in top-right
3. Select **"View Profile"**

**Expected Results**:
- ✅ Redirected to /profile page
- ✅ See all user details:
  - Username: testmanager
  - Email: test@example.com
  - First Name: Test
  - Last Name: Manager
  - Role: Warehouse Staff
  - Status: Active ✓

---

### Test 7: Check Token in Requests

**Steps**:
1. Login successfully
2. Open DevTools (F12)
3. Go to Network tab
4. Click on any API request (e.g., any GET request to backend)
5. Go to "Headers" section
6. Look for "Authorization"

**Expected Results**:
- ✅ See header: `Authorization: Bearer eyJ...` (JWT token)
- ✅ All API requests include the token automatically

---

## 🔍 Debugging Tips

### Check if Backend is Running
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"healthy"}`

### Check if Frontend Connects to Backend
1. Open DevTools → Network tab
2. Try to login
3. Look for POST request to `http://localhost:5000/api/v1/auth/login`
4. Should see 200 response with token

### View localStorage Tokens
```javascript
// In browser console
localStorage.getItem('jwt_token')
```

### View Auth Context State
```javascript
// In browser console, after import
import { useAuth } from './context/AuthContext'
const auth = useAuth()
console.log(auth)
```

### Check for CORS Errors
- If you see "CORS error" in console
- Make sure backend has CORS enabled: `CORS(app)` in app.py

---

## 📝 Form Validation Rules

### Registration Form

| Field | Rule | Example |
|-------|------|---------|
| Username | Min 3 chars | `john_doe` ✅, `ab` ❌ |
| Email | Valid format | `john@example.com` ✅, `john@` ❌ |
| Password | 8+ chars, uppercase, lowercase, number | `TestPass123` ✅, `test` ❌ |
| Confirm | Must match password | Match required |
| First Name | Required | `John` |
| Last Name | Required | `Doe` |
| Role | Select from list | Warehouse Staff, etc. |

### Login Form

| Field | Rule | Required |
|-------|------|----------|
| Username | Any | Yes |
| Password | Any | Yes |

---

## 🎯 Success Criteria Checklist

### Core Authentication
- [ ] Can see login page at http://localhost:5173
- [ ] Can login with testmanager / TestPass123
- [ ] Dashboard loads after login
- [ ] User name appears in navbar
- [ ] Can logout and return to login
- [ ] Stays logged in after refresh
- [ ] Cannot access /products without login

### Registration
- [ ] Can navigate to /register
- [ ] Form validates username (min 3 chars)
- [ ] Form validates email format
- [ ] Form validates password (8+, uppercase, lowercase, number)
- [ ] Form checks password confirmation match
- [ ] Can create new account
- [ ] Can login with new account

### User Profile
- [ ] Can view profile after login
- [ ] Profile shows all user info correctly
- [ ] Logout link in navbar works

### API Integration
- [ ] Requests include Authorization header
- [ ] Token sent with all requests
- [ ] Expired tokens handled (401 responses)

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /login"
**Solution**: Frontend might not be running. Start it with `npm run dev`

### Issue: Login fails with "Cannot connect"
**Solution**: Backend might not be running. Start it with `python3 app.py`

### Issue: "Invalid credentials" on demo login
**Solution**: Make sure backend has the test user. Run test-all.sh first.

### Issue: Token not saved after login
**Solution**: Check if localStorage is enabled in browser settings

### Issue: Stays on login page after clicking "Sign In"
**Solution**: Check browser console for errors (F12 → Console)

### Issue: "Module not found" error
**Solution**: Make sure all files were created. Check `/frontend/src/context/` exists.

### Issue: Navbar shows "undefined" instead of user name
**Solution**: Auth context not properly wrapping app. Check main.jsx has `<AuthProvider>`

---

## 📊 Request/Response Examples

### Login Request
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testmanager",
    "password": "TestPass123"
  }'
```

### Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "testmanager",
    "role": "Warehouse Staff"
  },
  "otp_enabled": false
}
```

### Profile Request
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer {token}"
```

### Profile Response
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "testmanager",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "Manager",
    "role": "Warehouse Staff",
    "is_active": true
  }
}
```

---

## 🎬 Demo Flow (5 minutes)

1. **Start servers** (2 min)
   - Terminal 1: Backend
   - Terminal 2: Frontend

2. **Login demo** (1 min)
   - Visit http://localhost:5173
   - Login: testmanager / TestPass123
   - See dashboard
   - Logout

3. **Register demo** (1 min)
   - Register new user
   - Login with new credentials
   - See profile

4. **Verify persistence** (1 min)
   - Refresh page
   - Still logged in
   - Check localStorage for token

---

## 📚 File Locations

```
Frontend Auth Files:
├── /frontend/src/context/AuthContext.jsx       (Auth state)
├── /frontend/src/services/authService.js       (API calls)
├── /frontend/src/components/auth/ProtectedRoute.jsx (Route guard)
├── /frontend/src/pages/LoginPage.jsx           (Login UI)
├── /frontend/src/pages/RegisterPage.jsx        (Register UI)
├── /frontend/src/pages/ProfilePage.jsx         (Profile UI)
├── /frontend/src/components/layout/Navbar.jsx  (Updated navbar)
├── /frontend/src/App.jsx                       (Updated routes)
└── /frontend/src/main.jsx                      (Updated provider)
```

---

## ✅ Ready to Test!

Everything is set up. You can now:

1. ✅ Test complete authentication flow
2. ✅ Register new users
3. ✅ Manage user sessions
4. ✅ Access protected routes
5. ✅ View user profiles

**Start testing with**:
```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit
./start-backend.sh  # Terminal 1
./start-frontend.sh # Terminal 2
```

Then visit: http://localhost:5173 🎉

---

**Need help?** Check the browser console (F12 → Console) for detailed error messages!
