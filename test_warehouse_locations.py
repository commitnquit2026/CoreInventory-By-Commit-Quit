#!/usr/bin/env python3
"""Test warehouse locations endpoint"""
import requests
import json

BASE_URL = 'http://localhost:5000'

# Login
login = requests.post(f'{BASE_URL}/api/v1/auth/login', 
    json={'username': 'manager1', 'password': 'Manager@123'})
token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}

print("=" * 80)
print("WAREHOUSE LOCATIONS TEST")
print("=" * 80)

# Get warehouses first
print("\n1. Getting all warehouses:")
wh_response = requests.get(f'{BASE_URL}/api/v1/warehouses', headers=headers)
warehouses = wh_response.json().get('data', [])
print(f"   Found {len(warehouses)} warehouses")

for w in warehouses[:2]:  # Test first 2 warehouses
    print(f"\n2. Getting locations for {w['name']} (ID: {w['id']}):")
    loc_response = requests.get(f'{BASE_URL}/api/v1/warehouses/{w["id"]}/locations', headers=headers)
    print(f"   Status: {loc_response.status_code}")
    
    loc_data = loc_response.json()
    locations = loc_data.get('locations', [])
    print(f"   Found {len(locations)} locations")
    
    if locations:
        print(f"   First location: {locations[0].get('rack_code')} (id: {locations[0].get('id')})")
    else:
        print(f"   ❌ NO LOCATIONS FOUND!")
        print(f"   Response: {json.dumps(loc_data, indent=2)}")
