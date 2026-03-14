#!/usr/bin/env python3
"""Test manager access to inventory endpoints"""

import requests
import json

BASE_URL = 'http://localhost:5000'
MANAGER_CREDENTIALS = {
    'username': 'manager1',
    'password': 'Manager@123'
}

def test_manager_inventory():
    """Test all inventory endpoints with manager user"""
    
    # Step 1: Login as manager
    print("=" * 60)
    print("1. LOGIN AS MANAGER")
    print("=" * 60)
    login_response = requests.post(
        f'{BASE_URL}/api/v1/auth/login',
        json=MANAGER_CREDENTIALS
    )
    print(f"Status: {login_response.status_code}")
    print(f"Response: {json.dumps(login_response.json(), indent=2)}")
    
    if login_response.status_code != 200:
        print("\n❌ Manager login failed!")
        return
    
    resp_data = login_response.json()
    token = resp_data.get('token') or resp_data.get('data', {}).get('access_token')
    headers = {'Authorization': f'Bearer {token}'}
    
    # Step 2: Test Products endpoint
    print("\n" + "=" * 60)
    print("2. GET PRODUCTS")
    print("=" * 60)
    products_response = requests.get(
        f'{BASE_URL}/api/v1/products',
        headers=headers
    )
    print(f"Status: {products_response.status_code}")
    print(f"Response: {json.dumps(products_response.json(), indent=2)[:500]}...")
    
    # Step 3: Test Warehouses endpoint
    print("\n" + "=" * 60)
    print("3. GET WAREHOUSES")
    print("=" * 60)
    warehouses_response = requests.get(
        f'{BASE_URL}/api/v1/warehouses',
        headers=headers
    )
    print(f"Status: {warehouses_response.status_code}")
    print(f"Response: {json.dumps(warehouses_response.json(), indent=2)[:500]}...")
    
    # Step 4: Test Receipts endpoint
    print("\n" + "=" * 60)
    print("4. GET RECEIPTS (requires Inventory Manager role)")
    print("=" * 60)
    receipts_response = requests.get(
        f'{BASE_URL}/api/v1/inventory/receipts',
        headers=headers
    )
    print(f"Status: {receipts_response.status_code}")
    print(f"Response: {json.dumps(receipts_response.json(), indent=2)[:500]}...")
    
    # Step 5: Test Create Receipt
    print("\n" + "=" * 60)
    print("5. CREATE RECEIPT (requires Inventory Manager/Staff)")
    print("=" * 60)
    create_receipt_response = requests.post(
        f'{BASE_URL}/api/v1/inventory/receipts',
        headers=headers,
        json={
            'supplier_id': 1,
            'warehouse_id': 1,
            'expected_delivery': '2026-03-20'
        }
    )
    print(f"Status: {create_receipt_response.status_code}")
    print(f"Response: {json.dumps(create_receipt_response.json(), indent=2)}")

if __name__ == '__main__':
    test_manager_inventory()
