#!/usr/bin/env python3
"""Comprehensive frontend pages data structure test"""
import requests
import json

BASE_URL = 'http://localhost:5000'

# Login
login = requests.post(f'{BASE_URL}/api/v1/auth/login', 
    json={'username': 'manager1', 'password': 'Manager@123'})
token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}

print("=" * 80)
print("COMPREHENSIVE PAGES DATA STRUCTURE VERIFICATION")
print("=" * 80)

# Test all major endpoints
tests = [
    ('Products', '/products'),
    ('Warehouses', '/warehouses'),
    ('Suppliers', '/suppliers'),
    ('Receipts', '/inventory/receipts'),
    ('Deliveries', '/inventory/deliveries'),
    ('Transfers', '/inventory/transfers'),
    ('Stock Ledger', '/inventory/ledger'),
    ('Warehouse 1 Locations', '/warehouses/1/locations'),
]

for name, endpoint in tests:
    try:
        response = requests.get(f'{BASE_URL}/api/v1{endpoint}', headers=headers)
        status = response.status_code
        data = response.json()
        
        # Check if response has data
        has_data = 'data' in data or 'locations' in data or 'items' in data
        data_count = 0
        
        if 'data' in data and isinstance(data['data'], list):
            data_count = len(data['data'])
        elif 'locations' in data and isinstance(data['locations'], list):
            data_count = len(data['locations'])
        
        status_symbol = "✓" if status == 200 else "✗"
        print(f"\n{status_symbol} [{status}] {name}")
        print(f"   └─ Has data structure: {'✓' if has_data else '✗'}")
        print(f"   └─ Record count: {data_count}")
        
        if status != 200:
            print(f"   └─ Error: {data.get('message', 'Unknown error')}")
    except Exception as e:
        print(f"\n✗ {name}")
        print(f"   └─ Exception: {str(e)}")

print("\n" + "=" * 80)
print("VERIFICATION COMPLETE")
print("=" * 80)
