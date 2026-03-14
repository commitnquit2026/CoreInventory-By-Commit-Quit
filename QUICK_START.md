# 🎯 Frontend & Backend Integration - Quick Setup

Everything is ready to integrate! Here's what you need to do:

## ✅ What's Been Done

1. ✅ Created **INTEGRATION_GUIDE.md** - Comprehensive integration documentation
2. ✅ Updated **frontend/src/services/http.js** - Now connects to `http://localhost:5000/api/v1`
3. ✅ Updated **backend/app.py** - CORS enabled for frontend (ports 5173 and 3000)
4. ✅ Updated **backend/requirements.txt** - Added Flask-CORS

---

## 🚀 Run Both Together (2 Terminals)

### Terminal 1: Start Backend

```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit/backend

# Install CORS if not done
pip install Flask-CORS

# Run backend
python3 app.py
```

Expected output:
```
 * Running on http://127.0.0.1:5000
```

### Terminal 2: Start Frontend

```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit/frontend

npm run dev
```

Expected output:
```
VITE v5.0.0 ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## 🌐 Visit Frontend

Open your browser:
```
http://localhost:5173
```

✅ **Frontend is now connected to your backend!**

---

## 🧪 Test the Connection

### From Frontend Code

```javascript
// This will now call your Flask backend
import http from './services/http'

// Signup
await http.post('/auth/signup', {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Test@1234',
  first_name: 'Test',
  last_name: 'User',
  role: 'Inventory Manager'
})

// Login
await http.post('/auth/login', {
  username: 'testuser',
  password: 'Test@1234'
})

// Get products
await http.get('/products')
```

---

## 📖 Full Documentation

Read `/INTEGRATION_GUIDE.md` for:
- Complete workflow examples
- All 52 API endpoints
- Authentication flow
- Environment variables
- Troubleshooting
- Deployment checklist
- Tips & tricks

---

## 🔗 Your Folder Structure

```
/Commit and Quit/
├── backend/          ← Flask API (5000)
│   ├── app.py
│   ├── requirements.txt (CORS added)
│   └── app/
│
├── frontend/         ← React App (5173)
│   ├── src/
│   │   └── services/
│   │       └── http.js (UPDATED ✓)
│   └── package.json
│
└── INTEGRATION_GUIDE.md (NEW ✓)
```

---

## 🎯 Next Steps

1. **Install CORS**: `pip install Flask-CORS`
2. **Start Backend**: `python3 app.py`
3. **Start Frontend**: `npm run dev`
4. **Visit**: `http://localhost:5173`
5. **Test**: Try signup/login

---

## 📚 Reference

| What | Where | Port |
|------|-------|------|
| Backend API | `http://localhost:5000/api/v1` | 5000 |
| Frontend App | `http://localhost:5173` | 5173 |
| API Documentation | `/backend/API_DOCUMENTATION.md` | - |
| Integration Guide | `/INTEGRATION_GUIDE.md` | - |

---

## 🆘 Quick Troubleshooting

**Frontend can't reach backend?**
- Check backend is running on 5000
- Check `http.js` has correct API URL
- Check CORS error in browser console

**Backend errors?**
- Install Flask-CORS: `pip install Flask-CORS`
- Check MySQL is running
- Check .env file has correct credentials

---

**🎉 You're ready! Start building!**
