# 🚀 START HERE - CoreInventory Setup in 5 Minutes

Welcome to **CoreInventory**, your complete inventory management system backend!

This file will get you up and running in **5 minutes**.

---

## ⚡ The Fastest Path to Success

### Step 1: Check Prerequisites (30 seconds)

Verify you have:
```bash
python --version      # Should be 3.8+
mysql --version       # Should be 5.7+
pip --version         # Should exist
```

### Step 2: Install Dependencies (1 minute)

```bash
cd /path/to/CoreInventory
pip install -r requirements.txt
```

### Step 3: Configure Database (2 minutes)

#### Edit `.env` file:
```bash
nano .env
```

Update these lines:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=coreinventory
```

#### Create database:
```bash
mysql -u root -p < database/schema.sql
```

### Step 4: Run Application (1 minute)

```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

### Step 5: Test It Works (30 seconds)

In another terminal:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status": "healthy", "service": "CoreInventory API"}
```

✅ **You're done!** Your system is running!

---

## 📚 Next Steps

### Create Your First User
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123456",
    "first_name": "Admin",
    "last_name": "User",
    "role": "Inventory Manager"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

**Save the token you get!** You'll need it for other requests.

---

## 📖 Documentation to Read

Read these in order:

1. **This file** (5 min) - You're reading it! ✓
2. **[README.md](README.md)** (20 min) - Features & quick reference
3. **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** (30 min) - All endpoints
4. **[API_EXAMPLES.md](API_EXAMPLES.md)** (15 min) - Real examples you can copy-paste
5. **[SETUP_GUIDE.md](SETUP_GUIDE.md)** (20 min) - Detailed setup & troubleshooting

For a full overview: **[INDEX.md](INDEX.md)**

---

## 🎯 Common Tasks

### "I want to test an endpoint"
→ Go to [API_EXAMPLES.md](API_EXAMPLES.md) and copy-paste a command

### "I'm getting an error"
→ Check [SETUP_GUIDE.md](SETUP_GUIDE.md) Troubleshooting section

### "I want to understand the database"
→ Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) Database section

### "I want to deploy to production"
→ Check [README.md](README.md) Production Deployment section

### "I want to see a complete workflow"
→ Check [API_EXAMPLES.md](API_EXAMPLES.md) Complete Workflow Example section

---

## 🔑 Key URLs & Commands

### Local API
```
http://localhost:5000/api/v1
```

### Health Check
```bash
curl http://localhost:5000/health
```

### Stop Application
```
Press Ctrl+C in the terminal
```

### Activate Virtual Environment (optional)
```bash
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

---

## 🆘 Common Issues & Quick Fixes

### "MySQL connection error"
```bash
# Start MySQL
brew services start mysql    # macOS
mysql.server start          # Linux
```

### "Port 5000 already in use"
```bash
lsof -ti:5000 | xargs kill
```

### "Module not found"
```bash
pip install -r requirements.txt
```

### "Password validation failed"
Password must have:
- At least 8 characters
- One uppercase letter
- One digit

Example: `Admin@123456`

---

## 📊 What You Have

✅ **52 API Endpoints** - Complete REST API  
✅ **16 Database Tables** - Normalized schema  
✅ **5 Route Modules** - Organized code  
✅ **Authentication** - JWT + OTP  
✅ **Full Workflow** - Receipts → Deliveries → Transfers  
✅ **Audit Trail** - Stock ledger  
✅ **100+ Pages** - Comprehensive documentation  

---

## 🎓 System Architecture

```
Your Request
    ↓
[Flask App] (app.py)
    ↓
[Route Handler] (app/routes/)
    ↓
[Business Logic + Validation] (app/utils/)
    ↓
[Database Model] (app/models/)
    ↓
[MySQL Database]
    ↓
Response (JSON)
```

---

## 🔐 User Roles

### Inventory Manager
- Can create/update products
- Can validate receipts & deliveries
- Can approve adjustments
- Full system access

### Warehouse Staff
- Can create receipts & deliveries (but not validate)
- Can create adjustments (but not approve)
- Can perform transfers
- View-only access to reports

---

## 📋 Default Configuration

| Setting | Value |
|---------|-------|
| Port | 5000 |
| Database | MySQL (localhost:3306) |
| Environment | development |
| Debug Mode | enabled |
| JWT Expiration | 1 hour |

---

## 🚦 Quick Status Check

Run this to verify everything works:

```bash
# 1. Check Flask is running
curl http://localhost:5000/health

# 2. Create admin user
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test@1234","first_name":"Test","last_name":"User","role":"Inventory Manager"}'

# 3. Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"Test@1234"}'

# 4. If you got a token, you're good!
```

---

## 📞 Need Help?

1. **Setup problem?** → [SETUP_GUIDE.md](SETUP_GUIDE.md)
2. **API question?** → [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. **Need examples?** → [API_EXAMPLES.md](API_EXAMPLES.md)
4. **Lost?** → [INDEX.md](INDEX.md)

---

## 🎉 You're Ready!

You now have a production-ready inventory management system.

### What's Next?
1. Read [README.md](README.md) for complete overview
2. Try the examples in [API_EXAMPLES.md](API_EXAMPLES.md)
3. Setup test data
4. Integrate with your frontend

---

## 💡 Pro Tips

- Keep your JWT token handy (doesn't expire for 1 hour)
- Test endpoints with curl or Postman
- Read the error messages - they're helpful!
- Check the database schema for understanding the structure
- Use pagination on list endpoints for large datasets

---

**Happy Coding! 🚀**

*CoreInventory v1.0.0 - Production Ready*
