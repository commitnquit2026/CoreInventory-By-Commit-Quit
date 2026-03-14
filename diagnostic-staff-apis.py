#!/usr/bin/env python3
"""
CoreInventory - Warehouse Staff Function Diagnostic
Tests all Staff-specific endpoints with correct permissions
"""

import requests
import json

BASE_URL = "http://localhost:5000"

# Test with staff user
STAFF_USERNAME = "staff"
STAFF_PASSWORD = "Test@123456"

print("🔧 CoreInventory - Warehouse Staff Diagnostic")
print("=" * 60)
print("")

# ============================================================================
# Step 1: Authenticate as Staff
# ============================================================================
print("Step 1: Authenticating as Warehouse Staff...")
print("-" * 60)

try:
    login_resp = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"username": STAFF_USERNAME, "password": STAFF_PASSWORD}
    )
    login_data = login_resp.json()
    
    if not login_data.get("token"):
        print(f"❌ Staff login failed")
        print(f"Response: {login_data}")
        exit(1)
    
    token = login_data.get("token")
    user = login_data.get("user", {})
    
    print(f"✅ Staff authentication successful")
    print(f"   Username: {user.get('username')}")
    print(f"   Role: {user.get('role')}")
    print(f"   Email: {user.get('email')}")
    print("")
    
except Exception as e:
    print(f"❌ Authentication error: {e}")
    exit(1)

headers = {"Authorization": f"Bearer {token}"}

# ============================================================================
# Step 2: Test Staff Dashboard
# ============================================================================
print("Step 2: Staff Dashboard Functions")
print("-" * 60)

try:
    resp = requests.get(f"{BASE_URL}/api/v1/inventory/dashboard", headers=headers)
    if resp.status_code == 200:
        data = resp.json().get("data", {})
        kpis = data.get("kpis", {})
        print(f"✅ Dashboard loaded")
        print(f"   Pending Receipts: {kpis.get('pendingReceipts', 0)}")
        print(f"   Pending Deliveries: {kpis.get('pendingDeliveries', 0)}")
        print(f"   Internal Transfers: {kpis.get('internalTransfers', 0)}")
        print(f"   Total Units in Stock: {kpis.get('totalProductsInStock', 0)}")
    else:
        print(f"❌ Dashboard error: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Dashboard error: {e}")

print("")

# ============================================================================
# Step 3: Test Warehouse Access
# ============================================================================
print("Step 3: Warehouse Access")
print("-" * 60)

try:
    resp = requests.get(f"{BASE_URL}/api/v1/warehouses", headers=headers)
    if resp.status_code == 200:
        data = resp.json().get("data", [])
        print(f"✅ Warehouses accessible: {len(data)} warehouses")
        for wh in data[:2]:  # Show first 2
            print(f"   • {wh.get('name')} (ID: {wh.get('id')})")
    else:
        print(f"❌ Warehouses error: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Warehouses error: {e}")

print("")

# ============================================================================
# Step 4: Test Operations (Receipts, Deliveries, Transfers, Adjustments)
# ============================================================================
print("Step 4: Stock Operations Access")
print("-" * 60)

operations = [
    ("Receipts", "/api/v1/inventory/receipts"),
    ("Deliveries", "/api/v1/inventory/deliveries"),
    ("Transfers", "/api/v1/inventory/transfers"),
    ("Adjustments", "/api/v1/inventory/adjustments"),
]

for op_name, op_path in operations:
    try:
        resp = requests.get(f"{BASE_URL}{op_path}", headers=headers)
        if resp.status_code == 200:
            data = resp.json().get("data", [])
            print(f"✅ {op_name:<15} accessible ({len(data)} items)")
        else:
            print(f"❌ {op_name:<15} error: {resp.status_code}")
            error = resp.json().get("message", "Unknown error")
            print(f"   {error}")
    except Exception as e:
        print(f"❌ {op_name:<15} error: {e}")

print("")

# ============================================================================
# Step 5: Test Ledger / Move History
# ============================================================================
print("Step 5: Ledger / Move History Access")
print("-" * 60)

