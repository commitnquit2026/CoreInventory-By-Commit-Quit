#!/usr/bin/env python3
"""
Database seeding script to create test users and data
"""

import os
import sys
from pathlib import Path

# Get the backend directory
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Now import Flask and models
from flask import Flask
from config import DevelopmentConfig
from app.models import db, User, Category, Product, Warehouse, Location

# Create Flask app with SQLAlchemy
app = Flask(__name__)
app.config.from_object(DevelopmentConfig)
db.init_app(app)

def seed_database():
    """Seed the database with initial test data"""
    
    with app.app_context():
        # Create all tables first
        db.create_all()
        
        # Check if data already exists
        if User.query.first() is not None:
            print("⚠️  Database already contains users. Skipping seed.")
            return
        
        print("🌱 Seeding database with test data...")
        
        # Create test users
        test_users = [
            {
                'username': 'admin',
                'email': 'admin@coreinventory.com',
                'password': 'Admin@123456',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'Administrator'
            },
            {
                'username': 'manager',
                'email': 'manager@coreinventory.com',
                'password': 'Manager@123456',
                'first_name': 'Warehouse',
                'last_name': 'Manager',
                'role': 'Warehouse Manager'
            },
            {
                'username': 'staff',
                'email': 'staff@coreinventory.com',
                'password': 'Staff@123456',
                'first_name': 'Warehouse',
                'last_name': 'Staff',
                'role': 'Warehouse Staff'
            }
        ]
        
        created_users = []
        for user_data in test_users:
            user = User(
                username=user_data['username'],
                email=user_data['email'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role=user_data['role']
            )
            user.set_password(user_data['password'])
            db.session.add(user)
            created_users.append(user)
        
        db.session.commit()
        print(f"✅ Created {len(created_users)} test users")
        
        # Create test categories
        categories_data = [
            {'name': 'Electronics', 'description': 'Electronic components and devices'},
            {'name': 'Furniture', 'description': 'Office and warehouse furniture'},
            {'name': 'Tools', 'description': 'Warehouse tools and equipment'},
            {'name': 'Supplies', 'description': 'General office and warehouse supplies'}
        ]
        
        categories = []
        for cat_data in categories_data:
            category = Category(
                name=cat_data['name'],
                description=cat_data['description']
            )
            db.session.add(category)
            categories.append(category)
        
        db.session.commit()
        print(f"✅ Created {len(categories)} product categories")
        
        # Create test products
        products_data = [
            {'sku': 'ELECT-001', 'name': 'Computer Monitor', 'category_id': 1, 'uom': 'Units'},
            {'sku': 'ELECT-002', 'name': 'Keyboard', 'category_id': 1, 'uom': 'Units'},
            {'sku': 'FURN-001', 'name': 'Office Chair', 'category_id': 2, 'uom': 'Units'},
            {'sku': 'FURN-002', 'name': 'Desk', 'category_id': 2, 'uom': 'Units'},
            {'sku': 'TOOL-001', 'name': 'Forklift', 'category_id': 3, 'uom': 'Units'},
            {'sku': 'SUPP-001', 'name': 'Paper Reams', 'category_id': 4, 'uom': 'Boxes'},
        ]
        
        products = []
        for prod_data in products_data:
            product = Product(
                sku=prod_data['sku'],
                name=prod_data['name'],
                category_id=prod_data['category_id'],
                unit_of_measure=prod_data['uom'],
                initial_stock=100
            )
            db.session.add(product)
            products.append(product)
        
        db.session.commit()
        print(f"✅ Created {len(products)} test products")
        
        # Create test warehouses
        warehouses_data = [
            {'name': 'Main Warehouse', 'location': 'New York, NY', 'capacity': 10000},
            {'name': 'Secondary Warehouse', 'location': 'Los Angeles, CA', 'capacity': 5000},
            {'name': 'Regional Hub', 'location': 'Chicago, IL', 'capacity': 3000}
        ]
        
        warehouses = []
        for wh_data in warehouses_data:
            warehouse = Warehouse(
                name=wh_data['name'],
                location=wh_data['location'],
                capacity=wh_data['capacity'],
                manager_id=created_users[0].id
            )
            db.session.add(warehouse)
            warehouses.append(warehouse)
        
        db.session.commit()
        print(f"✅ Created {len(warehouses)} test warehouses")
        
        # Create test locations for each warehouse
        for warehouse in warehouses:
            for i in range(1, 6):
                location = Location(
                    warehouse_id=warehouse.id,
                    rack_code=f'RACK-{warehouse.id}-{i}',
                    location_type='Rack',
                    capacity=500
                )
                db.session.add(location)
        
        db.session.commit()
        print(f"✅ Created locations for all warehouses")
        
        print("\n✨ Database seeded successfully!")
        print("\n📝 Test Credentials:")
        print("=" * 50)
        for user_data in test_users:
            print(f"Username: {user_data['username']}")
            print(f"Password: {user_data['password']}")
            print(f"Role: {user_data['role']}")
            print("-" * 50)

if __name__ == '__main__':
    seed_database()
