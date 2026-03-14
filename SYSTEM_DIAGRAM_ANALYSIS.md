# System Diagram Analysis & Implementation Plan

## Diagram Overview
The provided diagram shows a complete inventory management system with the following key components:

### Core Modules Identified:
1. **Authentication** - Login, Signup, Forgot Password flows
2. **Dashboard** - Overview with Receipt & Delivery cards, KPIs
3. **Warehouse Management** - Warehouse CRUD operations
4. **Location Management** - Locations within warehouses
5. **Stock Management** - Track stock per product per location
6. **Receipts** - Inbound inventory (Draft → Ready → Done)
7. **Deliveries** - Outbound inventory (Draft → Waiting → Ready → Done)
8. **Move History** - Track all inventory movements

### Key Business Rules:
- Receipts **increase** stock
- Deliveries **decrease** stock
- Stock never goes negative (validation required)
- Every inventory change creates a Move History entry
- Status transitions are strict and ordered
- Warehouses contain Locations
- Stock is tracked per Product per Location

---

## Database Schema (Enhanced)

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Warehouses Table
```sql
CREATE TABLE warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Locations Table
```sql
CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id INT NOT NULL,
  rack_code VARCHAR(255) NOT NULL,
  location_type VARCHAR(50) (Rack, Bin, Floor, Cold Storage),
  capacity INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  UNIQUE KEY (warehouse_id, rack_code)
);
```

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sku VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  unit_price DECIMAL(10, 2),
  reorder_level INT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Stock Table
```sql
CREATE TABLE stock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT DEFAULT 0,
  reserved INT DEFAULT 0,
  available INT GENERATED ALWAYS AS (quantity - reserved) STORED,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  UNIQUE KEY (product_id, location_id),
  INDEX (product_id),
  INDEX (location_id)
);
```

### Receipts Table
```sql
CREATE TABLE receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_number VARCHAR(255) UNIQUE NOT NULL,
  warehouse_id INT NOT NULL,
  supplier_id INT,
  status ENUM('Draft', 'Ready', 'Done') DEFAULT 'Draft',
  total_items INT DEFAULT 0,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Receipt Items Table
```sql
CREATE TABLE receipt_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_id INT NOT NULL,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  received_quantity INT DEFAULT 0,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);
```

### Deliveries Table
```sql
CREATE TABLE deliveries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  delivery_number VARCHAR(255) UNIQUE NOT NULL,
  warehouse_id INT NOT NULL,
  customer_id INT,
  status ENUM('Draft', 'Waiting', 'Ready', 'Done') DEFAULT 'Draft',
  total_items INT DEFAULT 0,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);
```

### Delivery Items Table
```sql
CREATE TABLE delivery_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  delivery_id INT NOT NULL,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT NOT NULL,
  picked_quantity INT DEFAULT 0,
  FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
);
```

### Stock Move History Table
```sql
CREATE TABLE stock_moves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  from_location_id INT,
  to_location_id INT NOT NULL,
  quantity INT NOT NULL,
  move_type ENUM('Receipt', 'Delivery', 'Transfer', 'Adjustment', 'Count') NOT NULL,
  reference_type VARCHAR(50),
  reference_id INT,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (from_location_id) REFERENCES locations(id),
  FOREIGN KEY (to_location_id) REFERENCES locations(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX (product_id),
  INDEX (created_at),
  INDEX (move_type)
);
```

