# CoreInventory - Inventory Management System

A complete, production-ready backend system for inventory management with Python Flask, MySQL, and REST APIs.

## 🎯 Features

### Authentication & Security
- User signup/login with JWT tokens
- Two-factor authentication (TOTP/OTP)
- Password reset with OTP verification
- Role-based access control (Inventory Manager, Warehouse Staff)
- Bcrypt password hashing
- Complete audit trail for all operations

### Product Management
- Create and manage products with SKU
- Organize products by categories
- Track inventory per warehouse location
- Product status management

### Warehouse Management
- Multiple warehouses support
- Rack/zone/shelf location types
- Per-location inventory tracking
- Location capacity management

### Inventory Operations

#### Receipts (Incoming Goods)
- Create purchase orders
- Add multiple items per receipt
- Validate and finalize receipts
- Automatic stock increase with audit trail

#### Deliveries (Outgoing Goods)
- Create delivery orders
- Pick and pack workflow
- Validate deliveries
- Automatic stock reduction

#### Internal Transfers
- Move stock between warehouses
- Transfer between racks/locations
- Track transfer status
- Complete transfer workflow

#### Stock Adjustments
- Reconcile system vs physical counts
- Track adjustment reasons (damage, loss, recount, etc.)
- Approval workflow
- Audit trail for all adjustments

### Stock Ledger
- Complete audit trail of all operations
- Track quantity changes with before/after values
- Operation type classification
- Location source and destination tracking
- User and timestamp tracking

## 📋 System Architecture

```
CoreInventory/
├── app/
│   ├── models/          # SQLAlchemy ORM models
│   ├── routes/          # API blueprints
│   │   ├── auth.py      # Authentication endpoints
│   │   ├── products.py  # Product management
│   │   ├── warehouses.py # Warehouse & location management
│   │   ├── suppliers.py # Supplier management
│   │   └── inventory.py # Inventory operations
│   └── utils/           # Helper functions
│       └── __init__.py  # Auth, validation, sequence generation
├── database/
│   └── schema.sql       # MySQL database schema
├── app.py               # Flask app factory
├── config.py            # Configuration management
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## 🛠️ Tech Stack

- **Backend**: Python 3.8+
- **Framework**: Flask 2.3.3
- **Database**: MySQL 5.7+
- **ORM**: SQLAlchemy
- **Authentication**: JWT + PyOTP (TOTP)
- **Password Hashing**: Werkzeug
- **QR Code Generation**: qrcode
- **Environment**: python-dotenv

## 📦 Installation

### Prerequisites
- Python 3.8 or higher
- MySQL 5.7 or higher
- pip package manager

### Step 1: Clone and Setup
```bash
cd CoreInventory
```

### Step 2: Create Virtual Environment (Optional but Recommended)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# Important: Update database credentials
```

### Step 5: Create Database
```bash
# Login to MySQL
mysql -u root -p

# Run schema file
mysql -u root -p < database/schema.sql

# Or manually create database and import
CREATE DATABASE coreinventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE coreinventory;
SOURCE database/schema.sql;
```

### Step 6: Run Application
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## 🚀 Quick Start

### 1. Create a User Account
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

### 2. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

Copy the returned JWT token for subsequent requests.

### 3. Create Warehouse
```bash
curl -X POST http://localhost:5000/api/v1/warehouses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "location": "New York, NY",
    "capacity": 10000
  }'
```

### 4. Add Location (Rack)
```bash
curl -X POST http://localhost:5000/api/v1/warehouses/1/locations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rack_code": "RACK-A1",
    "location_type": "Rack",
    "capacity": 500
  }'
```

### 5. Create Product Category
```bash
curl -X POST http://localhost:5000/api/v1/products/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic items and accessories"
  }'
```

### 6. Create Product
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "USB-CABLE-001",
    "name": "USB Type-C Cable",
    "category_id": 1,
    "unit_of_measure": "pieces",
    "description": "3-meter USB Type-C cable",
    "initial_stock": 100
  }'
```

### 7. Create Supplier
```bash
curl -X POST http://localhost:5000/api/v1/suppliers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics Inc",
    "contact_person": "Jane Smith",
    "email": "contact@electronics.com",
    "phone": "+1-555-0101",
    "city": "San Francisco",
    "country": "USA"
  }'
```

### 8. Create Receipt (Receive Goods)
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "warehouse_id": 1,
    "notes": "Purchase Order #PO-2024-001"
  }'
```

### 9. Add Items to Receipt
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts/1/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_expected": 50,
    "location_id": 1,
    "unit_price": 15.99
  }'
```

### 10. Validate Receipt (Increase Stock)
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts/1/validate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_1_received": 50
  }'
```

## 📚 API Documentation

Complete API documentation is available in `API_DOCUMENTATION.md`

