# 📦 CoreInventory - Intelligent Inventory Management System

<div align="center">

![CoreInventory Logo](frontend/public/CoreInventory_Logo.png)

**A modern, full-stack inventory management system with real-time tracking, SMTP email integration, and comprehensive analytics.**

[![GitHub](https://img.shields.io/badge/GitHub-commitnquit2026-blue?style=flat-square&logo=github)](https://github.com/commitnquit2026/CoreInventory-By-Commit-Quit)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)]()

[Features](#-features) • [Architecture](#-architecture) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Project Overview

**CoreInventory** is an enterprise-grade inventory management system designed to help businesses track, manage, and optimize their inventory across multiple warehouses. It provides real-time visibility into stock levels, automated notifications, and comprehensive reporting capabilities.

Built by **Team Commit & Quit** for the **Odoo x Indus Hackathon**, this system replaces manual registers and spreadsheets with a centralized, intelligent platform.

### 🎯 Key Objectives

- **Real-time Inventory Tracking**: Monitor stock levels across multiple locations instantly
- **Automated Operations**: Automate receipts, deliveries, transfers, and adjustments
- **Smart Notifications**: Email-based alerts for password resets and critical inventory events
- **Data-Driven Insights**: Visual dashboards and analytics for better decision-making
- **Secure Access**: JWT-based authentication with role-based access control
- **Scalable Architecture**: Microservices-ready backend with RESTful APIs

---

## 🌟 Features

### Core Features

| Feature | Description | Status |
|---------|-------------|--------|
| 📊 **Dashboard** | Real-time KPI metrics and inventory overview | ✅ Complete |
| 🔐 **Authentication** | Secure JWT-based login and registration | ✅ Complete |
| 🔑 **Password Reset** | SMTP-based OTP email verification | ✅ Complete |
| 📦 **Product Management** | Create, edit, delete, and track products | ✅ Complete |
| 🏭 **Warehouse Management** | Multi-warehouse support with capacity tracking | ✅ Complete |
| 📥 **Receipts** | Log incoming inventory with supplier tracking | ✅ Complete |
| 📦 **Deliveries** | Track outgoing shipments and customer orders | ✅ Complete |
| 🔄 **Transfers** | Move inventory between warehouses | ✅ Complete |
| 📊 **Move History** | Complete audit trail of all inventory movements | ✅ Complete |
| 📋 **Adjustments** | Manual inventory adjustments with reasons | ✅ Complete |
| 📊 **Ledger** | Comprehensive ledger view of all transactions | ✅ Complete |
| 👤 **User Profile** | Manage user settings and preferences | ✅ Complete |

### Technical Features

- 🔒 **Security**: JWT authentication, password hashing, CORS protection
- 📧 **Email Integration**: Gmail SMTP for password resets and notifications
- 💾 **Database**: MySQL with optimized schema for high-performance queries
- 🎨 **UI/UX**: Responsive design with Tailwind CSS and React components
- 📱 **Mobile Friendly**: Works seamlessly on desktop and mobile devices
- ⚡ **Performance**: Fast API response times and efficient database queries
- 🔄 **Real-time Updates**: Instant data synchronization across the application

---

## 🏗️ Architecture Overview

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Port 5173)                              │  │
│  │  ├─ Authentication Pages (Login, Register, Forgot PWD)   │  │
│  │  ├─ Dashboard (KPIs, Charts, Metrics)                    │  │
│  │  ├─ Inventory Pages (Products, Warehouses, Ledger)       │  │
│  │  ├─ Operations (Receipts, Deliveries, Transfers)         │  │
│  │  ├─ Responsive UI (Tailwind CSS)                         │  │
│  │  └─ State Management (React Context API)                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (HTTP/REST)
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  CORS, Auth Middleware, Request Validation               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Flask Backend (Port 5001)                               │  │
│  │  ├─ Auth Routes (Login, Register, Password Reset)        │  │
│  │  ├─ Product Routes (CRUD Operations)                     │  │
│  │  ├─ Warehouse Routes (Location Management)               │  │
│  │  ├─ Inventory Routes (Stock Management)                  │  │
│  │  ├─ Operation Routes (Receipts, Deliveries, Transfers)   │  │
│  │  ├─ Email Service (SMTP Integration)                     │  │
│  │  ├─ Authentication Middleware (JWT)                      │  │
│  │  └─ Validation & Error Handling                          │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (SQL)
┌─────────────────────────────────────────────────────────────────┐
│                    DATA PERSISTENCE LAYER                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MySQL Database                                          │  │
│  │  ├─ Users Table (Authentication)                        │  │
│  │  ├─ Products Table (Product Catalog)                    │  │
│  │  ├─ Warehouses Table (Location Management)              │  │
│  │  ├─ Inventory Table (Stock Levels)                      │  │
│  │  ├─ Receipts Table (Incoming Stock)                     │  │
│  │  ├─ Deliveries Table (Outgoing Stock)                   │  │
│  │  ├─ Transfers Table (Inter-warehouse Moves)             │  │
│  │  ├─ Adjustments Table (Manual Changes)                  │  │
│  │  ├─ Move History Table (Audit Trail)                    │  │
│  │  └─ Suppliers Table (Supplier Information)              │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES LAYER                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Gmail SMTP Server (for password reset emails)           │  │
│  │  ├─ TLS Encryption (smtp.gmail.com:587)                  │  │
│  │  ├─ OTP Generation & Verification                        │  │
│  │  └─ Email Templates (HTML + Plain Text)                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Diagram

```
User Authentication Flow:
├─ User Registration
│  ├─ Frontend: Form Input → Validation
│  ├─ Backend: Hash Password → Store in Database
│  └─ Response: JWT Token
│
├─ User Login
│  ├─ Frontend: Credentials Input
│  ├─ Backend: Verify Password → Generate JWT
│  ├─ Frontend: Store Token in LocalStorage
│  └─ Response: Authenticated Session
│
└─ Password Reset Flow
   ├─ Frontend: Email Input → Request Reset
   ├─ Backend: Generate OTP → Send via SMTP
   ├─ Frontend: User Receives Email
   ├─ Frontend: Enter OTP → New Password
   ├─ Backend: Verify OTP → Update Password
   └─ Response: Success Message

Inventory Management Flow:
├─ Create Product
│  ├─ Frontend: Product Form
│  ├─ Backend: Validate → Insert → Response
│  └─ Database: Store Product Data
│
├─ Receive Inventory
│  ├─ Frontend: Receipt Form
│  ├─ Backend: Log Receipt → Update Stock
│  ├─ Database: Create Receipt Record → Update Inventory
│  └─ Response: Success
│
├─ Transfer Stock
│  ├─ Frontend: Select Product & Warehouse
│  ├─ Backend: Validate Stock → Deduct From Source
│  ├─ Database: Log Transfer → Update Both Warehouses
│  └─ Response: Success
│
└─ View Analytics
   ├─ Frontend: Request Dashboard Data
   ├─ Backend: Query Database → Calculate Metrics
   ├─ Database: Aggregate Inventory Data
   └─ Response: KPI Data & Charts
```

### Component Architecture

```
Frontend (React):
├─ Pages/
│  ├─ LoginPage (Authentication)
│  ├─ RegisterPage (User Registration)
│  ├─ ForgotPasswordPage (Password Recovery)
│  ├─ DashboardPage (KPI Metrics)
│  ├─ ProductsPage (Product Management)
│  ├─ WarehousePage (Warehouse Management)
│  ├─ OperationsPage (Receipts, Deliveries, Transfers)
│  ├─ LedgerPage (Transaction History)
│  ├─ ProfilePage (User Settings)
│  └─ MoveHistoryPage (Audit Trail)
│
├─ Components/
│  ├─ Layout/ (Navigation, Sidebar)
│  ├─ Auth/ (Protected Routes)
│  ├─ Dashboard/ (Charts, KPIs)
│  ├─ Products/ (Tables, Modals)
│  ├─ Operations/ (Tabs, Forms)
│  └─ Common/ (Error, Loading States)
│
├─ Services/
│  ├─ authService.js (Login, Register, Reset)
│  ├─ inventoryService.js (CRUD Operations)
│  └─ http.js (API Client)
│
└─ Context/
   └─ AuthContext.jsx (Authentication State)

Backend (Flask):
├─ routes/
│  ├─ auth.py (Login, Register, Password Reset)
│  ├─ products.py (Product Management)
│  ├─ warehouses.py (Warehouse Management)
│  ├─ inventory.py (Stock Management)
│  ├─ receipts.py (Incoming Stock)
│  ├─ deliveries.py (Outgoing Stock)
│  ├─ suppliers.py (Supplier Management)
│  └─ movehistory.py (Audit Trail)
│
├─ utils/
│  └─ email.py (SMTP Email Service)
│
├─ models/ (SQLAlchemy ORM)
│  └─ Database Models
│
├─ app.py (Main Application)
└─ config.py (Configuration)

Database (MySQL):
├─ users (Authentication)
├─ products (Catalog)
├─ warehouses (Locations)
├─ inventory (Stock Levels)
├─ receipts (Incoming)
├─ deliveries (Outgoing)
├─ transfers (Movements)
├─ adjustments (Manual Changes)
├─ move_history (Audit Trail)
└─ suppliers (Vendor Data)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ and npm
- **Python** 3.8+
- **MySQL** 5.7+ or MariaDB
- **Git**

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/commitnquit2026/CoreInventory-By-Commit-Quit.git
cd CoreInventory-By-Commit-Quit
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env with your database and SMTP credentials

# Initialize database
python3 seed_database.py

# Start backend server
python3 app.py
# Backend runs on http://localhost:5001
```

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure API endpoint (if needed)
# Edit src/services/http.js to match your backend URL

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

#### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001/api/v1
- **Test Credentials**: 
  - Username: `testuser`
  - Password: `Test@123456`

---

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=inventory_db

# SMTP Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=3600

# Application
FLASK_ENV=development
DEBUG=True
```

### Frontend Configuration (src/services/http.js)

```javascript
const API_BASE_URL = 'http://localhost:5001/api/v1';
```

---

## 📖 API Endpoints

### Authentication

```
POST   /api/v1/auth/register          - Register new user
POST   /api/v1/auth/login             - Login user
POST   /api/v1/auth/request-password-reset - Request password reset
POST   /api/v1/auth/reset-password    - Reset password with OTP
```

### Products

```
GET    /api/v1/products               - Get all products
POST   /api/v1/products               - Create product
PUT    /api/v1/products/<id>          - Update product
DELETE /api/v1/products/<id>          - Delete product
```

### Warehouses

```
GET    /api/v1/warehouses             - Get all warehouses
POST   /api/v1/warehouses             - Create warehouse
PUT    /api/v1/warehouses/<id>        - Update warehouse
```

### Inventory

```
GET    /api/v1/inventory              - Get inventory
GET    /api/v1/inventory/stats        - Get inventory statistics
```

### Operations

```
POST   /api/v1/receipts               - Log receipt
POST   /api/v1/deliveries             - Log delivery
POST   /api/v1/transfers              - Log transfer
POST   /api/v1/adjustments            - Log adjustment
GET    /api/v1/move-history           - Get move history
```

---

## 📊 Database Schema

### Key Tables

**users**
- id, username, email, password_hash, created_at, updated_at

**products**
- id, name, sku, description, created_at, updated_at

**warehouses**
- id, name, location, capacity, created_at, updated_at

**inventory**
- id, product_id, warehouse_id, quantity, created_at, updated_at

**receipts**
- id, product_id, warehouse_id, quantity, supplier_id, created_at

**deliveries**
- id, product_id, warehouse_id, quantity, customer, created_at

**transfers**
- id, product_id, from_warehouse_id, to_warehouse_id, quantity, created_at

**move_history**
- id, product_id, warehouse_id, operation_type, quantity, created_at

See `/backend/database/schema.sql` for complete database structure.

---

## 🔐 Security Features

✅ **Password Security**
- Passwords hashed using bcrypt
- PBKDF2 key derivation for sensitive operations

✅ **Authentication**
- JWT tokens for stateless authentication
- Token-based session management
- Automatic token expiration

✅ **Data Protection**
- CORS enabled for authorized origins
- SQL injection prevention with parameterized queries
- Input validation and sanitization

✅ **Email Security**
- TLS encryption for SMTP connections
- OTP-based password reset
- Email verification for critical operations

---

## 🧪 Testing

### SMTP Configuration Test

```bash
cd backend
python test_smtp.py
```

This will verify:
- ✅ SMTP connection to Gmail
- ✅ TLS encryption setup
- ✅ Authentication credentials
- ✅ Optional test email sending

### Manual API Testing

Using cURL:

```bash
# Register
curl -X POST http://localhost:5001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test@123456"}'

# Login
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test@123456"}'

# Get Products (requires token)
curl -X GET http://localhost:5001/api/v1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📁 Project Structure

```
CoreInventory/
├── backend/                    # Flask backend application
│   ├── app/
│   │   ├── routes/            # API endpoints
│   │   ├── utils/             # Helper functions (email service)
│   │   └── models/            # Database models
│   ├── database/
│   │   └── schema.sql         # Database schema
│   ├── app.py                 # Main application
│   ├── config.py              # Configuration
│   ├── requirements.txt        # Python dependencies
│   ├── test_smtp.py           # SMTP testing utility
│   └── .env.example           # Environment template
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── services/          # API services
│   │   ├── context/           # React Context
│   │   ├── utils/             # Utilities
│   │   ├── App.jsx            # Root component
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── postcss.config.js      # PostCSS config
│
└── README.md                  # This file
```

---

## 🎨 Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom React components
- **State Management**: React Context API
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Flask
- **Database ORM**: SQLAlchemy
- **Database**: MySQL
- **Authentication**: JWT (PyJWT)
- **Email**: SMTP (smtplib)
- **Server**: Gunicorn (production)

### DevOps & Tools
- **Version Control**: Git & GitHub
- **Package Managers**: npm, pip
- **Environment**: Python 3.8+, Node.js 16+

---

## 📝 Documentation

Additional documentation is available in:

- **Backend Setup**: `/backend/SETUP_GUIDE.md`
- **SMTP Configuration**: `/backend/SMTP_SETUP_GUIDE.md`
- **Password Reset**: `/backend/PASSWORD_RESET_GUIDE.md`
- **API Documentation**: `/backend/API_DOCUMENTATION.md`
- **API Examples**: `/backend/API_EXAMPLES.md`

---

## 🚨 Troubleshooting

### Backend Issues

**Issue**: "ModuleNotFoundError: No module named 'flask'"
- **Solution**: Activate virtual environment and run `pip install -r requirements.txt`

**Issue**: "Access denied for user 'root'@'localhost'"
- **Solution**: Check MySQL credentials in `.env` file and ensure database exists

**Issue**: "SMTP Connection Error"
- **Solution**: Run `python test_smtp.py` to verify credentials. Ensure Gmail account has 2FA enabled and app password generated.

### Frontend Issues

**Issue**: "Cannot GET /api/v1/..."
- **Solution**: Ensure backend server is running on port 5001

**Issue**: "Module not found" errors
- **Solution**: Run `npm install` in frontend directory

**Issue**: Styling not loading (Tailwind CSS)
- **Solution**: Ensure `npm run dev` is building the CSS properly, check `tailwind.config.js`

---

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Test your changes before submitting
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**Project**: CoreInventory - Commit & Quit
**Repository**: [commitnquit2026/CoreInventory-By-Commit-Quit](https://github.com/commitnquit2026/CoreInventory-By-Commit-Quit)

---

## 📧 Support

For issues, questions, or suggestions:

- **GitHub Issues**: [Create an issue](https://github.com/commitnquit2026/CoreInventory-By-Commit-Quit/issues)
- **Email**: commit.and.quit2026@gmail.com

---

## 🙏 Acknowledgments

- **Flask**: Lightweight Python web framework
- **React**: JavaScript library for building UIs
- **Tailwind CSS**: Utility-first CSS framework
- **MySQL**: Reliable relational database
- **Gmail**: Email delivery service

---

<div align="center">

**Made with ❤️ by Commit & Quit Team**

⭐ If you find this project useful, please consider giving it a star on GitHub!

</div>

---

## 📌 Quick Links

- [GitHub Repository](https://github.com/commitnquit2026/CoreInventory-By-Commit-Quit)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
- [Database Schema](./backend/database/schema.sql)
- [API Documentation](./backend/API_DOCUMENTATION.md)

---

**Last Updated**: March 14, 2026  
**Version**: 1.0.0  
**Status**: Active & Maintained ✅CoreInventory-By-Commit-Quit
Commit&amp;Quit – Odoo x Indus Hackathon CoreInventory is a modular Inventory Management System built by Team Commit&amp;Quit for the Odoo x Indus Hackathon. It replaces manual registers and spreadsheets with a centralized platform to manage products, track stock movement, handle receipts, deliveries, and maintain real-time inventory visibility.
