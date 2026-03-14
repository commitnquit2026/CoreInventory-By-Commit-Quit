#!/usr/bin/env python3
"""
Test inventory endpoints for Inventory Manager
"""
import requests

BASE_URL = "http://localhost:5000"

# Login as inventory manager
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"username": "manager1", "password": "Manager@123"}
)
login_data = login_resp.json()

if not login_data.get("token"):
    print("❌ Login failed")
    print(login_data)
    exit(1)

token = login_data.get("token")
headers = {"Authorization": f"Bearer {token}"}

# Test inventory endpoints
endpoints = [
    ("/api/v1/products", "GET", "Products"),
    ("/api/v1/inventory/warehouses", "GET", "Warehouses"),
    ("/api/v1/inventory/receipts", "GET", "Receipts"),
    ("/api/v1/inventory/deliveries", "GET", "Deliveries"),
    ("/api/v1/inventory/transfers", "GET", "Transfers"),
    ("/api/v1/inventory/adjustments", "GET", "Adjustments"),
    ("/api/v1/inventory/ledger", "GET", "Ledger"),
]

print("Testing Inventory Manager Endpoints")
print("=" * 60)

for endpoint, method, label in endpoints:
    try:
        if method == "GET":
            resp = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        resp_data = resp.json()
        
        if resp.status_code in [200, 201]:
            print(f"✅ {label:<20} {resp.status_code} - OK")
        else:
            print(f"❌ {label:<20} {resp.status_code} - {resp_data.get('message', 'Error')}")
    except Exception as e:
        print(f"❌ {label:<20} ERROR - {str(e)}")
