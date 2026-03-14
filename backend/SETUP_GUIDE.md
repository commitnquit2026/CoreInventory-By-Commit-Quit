# CoreInventory Setup Guide

Complete step-by-step setup instructions for the CoreInventory Inventory Management System.

## Prerequisites

Before starting, ensure you have:
- Python 3.8 or higher
- MySQL 5.7 or higher
- pip (Python package manager)
- curl (for API testing) or Postman
- Terminal/Command Prompt access

### Check Versions
```bash
python --version
mysql --version
```

---

## Installation Steps

### Step 1: Navigate to Project Directory
```bash
cd /path/to/CoreInventory
```

### Step 2: Create Virtual Environment (Recommended)

#### macOS/Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Windows (PowerShell)
```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

#### Windows (Command Prompt)
```bash
python -m venv venv
venv\Scripts\activate.bat
```

### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

#### Copy the example file
```bash
cp .env.example .env
```

#### Edit the `.env` file with your settings
```
FLASK_ENV=development
DEBUG=True

# Database credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=coreinventory
DB_PORT=3306

# JWT Configuration
JWT_SECRET_KEY=your_very_long_and_random_secret_key_here
JWT_ACCESS_TOKEN_EXPIRES=3600
```

### Step 5: Create MySQL Database

#### Option A: Using MySQL Command Line

1. Start MySQL (if not already running)
```bash
# macOS with Homebrew
brew services start mysql

# Or manually start MySQL
mysql.server start
```

2. Login to MySQL
```bash
mysql -u root -p
```

3. Create database and import schema
```sql
CREATE DATABASE coreinventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coreinventory;
SOURCE /path/to/CoreInventory/database/schema.sql;
```

#### Option B: Using Command Line (Direct)
```bash
# Create database
mysql -u root -p < database/schema.sql
```

#### Verify Database Creation
```bash
mysql -u root -p -e "USE coreinventory; SHOW TABLES;"
```

### Step 6: Start the Flask Application

```bash
python app.py
```

You should see output like:
```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

### Step 7: Test the API

#### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "CoreInventory API"
}
```

---

## Initial Setup - Create Admin User

### Step 1: Sign Up
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@coreinventory.com",
    "password": "Admin@123456",
    "first_name": "Admin",
    "last_name": "User",
    "role": "Inventory Manager"
  }'
```

Response:
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@coreinventory.com",
    "role": "Inventory Manager",
    "is_active": true
  }
}
```

### Step 2: Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {...},
  "otp_enabled": false
}
```

**Save the token for future requests:**
```bash
export TOKEN="your_jwt_token_here"
```

---

## Setting Up Test Data

Use the provided examples to create sample data. See `API_EXAMPLES.md` for complete workflow examples.

### Quick Setup
```bash
# 1. Create a warehouse
curl -X POST http://localhost:5000/api/v1/warehouses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "location": "New York, NY",
    "capacity": 5000
  }'

# 2. Create a location
curl -X POST http://localhost:5000/api/v1/warehouses/1/locations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rack_code": "RACK-A1",
    "location_type": "Rack",
    "capacity": 500
  }'

# 3. Create product category
curl -X POST http://localhost:5000/api/v1/products/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic items"
  }'

# 4. Create product
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "USB-CABLE-001",
    "name": "USB Type-C Cable",
    "category_id": 1,
    "unit_of_measure": "pieces",
    "initial_stock": 100
  }'

# 5. Create supplier
curl -X POST http://localhost:5000/api/v1/suppliers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics Inc",
    "contact_person": "Jane Smith",
    "email": "contact@electronics.com",
    "phone": "+1-555-0101"
  }'
```

---

## Using Postman for API Testing

### Import Postman Collection

1. Open Postman
2. Click "Import"
3. Create requests for each endpoint
4. Set Base URL: `http://localhost:5000/api/v1`

### Postman Environment Variables
Create an environment with:
```
{
  "base_url": "http://localhost:5000/api/v1",
  "token": "your_jwt_token_here"
}
```

Use `{{base_url}}` and `{{token}}` in requests.

---

## Troubleshooting

### Issue: MySQL Connection Error
```
Error: (2003, "Can't connect to MySQL server on 'localhost' (61)")
```

**Solutions:**
1. Check MySQL is running
```bash
mysql -u root -p -e "SELECT 1"
```

2. Verify credentials in `.env`
3. Check DB_HOST and DB_PORT settings
4. Restart MySQL service
```bash
brew services restart mysql
```

### Issue: Import Error - Module not found
```
ImportError: No module named 'flask'
```

**Solutions:**
1. Verify virtual environment is activated
2. Reinstall dependencies
```bash
pip install -r requirements.txt
```

3. Check Python version (must be 3.8+)

### Issue: Port 5000 Already in Use
```
OSError: [Errno 48] Address already in use
```

**Solutions:**
1. Kill the process on port 5000
```bash
lsof -ti:5000 | xargs kill
```

