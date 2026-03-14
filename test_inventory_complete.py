#!/usr/bin/env python3
"""
Test ALL inventory endpoints with CORRECT paths
"""
import requests

BASE_URL = "http://localhost:5000"

# Login as inventory manager
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"username": "manager1", "password": "Manager@123"}
)
token = login_resp.json().get("token")
headers = {"Authorization": f"Bearer {token}"}

# Test endpoints with CORRECT paths
endpoints = [
    ("/api/v1/products", "Products"),
    ("/api/v1/warehouses", "Warehouses"),  # CORRECT path
    ("/api/v1/inventory/receipts", "Receipts"),
    ("/api/v1/inventory/deliveries", "Deliveries"),
    ("/api/v1/inventory/transfers", "Transfers"),
    ("/api/v1/inventory/adjustments", "Adjustments"),
    ("/api/v1/inventory/ledger", "Ledger"),
    ("/api/v1/suppliers", "Suppliers"),
]

print("✅ Inventory Manager - All Endpoints Test")
print("=" * 60)

all_working = True
for endpoint, label in endpoints:
    try:
        resp = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
        
        if resp.status_code in [200, 201]:
            data = resp.json()
            items = len(data.get('data', []))
            print(f"✅ {label:<20} {resp.status_code} - {items} items")
        else:
            print(f"❌ {label:<20} {resp.status_code} - {resp.json().get('message', 'Error')}")
            all_working = False
    except Exception as e:
        print(f"❌ {label:<20} ERROR - {str(e)}")
        all_working = False

print("=" * 60)
if all_working:
    print("✅ ALL INVENTORY FUNCTIONS ARE WORKING!")
else:
    print("⚠️  Some functions need fixes")
