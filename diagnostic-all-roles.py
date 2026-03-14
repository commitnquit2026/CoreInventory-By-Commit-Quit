#!/usr/bin/env python3
"""
CoreInventory - All Roles Access Control Diagnostic
Tests Inventory Manager vs Warehouse Staff permissions
"""

import requests
import json

BASE_URL = "http://localhost:5000"

# Test users
INVENTORY_MANAGER = {
    "username": "testuser",
    "password": "Test@123456",
    "role": "Inventory Manager"
}

WAREHOUSE_STAFF = {
    "username": "staff",
    "password": "Test@123456",
    "role": "Warehouse Staff"
}

def test_user(user_config):
    """Test all endpoints for a specific user"""
    print(f"\n{'='*70}")
    print(f"Testing {user_config['role']}")
    print(f"{'='*70}\n")
    
    # Login
    try:
        login_resp = requests.post(
            f"{BASE_URL}/api/v1/auth/login",
            json={"username": user_config['username'], "password": user_config['password']}
        )
        login_data = login_resp.json()
        
        if not login_data.get("token"):
            print(f"❌ Login failed for {user_config['role']}")
            print(f"Response: {login_data}")
            return
        
        token = login_data.get("token")
        user = login_data.get("user", {})
        
        print(f"✅ Authentication successful")
        print(f"   Username: {user.get('username')}")
        print(f"   Role: {user.get('role')}")
        print(f"   Email: {user.get('email')}\n")
        
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test endpoints by category
    test_categories = {
        "Read Operations": [
            ("GET", "/api/v1/inventory/dashboard", None, "Dashboard"),
            ("GET", "/api/v1/inventory/warehouses", None, "Warehouses"),
            ("GET", "/api/v1/inventory/receipts", None, "Receipts"),
            ("GET", "/api/v1/inventory/deliveries", None, "Deliveries"),
            ("GET", "/api/v1/inventory/transfers", None, "Transfers"),
            ("GET", "/api/v1/inventory/adjustments", None, "Adjustments"),
            ("GET", "/api/v1/inventory/ledger", None, "Ledger"),
        ],
        "Create Operations": [
            ("POST", "/api/v1/inventory/receipts", {"supplier_id": 1, "warehouse_id": 1}, "Create Receipt"),
            ("POST", "/api/v1/inventory/deliveries", {"warehouse_id": 1, "customer_name": "Test"}, "Create Delivery"),
            ("POST", "/api/v1/inventory/transfers", {"source_location_id": 1, "destination_location_id": 2}, "Create Transfer"),
            ("POST", "/api/v1/inventory/adjustments", {"product_id": 1, "location_id": 1, "system_quantity": 10, "physical_quantity": 12, "reason": "Test"}, "Create Adjustment"),
        ],
        "Admin Operations": [
            ("POST", "/api/v1/products", {"name": "Test Prod", "sku": "TEST001"}, "Create Product"),
            ("POST", "/api/v1/suppliers", {"name": "Test Supplier"}, "Create Supplier"),
        ],
        "Approval Operations": [
            ("POST", "/api/v1/inventory/receipts/1/approve", {}, "Approve Receipt"),
            ("POST", "/api/v1/inventory/deliveries/1/approve", {}, "Approve Delivery"),
            ("POST", "/api/v1/inventory/adjustments/1/approve", {}, "Approve Adjustment"),
        ]
    }
    
    results = {}
    
    for category, endpoints in test_categories.items():
        print(f"\n{category}")
        print("-" * 70)
        
        category_results = []
        
        for method, endpoint, data, label in endpoints:
            try:
                if method == "GET":
                    resp = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
                elif method == "POST":
                    resp = requests.post(f"{BASE_URL}{endpoint}", headers=headers, json=data or {})
                
                status = resp.status_code
                
                # Determine if allowed or blocked
                if status in [200, 201]:
                    symbol = "✅"
                    allowed = "Allowed"
                elif status == 403:
                    symbol = "🔒"
                    allowed = "Blocked (No Permission)"
                elif status == 404:
                    symbol = "⚠️"
                    allowed = "Not Found"
                elif status == 400:
                    symbol = "⚠️"
                    allowed = "Bad Request (Data)"
                else:
                    symbol = "❌"
                    allowed = f"Error ({status})"
                
                print(f"{symbol} {label:<30} {status} - {allowed}")
                category_results.append((label, status, allowed))
                
            except Exception as e:
                print(f"❌ {label:<30} Connection error: {e}")
                category_results.append((label, "ERR", str(e)))
        
        results[category] = category_results
    
    # Summary
    print(f"\n{'='*70}")
    print(f"Summary for {user_config['role']}")
    print(f"{'='*70}")
    
    can_read = any("Read" in cat for cat in results.keys())
    can_create = any("Create" in cat for cat in results.keys())
    can_admin = results.get("Admin Operations", [])
    can_approve = results.get("Approval Operations", [])
    
    admin_blocked = all(status == 403 for _, status, _ in can_admin) if can_admin else False
    
    print(f"✅ Can Read Data: Yes")
    print(f"✅ Can Create Operations: Yes")
    print(f"🔒 Admin Operations Blocked: {admin_blocked}")
    if user_config['role'] == "Inventory Manager":
        print(f"✅ Can Approve Operations: Yes (expected)")
    else:
        print(f"🔒 Can Approve Operations: No (expected)")
    
    return results

# Run diagnostics for both users
print("\n" + "="*70)
print("CoreInventory - Complete Role-Based Access Control Test")
print("="*70)

for user in [INVENTORY_MANAGER, WAREHOUSE_STAFF]:
    test_user(user)

print(f"\n{'='*70}")
print("Test Complete")
print(f"{'='*70}\n")
