#!/usr/bin/env python3
"""
Create seed test users for live dashboard demonstration
"""
import sys
sys.path.insert(0, 'backend')

from app.models import db, User
import importlib.util

spec = importlib.util.spec_from_file_location("app_module", "backend/app.py")
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)
create_app = app_module.create_app

app = create_app()

def create_users():
    """Create test users with different roles"""
    with app.app_context():
        try:
            test_users = [
                {
                    'username': 'admin',
                    'email': 'admin@coreinventory.com',
                    'password': 'Admin@123',
                    'first_name': 'Admin',
                    'last_name': 'User',
                    'role': 'Administrator'
                },
                {
                    'username': 'manager1',
                    'email': 'manager1@coreinventory.com',
                    'password': 'Manager@123',
                    'first_name': 'John',
                    'last_name': 'Manager',
                    'role': 'Inventory Manager'
                },
                {
                    'username': 'manager2',
                    'email': 'manager2@coreinventory.com',
                    'password': 'Manager@123',
                    'first_name': 'Jane',
                    'last_name': 'Manager',
                    'role': 'Inventory Manager'
                },
                {
                    'username': 'staff1',
                    'email': 'staff1@coreinventory.com',
                    'password': 'Staff@123',
                    'first_name': 'Alice',
                    'last_name': 'Staff',
                    'role': 'Warehouse Staff'
                },
                {
                    'username': 'staff2',
                    'email': 'staff2@coreinventory.com',
                    'password': 'Staff@123',
                    'first_name': 'Bob',
                    'last_name': 'Staff',
                    'role': 'Warehouse Staff'
                },
            ]
            
            for user_data in test_users:
                # Check if user already exists
                existing = User.query.filter_by(username=user_data['username']).first()
                if existing:
                    print(f"✓ User '{user_data['username']}' already exists")
                    continue
                
                # Create new user
                user = User(
                    username=user_data['username'],
                    email=user_data['email'],
                    first_name=user_data['first_name'],
                    last_name=user_data['last_name'],
                    role=user_data['role'],
                    is_active=True
                )
                user.set_password(user_data['password'])
                db.session.add(user)
                print(f"✓ Created user: {user_data['username']} ({user_data['role']})")
            
            db.session.commit()
            
            # Print summary
            total_users = User.query.count()
            print(f"\n✅ Total users in database: {total_users}")
            print("\n📋 Test Credentials:")
            print("  Admin:        admin / Admin@123")
            print("  Manager:      manager1 / Manager@123")
            print("  Staff:        staff1 / Staff@123")
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating users: {e}")
            return False
    
    return True

if __name__ == '__main__':
    print("🌱 Creating seed test users...")
    if create_users():
        print("\n✨ Users created successfully! Ready for testing.")
    else:
        print("\n❌ Failed to create users")
        sys.exit(1)
