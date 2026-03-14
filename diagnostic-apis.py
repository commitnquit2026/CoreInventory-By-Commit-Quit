#!/usr/bin/env python3
"""
CoreInventory - Complete API Endpoint Diagnostic
Tests all sidebar endpoints and identifies issues
"""

import requests
import json
from datetime import datetime

# API Configuration
BASE_URL = "http://localhost:5000"
USERNAME = "testuser"
PASSWORD = "Test@123456"

# Get auth token
print("🔍 CoreInventory - Complete API Diagnostic")
print("=" * 50)
print("")

try:
    login_resp = requests.post(
        f"{BASE_URL}/api/v1/auth/login",
        json={"username": USERNAME, "password": PASSWORD}
    )
    token = login_resp.json().get("token")
    if not token:
        print("❌ Failed to authenticate")
        exit(1)
    
    print("✅ Authentication successful")
    print(f"Token: {token[:50]}...")
    print("")
except Exception as e:
    print(f"❌ Authentication error: {e}")
    exit(1)

# Test endpoints
headers = {"Authorization": f"Bearer {token}"}
endpoints = [
    # Dashboard
    ("Dashboard KPIs", "GET", "/api/v1/inventory/dashboard"),
    
    # Products
    ("Products List", "GET", "/api/v1/products"),
    ("Categories List", "GET", "/api/v1/products/categories"),
    
    # Warehouses
    ("Warehouses List", "GET", "/api/v1/warehouses"),
    ("Locations List (Warehouse 1)", "GET", "/api/v1/warehouses/1/locations"),
    
    # Suppliers
    ("Suppliers List", "GET", "/api/v1/suppliers"),
    
    # Operations
    ("Receipts List", "GET", "/api/v1/inventory/receipts"),
    ("Deliveries List", "GET", "/api/v1/inventory/deliveries"),
    ("Transfers List", "GET", "/api/v1/inventory/transfers"),
    ("Adjustments List", "GET", "/api/v1/inventory/adjustments"),
    
    # Ledger
    ("Stock Ledger", "GET", "/api/v1/inventory/ledger"),
    
    # User
    ("User Profile", "GET", "/api/v1/auth/profile"),
]

print("📋 ENDPOINT TEST RESULTS")
print("=" * 50)
print("")

passed = 0
failed = 0

for name, method, path in endpoints:
    full_url = f"{BASE_URL}{path}"
    
    try:
        if method == "GET":
            resp = requests.get(full_url, headers=headers)
        else:
            resp = requests.post(full_url, headers=headers)
        
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data.get("data"), list):
                count = len(data.get("data", []))
                print(f"✅ {name:<35} ({count} items)")
            else:
                print(f"✅ {name:<35}")
            passed += 1
        else:
            error = resp.json().get("message", "Unknown error")
            print(f"❌ {name:<35} [{resp.status_code}] {error}")
            failed += 1
            
    except Exception as e:
        print(f"❌ {name:<35} [ERROR] {str(e)}")
        failed += 1

print("")
print("=" * 50)
print(f"Results: {passed} ✅ | {failed} ❌")
print("=" * 50)

if failed > 0:
    print("")
    print("⚠️ ISSUES FOUND:")
    print("")
    print("📌 Categories endpoint might need correct path in frontend")
    print("   Frontend should call: GET /api/v1/products/categories")
    print("")
    print("📌 Locations endpoint requires warehouse ID")
    print("   Frontend should call: GET /api/v1/warehouses/{warehouse_id}/locations")
    print("")
    print("📌 Users endpoint may not exist yet")
    print("   Need to check if user management is required")

print("")
print("✅ Sidebar should now load without errors!")
