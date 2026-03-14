# CoreInventory Backend API Documentation

## System Overview

**CoreInventory** is a comprehensive Inventory Management System built with Flask and MySQL. It provides REST APIs for managing products, warehouses, inventory operations, and stock tracking with complete audit trails.

## Technology Stack

- **Backend**: Python Flask
- **Database**: MySQL 5.7+
- **Authentication**: JWT + OTP
- **Architecture**: REST API (JSON)

---

## API Endpoints Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### 1. User Signup
- **Endpoint**: `POST /auth/signup`
- **Description**: Register a new user
- **Access**: Public
- **Request Body**:
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "role": "Warehouse Staff"
}
```
- **Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "Warehouse Staff",
    "is_active": true
  }
}
```

#### 2. User Login
- **Endpoint**: `POST /auth/login`
- **Description**: Authenticate and get JWT token
- **Access**: Public
- **Request Body**:
```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```
- **Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "Warehouse Staff"
  },
  "otp_enabled": false
}
```

#### 3. Setup 2-Factor Authentication
- **Endpoint**: `POST /auth/setup-2fa`
- **Description**: Generate OTP secret and QR code
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "message": "2FA setup initiated",
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS..."
}
```

#### 4. Verify 2-Factor Authentication
- **Endpoint**: `POST /auth/verify-2fa`
- **Description**: Enable 2FA after verification
- **Access**: Authenticated
- **Request Body**:
```json
{
  "secret": "JBSWY3DPEBLW64TMMQ======",
  "token": "123456"
}
```

#### 5. Request Password Reset
- **Endpoint**: `POST /auth/request-password-reset`
- **Description**: Request password reset OTP
- **Access**: Public
- **Request Body**:
```json
{
  "email": "john@example.com"
}
```

#### 6. Reset Password
- **Endpoint**: `POST /auth/reset-password`
- **Description**: Reset password with OTP
- **Access**: Public
- **Request Body**:
```json
{
  "reset_token": "uuid-here",
  "otp_code": "123456",
  "new_password": "NewSecurePass123"
}
```

#### 7. Get User Profile
- **Endpoint**: `GET /auth/profile`
- **Description**: Get authenticated user profile
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Inventory Manager",
    "is_active": true
  }
}
```

#### 8. Change Password
- **Endpoint**: `POST /auth/change-password`
- **Description**: Change password for authenticated user
- **Access**: Authenticated
- **Request Body**:
```json
{
  "old_password": "SecurePass123",
  "new_password": "NewSecurePass123"
}
```

---

### Product Management Endpoints

#### 1. Get All Categories
- **Endpoint**: `GET /products/categories`
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "description": "Electronic items"
    },
    {
      "id": 2,
      "name": "Hardware",
      "description": "Hardware components"
    }
  ]
}
```

#### 2. Create Category
- **Endpoint**: `POST /products/categories`
- **Access**: Inventory Manager
- **Request Body**:
```json
{
  "name": "Electronics",
  "description": "Electronic items"
}
```

#### 3. Get All Products
- **Endpoint**: `GET /products?page=1&per_page=10&category_id=1&is_active=true`
- **Access**: Authenticated
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `per_page`: Items per page (default: 10)
  - `category_id`: Filter by category
  - `is_active`: Filter by active status
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "sku": "ELEC-001",
      "name": "USB Cable",
      "category": "Electronics",
      "unit_of_measure": "pieces",
      "initial_stock": 100,
      "is_active": true
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 10,
    "total": 50,
    "pages": 5
  }
}
```

#### 4. Create Product
- **Endpoint**: `POST /products`
- **Access**: Inventory Manager
- **Request Body**:
```json
{
  "sku": "ELEC-001",
  "name": "USB Cable",
  "category_id": 1,
  "unit_of_measure": "pieces",
  "description": "3-meter USB Type-C cable",
  "initial_stock": 100
}
```

#### 5. Get Product by ID
- **Endpoint**: `GET /products/<product_id>`
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sku": "ELEC-001",
    "name": "USB Cable",
    "category": "Electronics",
    "unit_of_measure": "pieces",
    "initial_stock": 100
  },
  "inventory": [
    {
      "id": 1,
      "product_name": "USB Cable",
      "location_code": "RACK-A1",
      "quantity": 50,
      "reserved_quantity": 10,
      "available_quantity": 40
    }
  ]
}
```

#### 6. Update Product
- **Endpoint**: `PUT /products/<product_id>`
- **Access**: Inventory Manager
- **Request Body**:
```json
{
  "name": "USB Cable 3m",
  "is_active": true
}
```

#### 7. Get Inventory Summary
- **Endpoint**: `GET /products/inventory/summary?page=1`
- **Access**: Authenticated
- **Response**: List of all inventory records

