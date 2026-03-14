#!/usr/bin/env python3
"""Check warehouse locations API response"""
import requests
import json

BASE_URL = 'http://localhost:5000'

# Login
login = requests.post(f'{BASE_URL}/api/v1/auth/login', 
    json={'username': 'manager1', 'password': 'Manager@123'})
token = login.json().get('token')
headers = {'Authorization': f'Bearer {token}'}

# Get warehouse locations
response = requests.get(f'{BASE_URL}/api/v1/warehouses/1/locations', headers=headers)
print("Warehouse Locations API Response:")
print(json.dumps(response.json(), indent=2))
