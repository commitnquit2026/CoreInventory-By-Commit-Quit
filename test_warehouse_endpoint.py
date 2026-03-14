#!/usr/bin/env python3
"""
Test warehouse endpoint with correct path
"""
import requests

BASE_URL = "http://localhost:5000"

# Login
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"username": "manager1", "password": "Manager@123"}
)
token = login_resp.json().get("token")
headers = {"Authorization": f"Bearer {token}"}

print("Testing Warehouse Endpoints")
print("=" * 60)

# Try both paths
paths = [
    "/api/v1/warehouses",
    "/api/v1/inventory/warehouses"
]

for path in paths:
    try:
        resp = requests.get(f"{BASE_URL}{path}", headers=headers)
        if resp.status_code == 200:
            data = resp.json()
            count = len(data.get('data', []))
            print(f"✅ {path:<35} {resp.status_code} - {count} warehouses")
        else:
            print(f"❌ {path:<35} {resp.status_code} - {resp.json().get('message', 'Error')}")
    except Exception as e:
        print(f"❌ {path:<35} ERROR - {str(e)}")
