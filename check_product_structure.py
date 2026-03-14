#!/usr/bin/env python3
"""
Check what product data structure the API returns
"""
import requests
import json

BASE_URL = "http://localhost:5000"

# Login
login_resp = requests.post(
    f"{BASE_URL}/api/v1/auth/login",
    json={"username": "manager1", "password": "Manager@123"}
)
token = login_resp.json().get("token")
headers = {"Authorization": f"Bearer {token}"}

# Get products
resp = requests.get(f"{BASE_URL}/api/v1/products", headers=headers)
data = resp.json()

print("Product Data Structure")
print("=" * 60)

if data.get('data'):
    products = data['data'] if isinstance(data['data'], list) else [data['data']]
    
    if products:
        product = products[0]
        print(json.dumps(product, indent=2, default=str))
    else:
        print("No products found")
else:
    print("No 'data' field in response")
    print(json.dumps(data, indent=2, default=str))
