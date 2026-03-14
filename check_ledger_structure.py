#!/usr/bin/env python3
"""Check ledger API response structure"""
import requests
import json

BASE_URL = 'http://localhost:5000'

# Login
login = requests.post(f'{BASE_URL}/api/v1/auth/login', 
    json={'username': 'manager1', 'password': 'Manager@123'})
token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}

# Get ledger
response = requests.get(f'{BASE_URL}/api/v1/inventory/ledger', headers=headers)
print("Ledger API Response:")
data = response.json()
print(json.dumps(data, indent=2)[:2000])
if data.get('data') and len(data['data']) > 0:
    print("\nFirst entry:")
    print(json.dumps(data['data'][0], indent=2))