### Suppliers Table
```sql
CREATE TABLE suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## API Routes Structure

### Authentication Routes
```
POST /auth/signup - Register new user
POST /auth/login - Login user
POST /auth/logout - Logout user
GET /auth/profile - Get current user profile
PUT /auth/profile - Update user profile
POST /auth/change-password - Change password
POST /auth/setup-2fa - Setup 2FA
POST /auth/verify-2fa - Verify 2FA code
POST /auth/request-password-reset - Request password reset
POST /auth/reset-password - Reset password with OTP
```

### Dashboard Routes
```
GET /dashboard/summary - Get KPIs (total stock value, pending receipts, pending deliveries, locations count)
GET /dashboard/recent-receipts - Get recent receipts (max 5)
GET /dashboard/recent-deliveries - Get recent deliveries (max 5)
GET /dashboard/stock-alerts - Get low stock alerts
```

### Warehouse Routes
```
GET /warehouse - List all warehouses
POST /warehouse - Create warehouse
GET /warehouse/{id} - Get warehouse details with locations
PUT /warehouse/{id} - Update warehouse
DELETE /warehouse/{id} - Delete warehouse
```

### Location Routes
```
GET /location/warehouse/{warehouseId} - Get locations in warehouse
POST /location - Create location
PUT /location/{id} - Update location
DELETE /location/{id} - Delete location
GET /location/{id}/stock - Get stock levels in location
```

### Stock Routes
```
GET /stock - List stock with filters (product, location, warehouse)
GET /stock/{productId}/{locationId} - Get stock for product in location
GET /stock/low-stock - Get products below reorder level
```

### Receipt Routes
```
GET /receipt - List all receipts
POST /receipt - Create new receipt (status: Draft)
GET /receipt/{id} - Get receipt details with items
PUT /receipt/{id} - Update receipt (items)
POST /receipt/{id}/ready - Change status to Ready
POST /receipt/{id}/done - Change status to Done (updates stock)
DELETE /receipt/{id} - Delete receipt (Draft only)
```

### Delivery Routes
```
GET /delivery - List all deliveries
POST /delivery - Create new delivery (status: Draft)
GET /delivery/{id} - Get delivery details with items
PUT /delivery/{id} - Update delivery (items)
POST /delivery/{id}/waiting - Change status to Waiting
POST /delivery/{id}/ready - Change status to Ready (reserves stock)
POST /delivery/{id}/done - Change status to Done (updates stock)
DELETE /delivery/{id} - Delete delivery (Draft only)
```

### Move History Routes
```
GET /move-history - List all moves with filters (product, date range, type)
GET /move-history/product/{productId} - Get all moves for a product
GET /move-history/location/{locationId} - Get all moves in a location
```

---

## React Component Structure

```
App.jsx
├── Router
│   ├── ProtectedRoute
│   ├── LoginPage
│   ├── RegisterPage
│   ├── ForgotPasswordPage
│   └── AppLayout (Private)
│       ├── Navbar
│       ├── Sidebar
│       └── Main Content
│           ├── DashboardPage
│           │   ├── KpiCard (4 cards)
│           │   ├── ReceiptCard (Recent receipts)
│           │   ├── DeliveryCard (Recent deliveries)
│           │   ├── StockAlerts
│           │   └── ChartCard (Stock trend)
│           │
│           ├── WarehousePage
│           │   ├── WarehouseTable
│           │   ├── WarehouseModal (Create/Edit)
│           │   └── WarehouseDetail (w/ Locations)
│           │
│           ├── LocationPage
│           │   ├── LocationTable
│           │   ├── LocationModal (Create/Edit)
│           │   └── LocationDetail (w/ Stock)
│           │
│           ├── StockPage
│           │   ├── StockTable
│           │   ├── StockFilter
│           │   └── StockDetail
│           │
│           ├── ReceiptPage
│           │   ├── ReceiptTable (List)
│           │   ├── ReceiptForm (Create)
│           │   ├── ReceiptDetail (View/Edit)
│           │   ├── ReceiptItemForm
│           │   └── ReceiptStatusBadge
│           │
│           ├── DeliveryPage
│           │   ├── DeliveryTable (List)
│           │   ├── DeliveryForm (Create)
│           │   ├── DeliveryDetail (View/Edit)
│           │   ├── DeliveryItemForm
│           │   └── DeliveryStatusBadge
│           │
│           ├── MoveHistoryPage
│           │   ├── MoveHistoryTable (Filter, Pagination)
│           │   ├── MoveFilter
│           │   ├── MoveDetail (Timeline view)
│           │   └── MoveExport (CSV)
│           │
│           └── SettingsPage
│               ├── AccountTab (Profile, Password, 2FA)
│               ├── WarehouseSettings
│               └── GeneralSettings
```

---

## Inventory Transaction Logic

### Receipt Flow
```
1. Create Receipt (Draft)
   - Set warehouse
   - Add items (product, location, quantity, unit_price)
   - Save as Draft

2. Mark as Ready
   - Validate all items present
   - Reserve stock
   - Status: Ready

3. Mark as Done
   - For each receipt item:
     a. Get stock record (product, location)
     b. Increment quantity
     c. Create stock_move entry:
        - move_type: 'Receipt'
        - from_location_id: NULL (external source)
        - to_location_id: location_id
        - reference_type: 'Receipt'
        - reference_id: receipt.id
   - Status: Done
   - Release reserved stock
```

### Delivery Flow
```
1. Create Delivery (Draft)
   - Set warehouse
   - Add items (product, location, quantity)
   - Save as Draft

2. Mark as Waiting
   - Validate stock available
   - Status: Waiting