### Key Endpoints
- `POST /api/v1/auth/signup` - User registration
- `POST /api/v1/auth/login` - User login
- `GET/POST /api/v1/products` - Product management
- `GET/POST /api/v1/warehouses` - Warehouse management
- `GET/POST /api/v1/suppliers` - Supplier management
- `GET/POST /api/v1/inventory/receipts` - Receive goods
- `GET/POST /api/v1/inventory/deliveries` - Ship goods
- `GET/POST /api/v1/inventory/transfers` - Transfer stock
- `GET/POST /api/v1/inventory/adjustments` - Reconcile stock
- `GET /api/v1/inventory/ledger` - View audit trail

## 🔐 Authentication

All API endpoints require JWT authentication (except signup/login):

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Getting a Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }'
```

Response includes `token` field to use in Authorization header.

## 👥 Role-Based Access

### Inventory Manager
- Full system access
- Can validate receipts and deliveries
- Can approve stock adjustments
- Can create/update/delete products and warehouses

### Warehouse Staff
- Can create receipts and deliveries (not validate)
- Can perform transfers
- Can create adjustments (not approve)
- View-only access to inventory

## 📊 Database Schema

### Core Tables
- **users** - User accounts with authentication
- **products** - Product catalog
- **categories** - Product categories
- **warehouses** - Warehouse locations
- **locations** - Racks/zones within warehouses
- **inventory** - Stock per location
- **suppliers** - Supplier information

### Operations Tables
- **receipts/receipt_items** - Incoming goods
- **deliveries/delivery_items** - Outgoing goods
- **transfers/transfer_items** - Stock movements
- **adjustments** - Stock reconciliation
- **stock_ledger** - Complete audit trail

## 🔍 Stock Flow Example

### Receiving Goods
```
1. Create Receipt (Draft)
2. Add Items to Receipt
3. Validate Receipt → Stock automatically increases
4. Entry recorded in Stock Ledger
```

### Shipping Goods
```
1. Create Delivery (Draft)
2. Add Items to Delivery
3. Update Pick/Pack Status
4. Validate Delivery → Stock automatically decreases
5. Entry recorded in Stock Ledger
```

### Moving Stock
```
1. Create Transfer
2. Add Items to Transfer
3. Mark In Transit
4. Complete Transfer → Stock moves between locations
5. Entry recorded in Stock Ledger
```

### Reconciliation
```
1. Create Adjustment (System vs Physical count)
2. Specify difference and reason
3. Approve Adjustment → Stock updated
4. Entry recorded in Stock Ledger
```

## 🧪 Testing

### Health Check
```bash
curl http://localhost:5000/health
```

### Test API with Postman
1. Import the collection (see examples in API_DOCUMENTATION.md)
2. Set base URL to `http://localhost:5000`
3. Add JWT token to Authorization header after login

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL is running: `brew services start mysql`
- Verify credentials in `.env` file
- Ensure database exists: `mysql -u root -p -e "USE coreinventory;"`

### JWT Token Invalid
- Token has expired (check JWT_ACCESS_TOKEN_EXPIRES in config)
- Verify token is in Authorization header as "Bearer TOKEN"
- Login again to get a fresh token

### Import Errors
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again
- Check Python version is 3.8+

### Port Already in Use
- Change port in app.py: `app.run(port=5001)`
- Or kill existing process: `lsof -ti:5000 | xargs kill`

## 📝 Configuration

### Environment Variables (.env)
```
FLASK_ENV=development
DEBUG=True
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coreinventory
JWT_SECRET_KEY=change_this_in_production
JWT_ACCESS_TOKEN_EXPIRES=3600
```

### Database Connection
MySQL string format: `mysql+pymysql://user:password@host:port/database`

## 🚢 Production Deployment

### Before Deploying
1. Set `FLASK_ENV=production`
2. Set `DEBUG=False`
3. Generate new `JWT_SECRET_KEY`
4. Use strong database password
5. Enable HTTPS/SSL
6. Setup proper logging
7. Configure database backups

### Deployment Options
- AWS RDS for MySQL
- DigitalOcean App Platform
- Heroku with ClearDB
- Docker containers

## 📈 Performance Optimization

- Database indexes on frequently queried fields (SKU, warehouse_id, status)
- Pagination support for large datasets
- Efficient query filtering
- Connection pooling
- Denormalized summary queries

## 🔒 Security Considerations

1. **Passwords**: Bcrypt hashing with salt
2. **Tokens**: JWT with expiration
3. **OTP**: TOTP-based 2FA
4. **Input Validation**: Strong validation on all inputs
5. **SQL Injection**: SQLAlchemy ORM prevents SQL injection
6. **CORS**: Configure as needed for frontend
7. **Rate Limiting**: Consider adding for production

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Flask-JWT-Extended](https://flask-jwt-extended.readthedocs.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## 📄 License

This project is provided as-is for educational and commercial use.

## 🤝 Support

For issues, questions, or suggestions:
1. Check the API documentation
2. Review database schema
3. Check application logs
4. Verify environment configuration

## 🎉 Get Started Now!

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Configure database
# Edit .env with your MySQL credentials

# 3. Create database
mysql -u root -p < database/schema.sql

# 4. Run the app
python app.py

# 5. Test the API
curl http://localhost:5000/health
```

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: March 2024
