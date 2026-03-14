# API Request Examples - CoreInventory

This file contains curl examples for all major API endpoints.

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication Endpoints

### 1. User Signup
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "Warehouse Staff"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123"
  }'
```

**Copy the token from response for subsequent requests:**
```bash
export TOKEN="your_jwt_token_here"
```

### 3. Get User Profile
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Change Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/change-password \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "old_password": "SecurePass123",
    "new_password": "NewSecurePass123"
  }'
```

### 5. Setup 2FA
```bash
curl -X POST http://localhost:5000/api/v1/auth/setup-2fa \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Verify 2FA
```bash
curl -X POST http://localhost:5000/api/v1/auth/verify-2fa \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "JBSWY3DPEBLW64TMMQ======",
    "token": "123456"
  }'
```

### 7. Request Password Reset
```bash
curl -X POST http://localhost:5000/api/v1/auth/request-password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### 8. Reset Password
```bash
curl -X POST http://localhost:5000/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "reset_token": "uuid-from-previous-step",
    "otp_code": "123456",
    "new_password": "NewSecurePass123"
  }'
```

---

## Product Management Endpoints

### 1. Create Product Category
```bash
curl -X POST http://localhost:5000/api/v1/products/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic items and accessories"
  }'
```

### 2. Get All Categories
```bash
curl -X GET http://localhost:5000/api/v1/products/categories \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Create Product
```bash
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "USB-CABLE-001",
    "name": "USB Type-C Cable 3m",
    "category_id": 1,
    "unit_of_measure": "pieces",
    "description": "3-meter USB Type-C charging and data cable",
    "initial_stock": 100
  }'
```

### 4. Get All Products
```bash
curl -X GET "http://localhost:5000/api/v1/products?page=1&per_page=10&category_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Get Product by ID
```bash
curl -X GET http://localhost:5000/api/v1/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 6. Update Product
```bash
curl -X PUT http://localhost:5000/api/v1/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "USB Type-C Cable 3m Updated",
    "unit_of_measure": "boxes",
    "is_active": true
  }'
```

### 7. Get Inventory Summary
```bash
curl -X GET "http://localhost:5000/api/v1/products/inventory/summary?page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Get Inventory by Product
```bash
curl -X GET http://localhost:5000/api/v1/products/inventory/product/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 9. Get Inventory by Location
```bash
curl -X GET http://localhost:5000/api/v1/products/inventory/location/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## Warehouse Management Endpoints

### 1. Create Warehouse
```bash
curl -X POST http://localhost:5000/api/v1/warehouses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "location": "New York, NY",
    "capacity": 5000
  }'
```

### 2. Get All Warehouses
```bash
curl -X GET http://localhost:5000/api/v1/warehouses \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get Warehouse by ID
```bash
curl -X GET http://localhost:5000/api/v1/warehouses/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Warehouse
```bash
curl -X PUT http://localhost:5000/api/v1/warehouses/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse Updated",
    "capacity": 6000,
    "is_active": true
  }'
```

### 5. Create Location (Rack)
```bash
curl -X POST http://localhost:5000/api/v1/warehouses/1/locations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rack_code": "RACK-A1",
    "location_type": "Rack",
    "capacity": 500
  }'
```

### 6. Get Warehouse Locations
```bash
curl -X GET http://localhost:5000/api/v1/warehouses/1/locations \
  -H "Authorization: Bearer $TOKEN"
```

### 7. Get Location Details
```bash
curl -X GET http://localhost:5000/api/v1/warehouses/locations/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 8. Update Location
```bash
curl -X PUT http://localhost:5000/api/v1/warehouses/locations/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location_type": "Rack",
    "capacity": 600,
    "is_active": true
  }'
```

---

## Supplier Management Endpoints

### 1. Create Supplier
```bash
curl -X POST http://localhost:5000/api/v1/suppliers \
  -H "Authorization: Bearer $TOKEN" \
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

### 2. Get All Suppliers
```bash
curl -X GET "http://localhost:5000/api/v1/suppliers?page=1&is_active=true" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get Supplier by ID
```bash
curl -X GET http://localhost:5000/api/v1/suppliers/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Update Supplier
```bash
curl -X PUT http://localhost:5000/api/v1/suppliers/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contact_person": "Jane Smith Updated",
    "phone": "+1-555-0102",
    "is_active": true
  }'
```

---

## Inventory Operations - Receipts (Incoming Goods)

### 1. Create Receipt
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "warehouse_id": 1,
    "notes": "Purchase Order #PO-2024-001"
  }'
```

### 2. Get All Receipts
```bash
curl -X GET "http://localhost:5000/api/v1/inventory/receipts?status=Draft&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Get Receipt Details
```bash
curl -X GET http://localhost:5000/api/v1/inventory/receipts/1 \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Add Item to Receipt
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts/1/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_expected": 50,
    "location_id": 1,
    "unit_price": 15.99,
    "notes": "Box of 10 pieces each"
  }'
```

### 5. Validate Receipt (Finalize & Increase Stock)
```bash
curl -X POST http://localhost:5000/api/v1/inventory/receipts/1/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_1_received": 50,
    "item_2_received": 48
  }'
```

---

## Inventory Operations - Deliveries (Outgoing Goods)

### 1. Create Delivery
```bash
curl -X POST http://localhost:5000/api/v1/inventory/deliveries \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse_id": 1,
    "destination": "Customer Address, City, State",
    "notes": "Order #ORD-2024-001"
  }'
```

