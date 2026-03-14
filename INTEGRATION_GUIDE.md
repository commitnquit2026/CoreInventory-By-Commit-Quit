# 🔗 Frontend-Backend Integration Guide

This guide shows you how to integrate your **React Frontend** with your **Flask Backend** (CoreInventory).

---

## 📁 Project Structure

```
/Users/miteshrao/Desktop/Commit and Quit/
├── backend/              ← Flask API (Port 5000)
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   ├── .env
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── database/
│       └── schema.sql
│
└── frontend/             ← React App (Port 5173)
    ├── package.json
    ├── vite.config.js
    ├── src/
    │   ├── services/
    │   │   ├── http.js       ← API Configuration
    │   │   └── inventoryService.js
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    └── index.html
```

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Terminal 1: Start Backend

```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit/backend
python3 app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### 2️⃣ Terminal 2: Start Frontend

```bash
cd /Users/miteshrao/Desktop/Commit\ and\ Quit/frontend
npm run dev
```

You should see:
```
VITE v5.0.0 ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 3️⃣ Visit Frontend

Open your browser and go to:
```
http://localhost:5173
```

✅ **Done!** Frontend and Backend are now running together.

---

## 🔧 Configuration

### Backend Configuration (Already Done ✓)

Your backend is configured in `/backend/config.py`:

```python
class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost:3306/coreinventory'
    JWT_SECRET_KEY = 'your-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
```

**Port**: `5000`  
**API Base URL**: `http://localhost:5000/api/v1`

### Frontend Configuration (Update Required)

Update `/frontend/src/services/http.js`:

```javascript
import axios from 'axios'

// For development: use local backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.coreinventory.com/api/v1'  // Production URL
  : 'http://localhost:5000/api/v1'           // Development URL

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 9000,
})

// Add JWT token to all requests
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - redirect to login
    if (error?.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    
    const message =
      error?.response?.data?.message || 'Unexpected API error. Please retry.'
    return Promise.reject(new Error(message))
  },
)

export default http
```

---

## 🔐 Authentication Flow

### 1. User Signs Up

**Frontend**:
```javascript
import http from '../services/http'

const signup = async (userData) => {
  const response = await http.post('/auth/signup', {
    username: userData.username,
    email: userData.email,
    password: userData.password,
    first_name: userData.firstName,
    last_name: userData.lastName,
    role: 'Inventory Manager' // or 'Warehouse Staff'
  })
  return response.data
}
```

**Backend Response**:
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Inventory Manager"
  }
}
```

### 2. User Logs In

**Frontend**:
```javascript
const login = async (username, password) => {
  const response = await http.post('/auth/login', {
    username,
    password
  })
  
  // Save token
  localStorage.setItem('auth_token', response.data.data.access_token)
  
  return response.data
}
```

**Backend Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGc...",
    "user": {
      "id": 1,
      "username": "john_doe",
      "role": "Inventory Manager"
    }
  }
}
```

### 3. Use Token in All Requests

The `http.js` interceptor automatically adds the token:
```
Authorization: Bearer eyJhbGc...
```

---

## 📡 API Endpoints

Your frontend can now use these 52 endpoints:

### Authentication (8 endpoints)
- `POST /auth/signup` - Create user
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `POST /auth/setup-2fa` - Enable 2FA
- `POST /auth/verify-2fa` - Verify 2FA code
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/reset-password` - Reset password
- `POST /auth/change-password` - Change password

### Products (9 endpoints)
- `GET /products` - List products (paginated)
- `POST /products` - Create product
- `GET /products/<id>` - Get product details
- `PUT /products/<id>` - Update product
- `DELETE /products/<id>` - Delete product
- `POST /products/categories` - Create category
- `GET /products/inventory/summary` - Stock summary
- `GET /products/inventory/product/<id>` - Product inventory
- `GET /products/inventory/location/<id>` - Location inventory

### Warehouses (8 endpoints)
- `GET /warehouses` - List warehouses
- `POST /warehouses` - Create warehouse
- `GET /warehouses/<id>` - Get warehouse
- `PUT /warehouses/<id>` - Update warehouse
- `DELETE /warehouses/<id>` - Delete warehouse
- `GET /warehouses/<id>/locations` - Get locations
- `POST /warehouses/<id>/locations` - Add location
- `PUT /locations/<id>` - Update location

### Inventory Operations (23 endpoints)
- **Receipts** (5 endpoints)
- **Deliveries** (5 endpoints)
- **Transfers** (5 endpoints)
- **Adjustments** (4 endpoints)
- **Stock Ledger** (4 endpoints)

### Suppliers (4 endpoints)
- `GET /suppliers` - List suppliers
- `POST /suppliers` - Create supplier
- `GET /suppliers/<id>` - Get supplier
- `PUT /suppliers/<id>` - Update supplier

---

## 🧪 Test Integration

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

Response:
```json
{
  "status": "healthy",
  "service": "CoreInventory API"
}
```

### Test 2: Signup

```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@1234",
    "first_name": "Test",
    "last_name": "User",
    "role": "Inventory Manager"
  }'
```

### Test 3: Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test@1234"
  }'
```

Save the `access_token` from the response.

### Test 4: Get Profile (Authenticated)