2. Or change port in `app.py`:
```python
app.run(host='0.0.0.0', port=5001)
```

### Issue: JWT Token Invalid
```
"msg": "Invalid token"
```

**Solutions:**
1. Token has expired (get new token by logging in)
2. Token malformed in Authorization header
3. Use format: `Authorization: Bearer YOUR_TOKEN`
4. Check JWT_SECRET_KEY matches in `.env`

### Issue: Database Table Doesn't Exist
```
OperationalError: (1146, "Table 'coreinventory.users' doesn't exist")
```

**Solutions:**
1. Verify database schema was imported
```bash
mysql -u root -p coreinventory -e "SHOW TABLES;"
```

2. Re-run schema import
```bash
mysql -u root -p < database/schema.sql
```

3. Delete and recreate database
```bash
mysql -u root -p -e "DROP DATABASE coreinventory; CREATE DATABASE coreinventory;"
mysql -u root -p < database/schema.sql
```

---

## Development Workflow

### Daily Development

#### 1. Activate Virtual Environment
```bash
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

#### 2. Start Application
```bash
python app.py
```

#### 3. Test Endpoints
Use curl or Postman

#### 4. View Logs
Application logs are shown in the terminal

#### 5. Deactivate Environment (When Done)
```bash
deactivate
```

### Making Code Changes

1. Edit files in `app/` directory
2. Flask auto-reloads on file changes (when DEBUG=True)
3. If changes don't appear, restart the app
4. Check syntax with Python linter
```bash
pip install pylint
pylint app/
```

---

## Database Maintenance

### Backup Database
```bash
mysqldump -u root -p coreinventory > backup.sql
```

### Restore Database
```bash
mysql -u root -p coreinventory < backup.sql
```

### View Database Schema
```bash
mysql -u root -p -e "DESCRIBE coreinventory.users;"
```

### Check Database Size
```bash
mysql -u root -p -e "SELECT table_name, round(((data_length + index_length) / 1024 / 1024), 2) AS size_mb FROM information_schema.tables WHERE table_schema = 'coreinventory';"
```

---

## Production Deployment Checklist

- [ ] Set FLASK_ENV=production
- [ ] Set DEBUG=False
- [ ] Change JWT_SECRET_KEY to random value
- [ ] Use strong database password
- [ ] Configure HTTPS/SSL
- [ ] Setup database backups
- [ ] Configure error logging
- [ ] Setup monitoring
- [ ] Configure firewall rules
- [ ] Use environment-specific .env files
- [ ] Test all endpoints
- [ ] Setup database migrations
- [ ] Configure database connection pooling

---

## Architecture Overview

```
CoreInventory/
├── app.py                           # Flask app factory
├── config.py                        # Configuration
├── requirements.txt                 # Dependencies
├── .env                             # Environment variables
├── database/
│   └── schema.sql                   # MySQL schema
├── app/
│   ├── models/
│   │   └── __init__.py             # SQLAlchemy models
│   ├── routes/
│   │   ├── auth.py                 # Authentication
│   │   ├── products.py             # Products
│   │   ├── warehouses.py           # Warehouses
│   │   ├── suppliers.py            # Suppliers
│   │   └── inventory.py            # Inventory ops
│   └── utils/
│       └── __init__.py             # Utilities
├── README.md                        # Main documentation
├── API_DOCUMENTATION.md             # API reference
├── API_EXAMPLES.md                  # Code examples
└── SETUP_GUIDE.md                   # This file
```

---

## Next Steps

1. **Review Documentation**: Read `API_DOCUMENTATION.md` for complete API reference
2. **Explore Examples**: Check `API_EXAMPLES.md` for workflow examples
3. **Test Endpoints**: Use curl or Postman to test APIs
4. **Create Test Data**: Set up sample warehouses, products, suppliers
5. **Integrate Frontend**: Build UI to consume these APIs
6. **Configure Logging**: Add logging for production
7. **Setup Monitoring**: Add alerts and monitoring
8. **Database Optimization**: Create indexes and optimize queries
9. **Security Hardening**: Review and implement security best practices
10. **Documentation**: Document custom modifications and extensions

---

## Support Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **JWT**: https://jwt.io/
- **TOTP**: https://en.wikipedia.org/wiki/Time-based_one-time_password

---

## Common Commands Reference

```bash
# Virtual Environment
python -m venv venv
source venv/bin/activate
deactivate

# Dependencies
pip install -r requirements.txt
pip list
pip show flask

# Database
mysql -u root -p
mysql -u root -p < database/schema.sql
mysqldump -u root -p coreinventory > backup.sql

# Running App
python app.py

# Testing API
curl http://localhost:5000/health
curl -X POST http://localhost:5000/api/v1/auth/login ...

# Git (if using version control)
git init
git add .
git commit -m "Initial commit"
```

---

**Version**: 1.0.0  
**Last Updated**: March 2024
