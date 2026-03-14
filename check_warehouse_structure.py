#!/usr/bin/env python3
"""Check warehouse API response structure"""
import requests
import json

BASE_URL = 'http://localhost:5000'

# Login
login = requests.post(f'{BASE_URL}/api/v1/auth/login', 
    json={'username': 'manager1', 'password': 'Manager@123'})
token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}

# Get warehouses
response = requests.get(f'{BASE_URL}/api/v1/warehouses', headers=headers)
print("Warehouse API Response:")
print(json.dumps(response.json(), indent=2))
