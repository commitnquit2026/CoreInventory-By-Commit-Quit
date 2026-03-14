# System Architecture - Complete Analysis

## Pages & Workflows (From Diagrams)

### 1. **Login/Signup Page**
- Login with ID and Password
- Sign up with Login ID, Email ID, Password, Re-enter Password
- Forgot Password option
- Links to main app after auth

### 2. **Dashboard**
- Tab Navigation: Dashboard | Operations | Products | Move History | Settings
- Two main cards:
  - **Receipt**: Shows "6 to receive" count
  - **Delivery**: Shows "6 waiting" and "6 operations" counts
- Displays late schedule date & today's date
- Operations schedule date & today's date
- Waiting list for the stocks

### 3. **Stock Page** (Warehouse view)
- Tab Navigation: Dashboard | Operations | Products | Move History | Settings
- Stock table with columns:
  - Product
  - per unit cost
  - On hand
  - free to Use
- Example: Desk (3000 Rs, 50 On hand, 45 free)
- Search functionality
- Annotation: "User must be able to update the stock from here"

### 4. **Warehouse Page**
- Shows warehouse details & location form
- Fields: Name, Short Code, Address

### 5. **Location Page**
- Warehouse location list
- Fields shown: Name, Warehouse ID

### 6. **Move History Page**
- Table with columns: SKU | Date | Operation | Location | Ref/Type(?) | Quantity | Status
- Example rows visible:
  - SKU001 | 5/1/2021 | Stock Inward | Vendor | 10 | Ready
  - SKU002 | 5/1/2021 | Vendor | Vendor | 5 | Ready
  - SKU003 | 5/20/2021 | WMS to Stock | Vendor | - | Ready
- Filter by: List View/Grid View
- Allow switch to filter view based on references & contexts
- Info: "Perpendicular moves between locations - To location is mandatory"

### 7. **Delivery Page**
- Status tabs: Unfulfilled | Proof | Loaded
- Status flow buttons: Draft > Waiting > Ready > Done
- Shows Delivery ID
- Products with quantity and status
- Validation & Print buttons

### 8. **Receipt Page**
- New Receipt form
- Fields: Receipt ID, Receive From, Schedule Date, Responsible
- Status flow: Draft > Ready > Done
- Products section to add items
- Validation & Print buttons

---

## API Endpoints Required

### Auth (Already exists)
- POST /auth/signup
- POST /auth/login
- POST /auth/change-password
- POST /auth/setup-2fa
- POST /auth/verify-2fa

### Warehouses
- GET /warehouses
- POST /warehouses
- GET /warehouses/{id}
- PUT /warehouses/{id}

### Locations
- GET /warehouses/{id}/locations
- POST /warehouses/{id}/locations
- PUT /locations/{id}

### Products
- GET /products
- POST /products
- GET /products/{id}

### Stock
- GET /stock
- GET /stock/{product_id}/by-location
- PUT /stock/{product_id}/{location_id}

### Receipts
- GET /receipts
- POST /receipts
- GET /receipts/{id}
- PUT /receipts/{id}/status (Draft → Ready → Done)
- POST /receipts/{id}/items (add product)

### Deliveries
- GET /deliveries
- POST /deliveries
- GET /deliveries/{id}
- PUT /deliveries/{id}/status
- POST /deliveries/{id}/items

### Move History
- GET /move-history
- GET /move-history?product_id=X&location_id=Y