3. Mark as Ready
   - Reserve stock for all items
   - Check stock.available >= quantity
   - If fail: Show error, prevent transition
   - Status: Ready

4. Mark as Done
   - For each delivery item:
     a. Get stock record (product, location)
     b. Decrement quantity
     c. Create stock_move entry:
        - move_type: 'Delivery'
        - from_location_id: location_id
        - to_location_id: NULL (external destination)
        - reference_type: 'Delivery'
        - reference_id: delivery.id
   - Status: Done
   - Release reserved stock
```

### Stock Validation
```
BEFORE any stock operation:
- Ensure stock.available (quantity - reserved) >= requested quantity
- If insufficient: Throw error "Insufficient stock"
- Update stock.reserved when items transition
- Ensure stock.quantity NEVER becomes negative
```

---

## Data Flow (UI → API → DB)

### Receipt Creation Flow
```
UI (ReceiptForm)
  ↓
  User fills: warehouse, items (product, location, qty)
  ↓ onClick "Create"
POST /receipt { warehouse_id, items: [...] }
  ↓ Backend
  Create receipts row (status: Draft)
  For each item: Create receipt_items row
  ↓
Returns: { id, receipt_number, status: 'Draft', items: [...] }
  ↓
UI (ReceiptDetail)
  Shows receipt with items
  Button: "Mark as Ready"
  ↓ onClick "Mark as Ready"
POST /receipt/{id}/ready
  ↓ Backend
  Validate items present
  Reserve stock for all items
  Update receipts.status = 'Ready'
  ↓
UI updates, shows "Mark as Done" button
  ↓ onClick "Mark as Done"
POST /receipt/{id}/done
  ↓ Backend
  For each receipt_item:
    - Get stock (product_id, location_id)
    - Increment stock.quantity += item.quantity
    - Insert stock_moves row (Receipt, from=NULL, to=location)
  Update receipts.status = 'Done'
  ↓
Returns success
UI shows confirmation, redirects to receipts list
```

### Delivery Creation Flow
```
Similar to Receipt but:
  - Status transitions: Draft → Waiting → Ready → Done
  - On "Mark as Ready": Reserve stock (check available)
  - On "Mark as Done": Decrement stock (check available)
  - stock_moves.move_type = 'Delivery', from=location, to=NULL
```

---

## Implementation Priority

### Phase 1: Foundation
- [ ] Database schema (all tables)
- [ ] User authentication (login, signup already done)
- [ ] Dashboard basic layout

### Phase 2: Warehouse & Stock
- [ ] Warehouse CRUD
- [ ] Location CRUD
- [ ] Stock tracking & display
- [ ] Stock alerts

### Phase 3: Receipts
- [ ] Receipt CRUD
- [ ] Receipt status flow (Draft → Ready → Done)
- [ ] Stock increment logic
- [ ] Move history creation

### Phase 4: Deliveries
- [ ] Delivery CRUD
- [ ] Delivery status flow (Draft → Waiting → Ready → Done)
- [ ] Stock reservation logic
- [ ] Stock decrement logic
- [ ] Move history creation

### Phase 5: Advanced Features
- [ ] Move history UI & filtering
- [ ] Stock reports & analytics
- [ ] Batch operations
- [ ] Data export

---

## Status Transition Rules

### Receipt Status Transitions
```
Draft → Ready
  ✓ All items filled
  ✓ Each item has product, location, quantity
  ✓ Warehouse selected
  ✓ Action: Reserve stock

Ready → Done
  ✓ Status is Ready
  ✓ Action: Increment stock, create moves, release reserved

Draft → Delete (allowed)
Ready → Draft (allowed) [unreserve stock]
Ready → Delete (not allowed)
Done → Delete (not allowed)
```

### Delivery Status Transitions
```
Draft → Waiting
  ✓ All items filled
  ✓ Each item has product, location, quantity
  ✓ Warehouse selected

Waiting → Ready
  ✓ Status is Waiting
  ✓ Stock available for all items (quantity - reserved >= needed)
  ✓ Action: Reserve stock for delivery items

Ready → Done
  ✓ Status is Ready
  ✓ Action: Decrement stock, create moves, release reserved

Draft → Delete (allowed)
Waiting → Draft (allowed)
Ready → Waiting (allowed) [unreserve stock]
Ready → Delete (not allowed)
Done → Delete (not allowed)
```

---

## Next Steps

1. Update database schema with all new tables
2. Create backend routes for Receipts, Deliveries, Move History
3. Implement transaction logic with stock validation
4. Build React components for each module
5. Add UI validation & error handling
6. Test status transitions thoroughly

