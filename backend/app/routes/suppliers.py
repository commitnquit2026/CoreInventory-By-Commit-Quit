from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import db, Supplier
from app.utils import RoleRequired

supplier_bp = Blueprint('suppliers', __name__, url_prefix='/api/v1/suppliers')

@supplier_bp.route('', methods=['GET'])
@jwt_required()
def get_suppliers():
    """Get all suppliers"""
    try:
        is_active = request.args.get('is_active', type=lambda x: x.lower() == 'true')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Supplier.query
        
        if is_active is not None:
            query = query.filter_by(is_active=is_active)
        
        paginated = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [supplier.to_dict() for supplier in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@supplier_bp.route('', methods=['POST'])
@RoleRequired('Inventory Manager')
def create_supplier():
    """Create new supplier"""
    try:
        data = request.get_json(force=True)
        
        if not data.get('name'):
            return jsonify({'success': False, 'message': 'Supplier name is required'}), 400
        
        if Supplier.query.filter_by(name=data['name']).first():
            return jsonify({'success': False, 'message': 'Supplier already exists'}), 409
        
        supplier = Supplier(
            name=data['name'],
            contact_person=data.get('contact_person'),
            email=data.get('email'),
            phone=data.get('phone'),
            address=data.get('address'),
            city=data.get('city'),
            country=data.get('country')
        )
        
        db.session.add(supplier)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Supplier created successfully',
            'data': supplier.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@supplier_bp.route('/<int:supplier_id>', methods=['GET'])
@jwt_required()
def get_supplier(supplier_id):
    """Get supplier by ID"""
    try:
        supplier = Supplier.query.get(supplier_id)
        
        if not supplier:
            return jsonify({'success': False, 'message': 'Supplier not found'}), 404
        
        return jsonify({
            'success': True,
            'data': supplier.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@supplier_bp.route('/<int:supplier_id>', methods=['PUT'])
@RoleRequired('Inventory Manager')
def update_supplier(supplier_id):
    """Update supplier"""
    try:
        supplier = Supplier.query.get(supplier_id)
        
        if not supplier:
            return jsonify({'success': False, 'message': 'Supplier not found'}), 404
        
        data = request.get_json(force=True)
        
        if 'name' in data:
            supplier.name = data['name']
        if 'contact_person' in data:
            supplier.contact_person = data['contact_person']
        if 'email' in data:
            supplier.email = data['email']
        if 'phone' in data:
            supplier.phone = data['phone']
        if 'address' in data:
            supplier.address = data['address']
        if 'city' in data:
            supplier.city = data['city']
        if 'country' in data:
            supplier.country = data['country']
        if 'is_active' in data:
            supplier.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Supplier updated successfully',
            'data': supplier.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
