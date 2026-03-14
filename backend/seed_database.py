#!/usr/bin/env python3
"""
Seed test user into the database
"""
import sys
import os
sys.path.insert(0, '/Users/miteshrao/Desktop/Commit and Quit/backend')

from app.models import db, User, Category, Product, Warehouse, Location, Supplier
from app import db as flask_db

# Import from app.py instead
import importlib.util
spec = importlib.util.spec_from_file_location("app", "/Users/miteshrao/Desktop/Commit and Quit/backend/app.py")
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)
app = app_module.create_app()

app = create_app()

with app.app_context():
    try:
        # Check if testuser already exists
        existing_user = User.query.filter_by(username='testuser').first()
        if existing_user:
            print("✓ testuser already exists in database")
        else:
            # Create testuser
            user = User(
                username='testuser',
                email='test@example.com',
                first_name='Test',
                last_name='User',
                role='Inventory Manager',
                is_active=True
            )
            user.set_password('Test@123456')
            db.session.add(user)
            db.session.commit()
            print("✓ Created testuser with password Test@123456")
        
        # Create test category if it doesn't exist
        category = Category.query.filter_by(name='Furniture').first()
        if not category:
            category = Category(name='Furniture', description='Office furniture')
            db.session.add(category)
            db.session.commit()
            print("✓ Created Furniture category")
        
        # Create test warehouse if it doesn't exist
        warehouse = Warehouse.query.filter_by(name='Main Warehouse').first()
        if not warehouse:
            warehouse = Warehouse(
                name='Main Warehouse',
                location='Building A, Floor 1',
                capacity=1000
            )
            db.session.add(warehouse)
            db.session.commit()
            print("✓ Created Main Warehouse")
            warehouse_id = warehouse.id
        else:
            warehouse_id = warehouse.id
        
        # Create test location if it doesn't exist
        location = Location.query.filter_by(rack_code='A-01').first()
        if not location:
            location = Location(
                warehouse_id=warehouse_id,
                rack_code='A-01',
                location_type='Rack',
                capacity=100
            )
            db.session.add(location)
            db.session.commit()
            print("✓ Created Location A-01")
        
        # Create test products if they don't exist
        test_products = [
            {'name': 'Desk', 'sku': 'DESK001'},
            {'name': 'Chair', 'sku': 'CHAIR001'},
            {'name': 'Table', 'sku': 'TABLE001'}
        ]
        
        for prod in test_products:
            existing = Product.query.filter_by(sku=prod['sku']).first()
            if not existing:
                product = Product(
                    name=prod['name'],
                    sku=prod['sku'],
                    category_id=category.id,
                    unit_of_measure='pieces',
                    initial_stock=50,
                    is_active=True
                )
                db.session.add(product)
                db.session.commit()
                print(f"✓ Created product {prod['name']} ({prod['sku']})")
        
        # Create test supplier if it doesn't exist
        supplier = Supplier.query.filter_by(name='Ace Furniture').first()
        if not supplier:
            supplier = Supplier(
                name='Ace Furniture',
                contact_person='John Supplier',
                email='supplier@acefurniture.com',
                phone='+1-555-0001',
                address='123 Supply St',
                city='New York',
                country='USA'
            )
            db.session.add(supplier)
            db.session.commit()
            print("✓ Created Ace Furniture supplier")
        
        print("\n✅ Database seeding complete!")
        print("\nTest credentials:")
        print("  Username: testuser")
        print("  Password: Test@123456")
        print("  Role: Inventory Manager")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