```bash
curl http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**: Update `/backend/config.py`:

```python
from flask_cors import CORS

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    # ... rest of setup
```

Then install CORS:
```bash
pip install Flask-CORS
```

### Issue 2: 404 Not Found

**Error**: `Cannot POST /api/v1/auth/login`

**Check**:
1. Is backend running on `http://localhost:5000`?
2. Is the API base URL in `http.js` correct?
3. Are all route files in `/backend/app/routes/` created?

### Issue 3: 401 Unauthorized

**Error**: `Unauthorized` when calling protected endpoints

**Solution**:
1. Make sure you logged in and got a token
2. Token is saved in `localStorage.getItem('auth_token')`
3. Token is included in request headers

### Issue 4: 500 Database Error

**Error**: `Internal server error` from backend

**Check**:
1. Is MySQL running?
2. Is the database created? (`mysql -u root -p < database/schema.sql`)
3. Check `.env` file has correct database credentials

---

## 📦 Environment Variables

### Backend (.env)

```
FLASK_ENV=development
FLASK_APP=app.py
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coreinventory
JWT_SECRET_KEY=your-secret-key-here
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:5000/api/v1
```

Then use in frontend:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

---

## 🔄 Complete Workflow Example

### 1. User Signs Up (Frontend)

```javascript
// src/pages/Signup.jsx
import http from '../services/http'

export default function SignupPage() {
  const handleSignup = async (e) => {
    e.preventDefault()
    
    try {
      const response = await http.post('/auth/signup', {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'SecurePass@123',
        first_name: 'John',
        last_name: 'Doe',
        role: 'Inventory Manager'
      })
      
      console.log('Signup successful:', response.data)
      // Redirect to login
    } catch (error) {
      console.error('Signup failed:', error.message)
    }
  }
  
  return (
    <form onSubmit={handleSignup}>
      {/* Form fields */}
    </form>
  )
}
```

### 2. User Logs In (Frontend)

```javascript
// src/pages/Login.jsx
import http from '../services/http'

export default function LoginPage() {
  const handleLogin = async (e) => {
    e.preventDefault()
    
    try {
      const response = await http.post('/auth/login', {
        username: 'john_doe',
        password: 'SecurePass@123'
      })
      
      // Save token
      localStorage.setItem('auth_token', response.data.data.access_token)
      
      // Redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Login failed:', error.message)
    }
  }
  
  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  )
}
```

### 3. List Products (Frontend)

```javascript
// src/services/inventoryService.js
import http from './http'

export const getProducts = async (page = 1, limit = 10) => {
  const response = await http.get('/products', {
    params: { page, limit }
  })
  return response.data
}
```

### 4. Create Product (Frontend)

```javascript
// src/pages/CreateProduct.jsx
import { getProducts, createProduct } from '../services/inventoryService'

export default function CreateProductPage() {
  const handleCreate = async (e) => {
    e.preventDefault()
    
    try {
      const response = await http.post('/products', {
        name: 'Product Name',
        sku: 'SKU-001',
        description: 'Description',
        category_id: 1,
        unit_of_measure: 'pieces',
        reorder_level: 10
      })
      
      console.log('Product created:', response.data)
    } catch (error) {
      console.error('Error:', error.message)
    }
  }
  
  return (
    <form onSubmit={handleCreate}>
      {/* Form fields */}
    </form>
  )
}
```

---

## 🚢 Deployment

### Production Checklist

- [ ] Update `.env` with production database credentials
- [ ] Change `JWT_SECRET_KEY` to a strong random value
- [ ] Update frontend API URL to production domain
- [ ] Enable HTTPS for all API calls
- [ ] Setup MySQL backups
- [ ] Setup error logging (Sentry, DataDog, etc.)
- [ ] Setup monitoring (New Relic, CloudWatch, etc.)
- [ ] Setup CI/CD pipeline
- [ ] Test all endpoints in production
- [ ] Setup SSL certificates

---

## 📚 Documentation

- **Backend API**: `/backend/API_DOCUMENTATION.md`
- **API Examples**: `/backend/API_EXAMPLES.md`
- **Setup Guide**: `/backend/SETUP_GUIDE.md`
- **Project Summary**: `/backend/PROJECT_SUMMARY.md`

---

## 💡 Tips & Tricks

### Use Redux for State Management (Optional)

```bash
npm install redux react-redux redux-thunk
```

### Use React Query for API Calls (Optional)

```bash
npm install @tanstack/react-query
```

### Setup Authentication Context

```javascript
// src/context/AuthContext.jsx
import { createContext, useState } from 'react'
import http from '../services/http'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('auth_token'))
  
  const login = async (username, password) => {
    const response = await http.post('/auth/login', { username, password })
    setToken(response.data.data.access_token)
    setUser(response.data.data.user)
    localStorage.setItem('auth_token', response.data.data.access_token)
  }
  
  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
  }
  
  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
```

---

## 🆘 Need Help?

1. **Backend Issues**: Check `/backend/SETUP_GUIDE.md`
2. **API Issues**: Check `/backend/API_DOCUMENTATION.md`
3. **Examples**: Check `/backend/API_EXAMPLES.md`
4. **Database**: Check `/backend/database/schema.sql`

---

## 📞 Quick Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start frontend dev server |
| `python3 app.py` | Start backend server |
| `npm run build` | Build production frontend |
| `npm run preview` | Preview production build |
| `npm install` | Install dependencies |
| `pip install -r requirements.txt` | Install backend dependencies |

---

**🎉 You're all set! Your frontend and backend are now integrated!**

**Start building amazing features! 🚀**
