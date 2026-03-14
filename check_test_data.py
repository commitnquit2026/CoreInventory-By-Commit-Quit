#!/usr/bin/env python3
import sys
sys.path.insert(0, 'backend')

from app.models import db, Product, Location, Warehouse
import importlib.util

spec = importlib.util.spec_from_file_location("app_module", "backend/app.py")
app_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_module)
create_app = app_module.create_app

app = create_app()

with app.app_context():
    # Check how many products and locations exist
    product_count = Product.query.count()
    location_count = Location.query.count()
    warehouse_count = Warehouse.query.count()
    
    print(f"Warehouses: {warehouse_count}")
    print(f"Locations: {location_count}")
    print(f"Products: {product_count}")
    
    if location_count > 0:
        locs = Location.query.limit(2).all()
        for loc in locs:
            print(f"  Location {loc.id}: warehouse {loc.warehouse_id}, rack {loc.rack_code}")
    
    if product_count > 0:
        prods = Product.query.limit(2).all()
        for prod in prods:
            print(f"  Product {prod.id}: {prod.name}")