#### 8. Get Inventory by Location
- **Endpoint**: `GET /products/inventory/location/<location_id>`
- **Access**: Authenticated

#### 9. Get Inventory by Product
- **Endpoint**: `GET /products/inventory/product/<product_id>`
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "product": {
    "id": 1,
    "sku": "ELEC-001",
    "name": "USB Cable"
  },
  "inventory": [
    {
      "location_code": "RACK-A1",
      "quantity": 50,
      "reserved_quantity": 10
    }
  ],
  "totals": {
    "total_quantity": 150,
    "total_reserved": 25,
    "total_available": 125
  }
}
```

---

### Warehouse Management Endpoints

#### 1. Get All Warehouses
- **Endpoint**: `GET /warehouses`
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Main Warehouse",
      "location": "New York, NY",
      "capacity": 5000,
      "is_active": true
    }
  ]
}
```

#### 2. Create Warehouse
- **Endpoint**: `POST /warehouses`
- **Access**: Inventory Manager
- **Request Body**:
```json
{
  "name": "Main Warehouse",
  "location": "New York, NY",
  "capacity": 5000
}
```

#### 3. Get Warehouse by ID
- **Endpoint**: `GET /warehouses/<warehouse_id>`
- **Access**: Authenticated

#### 4. Update Warehouse
- **Endpoint**: `PUT /warehouses/<warehouse_id>`
- **Access**: Inventory Manager

#### 5. Get Warehouse Locations
- **Endpoint**: `GET /warehouses/<warehouse_id>/locations`
- **Access**: Authenticated

#### 6. Create Location (Rack)
- **Endpoint**: `POST /warehouses/<warehouse_id>/locations`
- **Access**: Inventory Manager
- **Request Body**:
```json
{
  "rack_code": "RACK-A1",
  "location_type": "Rack",
  "capacity": 500
}
```

#### 7. Get Location Details
- **Endpoint**: `GET /warehouses/locations/<location_id>`
- **Access**: Authenticated

#### 8. Update Location
- **Endpoint**: `PUT /warehouses/locations/<location_id>`
- **Access**: Inventory Manager

---

### Supplier Management Endpoints

#### 1. Get All Suppliers
- **Endpoint**: `GET /suppliers?page=1&is_active=true`
- **Access**: Authenticated
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Electronics Inc",
      "contact_person": "Jane Smith",
      "email": "contact@electronics.com",
      "phone": "+1-555-0101",
      "address": "123 Tech Lane",
      "city": "San Francisco",
      "country": "USA",
      "is_active": true
    }
  ]
}
```

#### 2. Create Supplier
- **Endpoint**: `POST /suppliers`
- **Access**: Inventory Manager
- **Request Body**:
```json
{
  "name": "Electronics Inc",
  "contact_person": "Jane Smith",
  "email": "contact@electronics.com",
  "phone": "+1-555-0101",
  "address": "123 Tech Lane",
  "city": "San Francisco",
  "country": "USA"
}
```

#### 3. Get Supplier by ID
- **Endpoint**: `GET /suppliers/<supplier_id>`
- **Access**: Authenticated

#### 4. Update Supplier
- **Endpoint**: `PUT /suppliers/<supplier_id>`
- **Access**: Inventory Manager

---

### Inventory Operations Endpoints

#### Receipt (Incoming Goods)

##### 1. Get All Receipts
- **Endpoint**: `GET /inventory/receipts?status=Draft&supplier_id=1&page=1`
- **Access**: Authenticated
- **Query Parameters**:
  - `status`: Draft, Received, Validated, Rejected
  - `supplier_id`: Filter by supplier
  - `warehouse_id`: Filter by warehouse

##### 2. Create Receipt
- **Endpoint**: `POST /inventory/receipts`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "supplier_id": 1,
  "warehouse_id": 1,
  "notes": "Order #PO-2024-001"
}
```

##### 3. Get Receipt Details
- **Endpoint**: `GET /inventory/receipts/<receipt_id>`
- **Access**: Authenticated

##### 4. Add Item to Receipt
- **Endpoint**: `POST /inventory/receipts/<receipt_id>/items`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "product_id": 1,
  "quantity_expected": 50,
  "location_id": 1,
  "unit_price": 25.50,
  "notes": "Box of 10 pieces each"
}
```

##### 5. Validate Receipt (Finalize & Increase Stock)
- **Endpoint**: `POST /inventory/receipts/<receipt_id>/validate`
- **Access**: Inventory Manager
- **Request Body** (Optional - to override quantities):
```json
{
  "item_1_received": 48,
  "item_2_received": 50
}
```
- **Effect**: Automatically increases inventory at specified location

---

#### Delivery (Outgoing Goods)

##### 1. Get All Deliveries
- **Endpoint**: `GET /inventory/deliveries?status=Draft&warehouse_id=1`
- **Access**: Authenticated

##### 2. Create Delivery
- **Endpoint**: `POST /inventory/deliveries`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "warehouse_id": 1,
  "destination": "Customer Location, Address",
  "notes": "Order #ORD-2024-001"
}
```

