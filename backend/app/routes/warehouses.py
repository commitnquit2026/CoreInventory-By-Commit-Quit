from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import db, Warehouse, Location, Inventory
from app.utils import RoleRequired

warehouse_bp = Blueprint('warehouses', __name__, url_prefix='/api/v1/warehouses')

@warehouse_bp.route('', methods=['GET'])
@jwt_required()
def get_warehouses():
    """Get all warehouses"""
    try:
        warehouses = Warehouse.query.filter_by(is_active=True).all()
        
        return jsonify({
            'success': True,
            'data': [wh.to_dict() for wh in warehouses]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('', methods=['POST'])
@RoleRequired('Inventory Manager')
def create_warehouse():
    """Create new warehouse"""
    try:
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'success': False, 'message': 'Warehouse name is required'}), 400
        
        # Check if warehouse exists
        if Warehouse.query.filter_by(name=data['name']).first():
            return jsonify({'success': False, 'message': 'Warehouse already exists'}), 409
        
        warehouse = Warehouse(
            name=data['name'],
            location=data.get('location'),
            capacity=data.get('capacity')
        )
        
        db.session.add(warehouse)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Warehouse created successfully',
            'data': warehouse.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('/<int:warehouse_id>', methods=['GET'])
@jwt_required()
def get_warehouse(warehouse_id):
    """Get warehouse by ID"""
    try:
        warehouse = Warehouse.query.get(warehouse_id)
        
        if not warehouse:
            return jsonify({'success': False, 'message': 'Warehouse not found'}), 404
        
        locations = Location.query.filter_by(warehouse_id=warehouse_id, is_active=True).all()
        
        return jsonify({
            'success': True,
            'data': warehouse.to_dict(),
            'locations': [loc.to_dict() for loc in locations]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('/<int:warehouse_id>', methods=['PUT'])
@RoleRequired('Inventory Manager')
def update_warehouse(warehouse_id):
    """Update warehouse"""
    try:
        warehouse = Warehouse.query.get(warehouse_id)
        
        if not warehouse:
            return jsonify({'success': False, 'message': 'Warehouse not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            warehouse.name = data['name']
        if 'location' in data:
            warehouse.location = data['location']
        if 'capacity' in data:
            warehouse.capacity = data['capacity']
        if 'is_active' in data:
            warehouse.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Warehouse updated successfully',
            'data': warehouse.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('/<int:warehouse_id>/locations', methods=['GET'])
@jwt_required()
def get_warehouse_locations(warehouse_id):
    """Get all locations in a warehouse"""
    try:
        warehouse = Warehouse.query.get(warehouse_id)
        
        if not warehouse:
            return jsonify({'success': False, 'message': 'Warehouse not found'}), 404
        
        locations = Location.query.filter_by(warehouse_id=warehouse_id).all()
        
        return jsonify({
            'success': True,
            'warehouse': warehouse.to_dict(),
            'locations': [loc.to_dict() for loc in locations]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('/<int:warehouse_id>/locations', methods=['POST'])
@RoleRequired('Inventory Manager')
def create_location(warehouse_id):
    """Create new location in warehouse"""
    try:
        warehouse = Warehouse.query.get(warehouse_id)
        
        if not warehouse:
            return jsonify({'success': False, 'message': 'Warehouse not found'}), 404
        
        data = request.get_json()
        
        if not data.get('rack_code'):
            return jsonify({'success': False, 'message': 'Rack code is required'}), 400
        
        # Check if location exists
        existing = Location.query.filter_by(
            warehouse_id=warehouse_id,
            rack_code=data['rack_code']
        ).first()
        
        if existing:
            return jsonify({
                'success': False,
                'message': 'Location already exists in this warehouse'
            }), 409
        
        location = Location(
            warehouse_id=warehouse_id,
            rack_code=data['rack_code'],
            location_type=data.get('location_type', 'Rack'),
            capacity=data.get('capacity')
        )
        
        db.session.add(location)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Location created successfully',
            'data': location.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('/locations/<int:location_id>', methods=['GET'])
@jwt_required()
def get_location(location_id):
    """Get location details"""
    try:
        location = Location.query.get(location_id)
        
        if not location:
            return jsonify({'success': False, 'message': 'Location not found'}), 404
        
        inventory = Inventory.query.filter_by(location_id=location_id).all()
        
        return jsonify({
            'success': True,
            'location': location.to_dict(),
            'inventory': [inv.to_dict() for inv in inventory]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@warehouse_bp.route('/locations/<int:location_id>', methods=['PUT'])
@RoleRequired('Inventory Manager')
def update_location(location_id):
    """Update location"""
    try:
        location = Location.query.get(location_id)
        
        if not location:
            return jsonify({'success': False, 'message': 'Location not found'}), 404
        
        data = request.get_json()
        
        if 'location_type' in data:
            location.location_type = data['location_type']
        if 'capacity' in data:
            location.capacity = data['capacity']
        if 'is_active' in data:
            location.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Location updated successfully',
            'data': location.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
