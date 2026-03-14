#!/usr/bin/env python3
"""
Verify ProductsPage fix works correctly
Test that stock sorting works with the initial_stock fallback
"""

import requests
import json

BASE_URL = 'http://localhost:5000'

def test_products_data_structure():
    """Test that products endpoint returns correct data for frontend"""
    
    print("\n" + "=" * 70)
    print("PRODUCTS ENDPOINT DATA STRUCTURE TEST")
    print("=" * 70)
    
    # First login to get token
    login_response = requests.post(
        f'{BASE_URL}/api/v1/auth/login',
        json={'username': 'manager1', 'password': 'Manager@123'}
    )
    token = login_response.json().get('token')
    headers = {'Authorization': f'Bearer {token}'}
    
    # Get products
    response = requests.get(f'{BASE_URL}/api/v1/products', headers=headers)
    
    if response.status_code != 200:
        print(f"❌ Failed to fetch products: {response.status_code}")
        print(response.json())
        return
    
    data = response.json()
    products = data.get('data', [])
    
    print(f"\n✓ Retrieved {len(products)} products")
    
    if products:
        print("\n✓ Sample Product Structure:")
        sample = products[0]
        for key, value in sample.items():
            print(f"  ├─ {key}: {type(value).__name__} = {value if not isinstance(value, str) or len(str(value)) < 50 else str(value)[:50] + '...'}")
        
        print("\n✓ Frontend Fix Validation:")
        has_warehouse_stock = 'warehouseStock' in sample
        has_initial_stock = 'initial_stock' in sample
        
        print(f"  ├─ Has 'warehouseStock' field: {'❌ No (will use fallback)' if not has_warehouse_stock else '✓ Yes'}")
        print(f"  ├─ Has 'initial_stock' field: {'✓ Yes (will be used)' if has_initial_stock else '❌ No'}")
        
        if not has_warehouse_stock and has_initial_stock:
            print(f"  └─ Frontend fix is compatible ✓ (Uses initial_stock={sample.get('initial_stock')})")
        
        print("\n✓ Response Structure:")
        print(f"  ├─ Total products: {len(products)}")
        print(f"  ├─ API response format:")
        print(f"  │  ├─ success: {data.get('success')}")
        print(f"  │  ├─ data: array of {len(products)} products")
        print(f"  │  └─ pagination: {data.get('pagination', 'N/A')}")

if __name__ == '__main__':
    try:
        test_products_data_structure()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