##### 3. Add Item to Delivery
- **Endpoint**: `POST /inventory/deliveries/<delivery_id>/items`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "product_id": 1,
  "quantity_required": 30,
  "location_id": 1,
  "notes": "Pick from section A"
}
```

##### 4. Validate Delivery (Finalize & Reduce Stock)
- **Endpoint**: `POST /inventory/deliveries/<delivery_id>/validate`
- **Access**: Inventory Manager
- **Request Body** (Optional):
```json
{
  "item_1_packed": 25,
  "item_2_packed": 30
}
```
- **Effect**: Automatically decreases inventory at source location

---

#### Stock Transfer (Inter-warehouse/Location Movement)

##### 1. Get All Transfers
- **Endpoint**: `GET /inventory/transfers?status=Draft`
- **Access**: Authenticated

##### 2. Create Transfer
- **Endpoint**: `POST /inventory/transfers`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "source_location_id": 1,
  "destination_location_id": 2,
  "notes": "Rebalancing inventory"
}
```

##### 3. Add Item to Transfer
- **Endpoint**: `POST /inventory/transfers/<transfer_id>/items`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "product_id": 1,
  "quantity": 20
}
```

##### 4. Complete Transfer
- **Endpoint**: `POST /inventory/transfers/<transfer_id>/complete`
- **Access**: Inventory Manager
- **Effect**: Moves inventory from source to destination location

---

#### Stock Adjustment (Reconciliation)

##### 1. Get All Adjustments
- **Endpoint**: `GET /inventory/adjustments?status=Draft`
- **Access**: Authenticated

##### 2. Create Adjustment
- **Endpoint**: `POST /inventory/adjustments`
- **Access**: Inventory Manager, Warehouse Staff
- **Request Body**:
```json
{
  "product_id": 1,
  "location_id": 1,
  "system_quantity": 100,
  "physical_quantity": 95,
  "reason": "Damage",
  "notes": "5 units damaged during inspection"
}
```
- **Adjustment Quantity** (calculated): 95 - 100 = -5

##### 3. Approve Adjustment
- **Endpoint**: `POST /inventory/adjustments/<adjustment_id>/approve`
- **Access**: Inventory Manager
- **Effect**: Applies the adjustment to inventory

---

#### Stock Ledger (Audit Trail)

##### Get Stock Ledger
- **Endpoint**: `GET /inventory/ledger?operation_type=Receipt&product_id=1&page=1`
- **Access**: Authenticated
- **Query Parameters**:
  - `operation_type`: Receipt, Delivery, Transfer, Adjustment
  - `product_id`: Filter by product
  - `start_date`: Filter from date
  - `end_date`: Filter to date
- **Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "operation_type": "Receipt",
      "reference_number": "RCP-20240315-00001",
      "product": "USB Cable",
      "sku": "ELEC-001",
      "source_location": null,
      "destination_location": "RACK-A1",
      "quantity_change": 50,
      "old_quantity": 0,
      "new_quantity": 50,
      "created_at": "2024-03-15T10:30:00",
      "created_by": "john_doe"
    },
    {
      "id": 2,
      "operation_type": "Delivery",
      "reference_number": "DLV-20240315-00001",
      "product": "USB Cable",
      "sku": "ELEC-001",
      "source_location": "RACK-A1",
      "destination_location": null,
      "quantity_change": -20,
      "old_quantity": 50,
      "new_quantity": 30,
      "created_at": "2024-03-15T14:45:00",
      "created_by": "jane_doe"
    }
  ]
}
```

---

## Authentication

All endpoints (except signup and login) require JWT authentication via `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Error Responses

Standard error format (all endpoints):

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common Status Codes**:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Server Error

---

## Request Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

---

## Inventory Flow Logic

### 1. Receipt (Incoming Goods)
```
Create Receipt (Draft)
  → Add Items (Product, Qty, Location)
    → Validate Receipt
      → Auto-increase Inventory
        → Log to Stock Ledger
```

### 2. Delivery (Outgoing Goods)
```
Create Delivery (Draft)
  → Add Items (Product, Qty, Location)
    → Update Pick Status
      → Update Pack Status
        → Validate Delivery
          → Auto-decrease Inventory
            → Log to Stock Ledger
```

### 3. Transfer (Inter-location Movement)
```
Create Transfer (Draft)
  → Add Items (Product, Qty)
    → Mark In Transit
      → Complete Transfer
        → Decrease Source Inventory
        → Increase Destination Inventory
        → Log to Stock Ledger