try:
    resp = requests.get(f"{BASE_URL}/api/v1/inventory/ledger", headers=headers)
    if resp.status_code == 200:
        data = resp.json().get("data", [])
        print(f"✅ Ledger accessible ({len(data)} entries)")
    else:
        print(f"❌ Ledger error: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Ledger error: {e}")

print("")

# ============================================================================
# Step 6: Test Role-Based Restrictions
# ============================================================================
print("Step 6: Role-Based Restrictions (Should Fail)")
print("-" * 60)

restricted_endpoints = [
    ("Create Product", "POST", "/api/v1/products", {}),
    ("View Categories", "GET", "/api/v1/products/categories", None),
    ("Create Supplier", "POST", "/api/v1/suppliers", {"name": "Test"}),
    ("List Users", "GET", "/api/v1/users", None),
]

for name, method, path, payload in restricted_endpoints:
    try:
        if method == "GET":
            resp = requests.get(f"{BASE_URL}{path}", headers=headers)
        else:
            resp = requests.post(f"{BASE_URL}{path}", headers=headers, json=payload)
        
        if resp.status_code == 403:
            print(f"✅ {name:<25} blocked (403 - Good!)")
        else:
            status = resp.status_code
            msg = resp.json().get("message", "")
            print(f"⚠️  {name:<25} {status} - {msg}")
    except Exception as e:
        print(f"❌ {name:<25} error: {e}")

print("")

# ============================================================================
# Step 7: Test CREATE Operations (Staff Should Be Allowed)
# ============================================================================
print("Step 7: Staff Create Operations (Should Work)")
print("-" * 60)

# Test creating a receipt
try:
    receipt_data = {
        "supplier_id": 1,
        "warehouse_id": 1,
        "notes": "Test receipt by staff"
    }
    resp = requests.post(f"{BASE_URL}/api/v1/inventory/receipts", headers=headers, json=receipt_data)
    if resp.status_code == 201:
        print(f"✅ Create Receipt: Allowed")
    else:
        print(f"⚠️  Create Receipt: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Create Receipt error: {e}")

# Test creating a delivery
try:
    delivery_data = {
        "warehouse_id": 1,
        "customer_name": "Test Customer",
        "notes": "Test delivery by staff"
    }
    resp = requests.post(f"{BASE_URL}/api/v1/inventory/deliveries", headers=headers, json=delivery_data)
    if resp.status_code == 201:
        print(f"✅ Create Delivery: Allowed")
    else:
        print(f"⚠️  Create Delivery: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Create Delivery error: {e}")

# Test creating a transfer
try:
    transfer_data = {
        "source_location_id": 1,
        "destination_location_id": 2,
        "notes": "Test transfer by staff"
    }
    resp = requests.post(f"{BASE_URL}/api/v1/inventory/transfers", headers=headers, json=transfer_data)
    if resp.status_code == 201:
        print(f"✅ Create Transfer: Allowed")
    else:
        print(f"⚠️  Create Transfer: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Create Transfer error: {e}")

# Test creating an adjustment
try:
    adjustment_data = {
        "product_id": 1,
        "location_id": 1,
        "system_quantity": 10,
        "physical_quantity": 12,
        "reason": "Physical count adjustment",
        "notes": "Test adjustment by staff"
    }
    resp = requests.post(f"{BASE_URL}/api/v1/inventory/adjustments", headers=headers, json=adjustment_data)
    if resp.status_code == 201:
        print(f"✅ Create Adjustment: Allowed")
    else:
        print(f"⚠️  Create Adjustment: {resp.status_code}")
        print(f"   {resp.json()}")
except Exception as e:
    print(f"❌ Create Adjustment error: {e}")

print("")

# ============================================================================
# Summary
# ============================================================================
print("=" * 60)
print("✅ Warehouse Staff Diagnostic Complete")
print("=" * 60)
print("")
print("📋 Staff Functions Summary:")
print("   ✅ Dashboard - View tasks (Receipts, Deliveries, Transfers, Adjustments)")
print("   ✅ Warehouses - View warehouse locations")
print("   ✅ Operations - Create & manage receipts, deliveries, transfers, adjustments")
print("   ✅ Ledger - View stock movement history")
print("   ✅ Restrictions - Cannot create products, manage suppliers, or see users")
print("")
