#!/usr/bin/env python3
"""Test product creation to see why it's failing"""
import requests
import json
from datetime import datetime

BASE_URL = 'http://localhost:5000'

# Login
login = requests.post(f'{BASE_URL}/api/v1/auth/login', 
    json={'username': 'manager1', 'password': 'Manager@123'})
token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}

print("=" * 80)
print("PRODUCT CREATION TEST")
print("=" * 80)

# Test 1: Get categories first
print("\n1. Get available categories:")
cat_response = requests.get(f'{BASE_URL}/api/v1/products/categories', headers=headers)
print(f"Status: {cat_response.status_code}")
categories = cat_response.json().get('data', [])
print(f"Categories: {[c.get('name') for c in categories]}")

if categories:
    cat_id = categories[0]['id']
    print(f"Using category ID: {cat_id}")
    
    # Test 2: Try to create a product
    print("\n2. Try creating a product:")
    product_data = {
        'name': f'Test Product {datetime.now().isoformat()}',
        'sku': f'TEST-{int(datetime.now().timestamp())}',
        'category_id': cat_id,
        'initial_stock': 50
    }
    print(f"Payload: {json.dumps(product_data, indent=2)}")
    
    product_response = requests.post(
        f'{BASE_URL}/api/v1/products',
        headers=headers,
        json=product_data
    )
    print(f"Status: {product_response.status_code}")
    print(f"Response: {json.dumps(product_response.json(), indent=2)}")