```

### 4. Adjustment (Reconciliation)
```
Create Adjustment (Draft)
  → Specify System vs Physical Count
    → Approve Adjustment
      → Update Inventory
        → Log to Stock Ledger
```

---

## Role-Based Access Control (RBAC)

| Endpoint | Inventory Manager | Warehouse Staff |
|----------|------------------|-----------------|
| Product Create/Update | ✅ | ❌ |
| Warehouse Create/Update | ✅ | ❌ |
| Receipt Validate | ✅ | ❌ |
| Delivery Validate | ✅ | ❌ |
| Transfer Complete | ✅ | ❌ |
| Adjustment Approve | ✅ | ❌ |
| Receipt Create | ✅ | ✅ |
| Delivery Create | ✅ | ✅ |
| Transfer Create | ✅ | ✅ |
| Adjustment Create | ✅ | ✅ |
| View Reports | ✅ | ✅ |

---

## Database Schema Highlights

### Key Tables
- **users**: User accounts with roles
- **products**: Product catalog with SKU
- **categories**: Product categories
- **warehouses**: Warehouse locations
- **locations**: Racks/zones within warehouses
- **inventory**: Stock per location (product + location = unique)
- **suppliers**: Supplier information
- **receipts/receipt_items**: Incoming goods
- **deliveries/delivery_items**: Outgoing goods
- **transfers/transfer_items**: Stock movements
- **adjustments**: Stock reconciliation
- **stock_ledger**: Complete audit trail
- **password_reset_tokens**: Password reset OTP tokens

---

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Database
```bash
# Create .env file
cp .env.example .env

# Update DB credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=coreinventory
```

### 3. Initialize Database
```bash
# MySQL
mysql -u root -p < database/schema.sql
```

### 4. Run Application
```bash
python app.py
```

The API will be available at `http://localhost:5000`

---

## Example Workflow

### Scenario: Receive and Deliver Inventory

#### Step 1: Create Supplier
```bash
curl -X POST http://localhost:5000/api/v1/suppliers \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics Inc",
    "contact_person": "Jane Smith",
    "email": "contact@electronics.com",
    "phone": "+1-555-0101",
    "address": "123 Tech Lane",
    "city": "San Francisco",
    "country": "USA"
  }'
```

#### Step 2: Create Receipt
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "warehouse_id": 1,
    "notes": "Order #PO-2024-001"
  }'
```

#### Step 3: Add Items to Receipt
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts/1/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_expected": 100,
    "location_id": 1,
    "unit_price": 25.50
  }'
```

#### Step 4: Validate Receipt (Auto-increases stock)
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts/1/validate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_1_received": 100
  }'
```

#### Step 5: Create Delivery Order
```bash
curl -X POST http://localhost:5000/api/v1/inventory/deliveries \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse_id": 1,
    "destination": "Customer Address",
    "notes": "Order #ORD-2024-001"
  }'
```

#### Step 6: Add Items to Delivery
```bash
curl -X POST http://localhost:5000/api/v1/inventory/deliveries/1/items \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_required": 50,
    "location_id": 1
  }'
```

#### Step 7: Validate Delivery (Auto-decreases stock)
```bash
curl -X POST http://localhost:5000/api/v1/inventory/deliveries/1/validate \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_1_packed": 50
  }'
```

#### Step 8: Check Stock Ledger
```bash
curl -X GET http://localhost:5000/api/v1/inventory/ledger \
  -H "Authorization: Bearer TOKEN"
```

---

## Security Features

1. **JWT Authentication**: Token-based authentication with configurable expiration
2. **OTP 2FA**: Optional TOTP-based two-factor authentication
3. **Password Security**: Bcrypt password hashing
4. **Role-Based Access**: Granular permission control
5. **Audit Trail**: Complete stock ledger with timestamps and users
6. **Input Validation**: Strong validation on all inputs
7. **Error Handling**: Comprehensive error messages without sensitive info

---

## Performance Considerations

- Database indexes on frequently queried fields
- Pagination support for large datasets
- Denormalized inventory summary queries
- Efficient stock ledger filtering by date range
- Connection pooling for database

---

## Future Enhancements

- Barcode/QR code scanning integration
- Mobile app integration
- Advanced reporting and analytics
- Multi-user concurrent operations
- Warehouse transfer workflows
- Low stock alerts
- Batch operations
- API rate limiting
- Elasticsearch integration for search

---

## Support & Maintenance

For issues or questions:
1. Check API logs at `/logs/`
2. Review database consistency
3. Validate JWT token expiration
4. Ensure database connectivity

---

**Version**: 1.0.0  
**Last Updated**: March 2024
