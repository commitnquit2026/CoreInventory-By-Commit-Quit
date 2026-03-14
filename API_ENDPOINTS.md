# CoreInventory API Endpoints - Complete Reference

**Base URL**: `http://localhost:5001/api/v1`

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login with username/password |
| GET | `/auth/profile` | Get current user profile |
| PUT | `/auth/profile` | Update user profile |
| POST | `/auth/change-password` | Change password |
| POST | `/auth/request-password-reset` | Request password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |
| POST | `/auth/setup-2fa` | Generate 2FA QR code |
| POST | `/auth/verify-2fa` | Verify 2FA code |

---

## 📦 Receipt Endpoints (Inbound Stock)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/receipts` | Create new receipt |
| GET | `/receipts` | List all receipts |
| GET | `/receipts/<id>` | Get receipt details |
| POST | `/receipts/<id>/items` | Add items to receipt |
| POST | `/receipts/<id>/validate` | Validate receipt (increase stock) |
| DELETE | `/receipts/<id>` | Cancel receipt |

---

## 🚚 Delivery Endpoints (Outbound Stock)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/deliveries` | Create new delivery order |
| GET | `/deliveries` | List all deliveries |
| GET | `/deliveries/<id>` | Get delivery details |
| POST | `/deliveries/<id>/items` | Add items to delivery |
| POST | `/deliveries/<id>/pick` | Mark items as picked |
| POST | `/deliveries/<id>/pack` | Mark items as packed |
| POST | `/deliveries/<id>/ship` | Mark delivery as shipped |
| POST | `/deliveries/<id>/confirm` | Confirm delivery (decrease stock) |
| DELETE | `/deliveries/<id>` | Cancel delivery |

---

## 🔄 Transfer Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/transfers` | Create stock transfer |
| GET | `/transfers` | List all transfers |
| GET | `/transfers/<id>` | Get transfer details |
| POST | `/transfers/<id>/items` | Add items to transfer |
| POST | `/transfers/<id>/execute` | Execute transfer |

---

## 📝 Adjustment Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/adjustments` | Create stock adjustment |
| GET | `/adjustments` | List all adjustments |
| GET | `/adjustments/<id>` | Get adjustment details |

---

## 📋 Move History / Ledger Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/movehistory` | Get stock movement history |
| GET | `/movehistory?operation_type=Receipt` | Filter by type |
| GET | `/movehistory?start_date=2026-03-01` | Filter by date range |

---

## 📦 Product Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/<id>` | Get product details |
| PUT | `/products/<id>` | Update product |
| DELETE | `/products/<id>` | Delete product |

---

## 🏭 Warehouse Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/warehouses` | Create warehouse |
| GET | `/warehouses` | List all warehouses |
| GET | `/warehouses/<id>` | Get warehouse details |
| PUT | `/warehouses/<id>` | Update warehouse |
| DELETE | `/warehouses/<id>` | Delete warehouse |
| GET | `/warehouses/<id>/locations` | Get warehouse locations |
| POST | `/warehouses/<id>/locations` | Create location in warehouse |

---

## 🏪 Supplier Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/suppliers` | Create supplier |
| GET | `/suppliers` | List all suppliers |
| GET | `/suppliers/<id>` | Get supplier details |
| PUT | `/suppliers/<id>` | Update supplier |
| DELETE | `/suppliers/<id>` | Delete supplier |

---

## 📊 Inventory Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/inventory` | Get all inventory items |
| GET | `/inventory/<location_id>` | Get inventory at location |
| GET | `/inventory/product/<product_id>` | Get product inventory across locations |
| GET | `/dashboard` | Get dashboard data (KPI cards) |

---

## Request/Response Examples

### Login Request
```json
POST /api/v1/auth/login
{
  "username": "testuser",
  "password": "Test@123456"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "role": "Inventory Manager"
  }
}
```

### Create Receipt Request
```json
POST /api/v1/receipts
{
  "supplier_id": 1,
  "warehouse_id": 1,
  "notes": "Order #12345"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "receipt_number": "RCP-001",
    "supplier_id": 1,
    "warehouse_id": 1,
    "status": "Draft",
    "created_at": "2026-03-14T10:30:00"
  }
}
```

### Add Receipt Item
```json
POST /api/v1/receipts/1/items
{
  "product_id": 5,
  "quantity_expected": 100,
  "location_id": 10,
  "unit_price": 50.00
}

Response (201):
{
  "success": true,
  "message": "Item added to receipt"
}
```

### Validate Receipt (Increase Stock)
```json
POST /api/v1/receipts/1/validate

Response (200):
{
  "success": true,
  "message": "Receipt validated. Stock increased.",
  "movehistory_entry": {
    "id": 101,
    "product_id": 5,
    "location_id": 10,
    "operation_type": "Receipt",
    "quantity_change": 100,
    "old_quantity": 0,
    "new_quantity": 100
  }
}
```

### Create Delivery Request
```json
POST /api/v1/deliveries
{
  "warehouse_id": 1,
  "destination": "Customer Address",
  "notes": "Priority delivery"
}

Response (201):
{
  "success": true,
  "data": {
    "id": 1,
    "delivery_number": "DEL-001",
    "status": "Draft"
  }
}
```

### Get Move History
```json
GET /api/v1/movehistory?operation_type=Receipt

Response (200):
{
  "success": true,
  "data": [
    {
      "id": 101,
      "product_id": 5,
      "product_name": "Desk",
      "sku": "DESK001",
      "location_id": 10,
      "location": "A-01",
      "warehouse": "Main Warehouse",
      "operation_type": "Receipt",
      "reference": "RCP-001",
      "quantity_change": 100,
      "old_quantity": 0,
      "new_quantity": 100,
      "created_by": "testuser",
      "created_at": "2026-03-14T10:30:00"
    }
  ]
}
```

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer {jwt_token}
```

The JWT token is obtained from login and stored in localStorage as `jwt_token`.

Frontend automatically adds this header via HTTP interceptor.

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials or expired token"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Quantity cannot be negative",
  "errors": {
    "quantity": ["Must be greater than 0"]
  }
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Testing with curl

### Login
```bash
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test@123456"}'
```

### Get Dashboard
```bash
curl -X GET http://localhost:5001/api/v1/inventory/dashboard \
  -H "Authorization: Bearer {jwt_token}"
```

### List Receipts
```bash
curl -X GET http://localhost:5001/api/v1/receipts \
  -H "Authorization: Bearer {jwt_token}"
```

---

**Status**: ✅ All endpoints ready for testing