### 2. Get All Deliveries
```bash
curl -X GET "http://localhost:5000/api/v1/inventory/deliveries?status=Draft&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Add Item to Delivery
```bash
curl -X POST http://localhost:5000/api/v1/inventory/deliveries/1/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity_required": 30,
    "location_id": 1,
    "notes": "Pick from section A"
  }'
```

### 4. Validate Delivery (Finalize & Reduce Stock)
```bash
curl -X POST http://localhost:5000/api/v1/inventory/deliveries/1/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_1_packed": 25,
    "item_2_packed": 30
  }'
```

---

## Inventory Operations - Stock Transfers

### 1. Create Transfer
```bash
curl -X POST http://localhost:5000/api/v1/inventory/transfers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "source_location_id": 1,
    "destination_location_id": 2,
    "notes": "Rebalancing inventory between racks"
  }'
```

### 2. Get All Transfers
```bash
curl -X GET "http://localhost:5000/api/v1/inventory/transfers?status=Draft" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Add Item to Transfer
```bash
curl -X POST http://localhost:5000/api/v1/inventory/transfers/1/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "quantity": 20
  }'
```

### 4. Complete Transfer
```bash
curl -X POST http://localhost:5000/api/v1/inventory/transfers/1/complete \
  -H "Authorization: Bearer $TOKEN"
```

---

## Inventory Operations - Stock Adjustments

### 1. Create Adjustment
```bash
curl -X POST http://localhost:5000/api/v1/inventory/adjustments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "location_id": 1,
    "system_quantity": 100,
    "physical_quantity": 95,
    "reason": "Damage",
    "notes": "5 units found damaged during physical count"
  }'
```

### 2. Get All Adjustments
```bash
curl -X GET "http://localhost:5000/api/v1/inventory/adjustments?status=Draft" \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Approve Adjustment
```bash
curl -X POST http://localhost:5000/api/v1/inventory/adjustments/1/approve \
  -H "Authorization: Bearer $TOKEN"
```

---

## Stock Ledger (Audit Trail)

### Get Stock Ledger
```bash
curl -X GET "http://localhost:5000/api/v1/inventory/ledger?operation_type=Receipt&product_id=1&page=1" \
  -H "Authorization: Bearer $TOKEN"
```

### Get Ledger with Date Range
```bash
curl -X GET "http://localhost:5000/api/v1/inventory/ledger?operation_type=Delivery&start_date=2024-03-01&end_date=2024-03-31" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Complete Workflow Example

### Setup - Run These in Order

#### 1. Login
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "Admin@123456"
  }' | jq -r '.token')
echo "Token: $TOKEN"
```

#### 2. Create Warehouse
```bash
WH_ID=$(curl -s -X POST http://localhost:5000/api/v1/warehouses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "location": "New York, NY",
    "capacity": 5000
  }' | jq '.data.id')
echo "Warehouse ID: $WH_ID"
```

#### 3. Create Location
```bash
LOC_ID=$(curl -s -X POST http://localhost:5000/api/v1/warehouses/$WH_ID/locations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rack_code": "RACK-A1",
    "location_type": "Rack",
    "capacity": 500
  }' | jq '.data.id')
echo "Location ID: $LOC_ID"
```

#### 4. Create Category
```bash
CAT_ID=$(curl -s -X POST http://localhost:5000/api/v1/products/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic items"
  }' | jq '.data.id')
echo "Category ID: $CAT_ID"
```

#### 5. Create Product
```bash
PROD_ID=$(curl -s -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "USB-CABLE-001",
    "name": "USB Type-C Cable",
    "category_id": '$CAT_ID',
    "unit_of_measure": "pieces",
    "initial_stock": 100
  }' | jq '.data.id')
echo "Product ID: $PROD_ID"
```

#### 6. Create Supplier
```bash
SUP_ID=$(curl -s -X POST http://localhost:5000/api/v1/suppliers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics Inc",
    "contact_person": "Jane Smith",
    "email": "contact@electronics.com",
    "phone": "+1-555-0101",
    "city": "San Francisco",
    "country": "USA"
  }' | jq '.data.id')
echo "Supplier ID: $SUP_ID"
```

#### 7. Create Receipt
```bash
RCP_ID=$(curl -s -X POST http://localhost:5000/api/v1/inventory/receipts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": '$SUP_ID',
    "warehouse_id": '$WH_ID',
    "notes": "Purchase Order #PO-2024-001"
  }' | jq '.data.id')
echo "Receipt ID: $RCP_ID"
```

#### 8. Add Item to Receipt
```bash
curl -s -X POST http://localhost:5000/api/v1/inventory/receipts/$RCP_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": '$PROD_ID',
    "quantity_expected": 100,
    "location_id": '$LOC_ID',
    "unit_price": 15.99
  }'
```

#### 9. Validate Receipt
```bash
curl -s -X POST http://localhost:5000/api/v1/inventory/receipts/$RCP_ID/validate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "item_1_received": 100
  }'
```

#### 10. Check Inventory
```bash
curl -s -X GET http://localhost:5000/api/v1/products/inventory/product/$PROD_ID \
  -H "Authorization: Bearer $TOKEN" | jq '.totals'
```

#### 11. Check Stock Ledger
```bash
curl -s -X GET http://localhost:5000/api/v1/inventory/ledger \
  -H "Authorization: Bearer $TOKEN" | jq '.data[] | {operation_type, reference_number, quantity_change, created_at}'
```

---

## Notes

- Replace `http://localhost:5000` with your actual API URL
- Replace `$TOKEN` with your actual JWT token
- All requests use JSON format
- Successful responses have `"success": true`
- Error responses include error messages
- Use `jq` for parsing JSON responses (install with `brew install jq`)
- For complex workflows, save IDs to variables as shown in the examples
