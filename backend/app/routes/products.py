from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Product, Category, Inventory, Location, Warehouse
from app.utils import ValidationUtils, RoleRequired

product_bp = Blueprint('products', __name__, url_prefix='/api/v1/products')

@product_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all categories"""
    try:
        categories = Category.query.all()
        return jsonify({
            'success': True,
            'data': [cat.to_dict() for cat in categories]
        }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('/categories', methods=['POST'])
@RoleRequired('Inventory Manager')
def create_category():
    """Create new category"""
    try:
        data = request.get_json(force=True)
        
        if not data.get('name'):
            return jsonify({'success': False, 'message': 'Category name is required'}), 400
        
        # Check if category exists
        if Category.query.filter_by(name=data['name']).first():
            return jsonify({'success': False, 'message': 'Category already exists'}), 409
        
        category = Category(
            name=data['name'],
            description=data.get('description')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Category created successfully',
            'data': category.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('', methods=['GET'])
@jwt_required()
def get_products():
    """Get all products with optional filtering"""
    try:
        # Pagination
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Filters
        category_id = request.args.get('category_id', type=int)
        is_active = request.args.get('is_active', type=lambda x: x.lower() == 'true')
        
        query = Product.query
        
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if is_active is not None:
            query = query.filter_by(is_active=is_active)
        
        paginated = query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [prod.to_dict() for prod in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('', methods=['POST'])
@RoleRequired('Inventory Manager')
def create_product():
    """Create new product"""
    try:
        data = request.get_json(force=True)
        
        # Validate required fields
        required_fields = ['sku', 'name', 'category_id', 'unit_of_measure']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate SKU format
        if not ValidationUtils.validate_sku(data['sku']):
            return jsonify({
                'success': False,
                'message': 'SKU must be 3-50 characters, uppercase alphanumeric with hyphens'
            }), 400
        
        # Check if SKU exists
        if Product.query.filter_by(sku=data['sku']).first():
            return jsonify({'success': False, 'message': 'SKU already exists'}), 409
        
        # Check if category exists
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'success': False, 'message': 'Category not found'}), 404
        
        product = Product(
            sku=data['sku'],
            name=data['name'],
            category_id=data['category_id'],
            unit_of_measure=data['unit_of_measure'],
            description=data.get('description'),
            initial_stock=data.get('initial_stock', 0)
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product created successfully',
            'data': product.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    """Get product by ID"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        # Get inventory across all locations
        inventory = Inventory.query.filter_by(product_id=product_id).all()
        
        return jsonify({
            'success': True,
            'data': product.to_dict(),
            'inventory': [inv.to_dict() for inv in inventory]
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('/<int:product_id>', methods=['PUT'])
@RoleRequired('Inventory Manager')
def update_product(product_id):
    """Update product"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        data = request.get_json(force=True)
        
        # Update fields
        if 'name' in data:
            product.name = data['name']
        if 'category_id' in data:
            category = Category.query.get(data['category_id'])
            if not category:
                return jsonify({'success': False, 'message': 'Category not found'}), 404
            product.category_id = data['category_id']
        if 'unit_of_measure' in data:
            product.unit_of_measure = data['unit_of_measure']
        if 'description' in data:
            product.description = data['description']
        if 'is_active' in data:
            product.is_active = data['is_active']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'data': product.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('/inventory/summary', methods=['GET'])
@jwt_required()
def get_inventory_summary():
    """Get inventory summary for all products across all locations"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        inventory = Inventory.query.paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [inv.to_dict() for inv in inventory.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': inventory.total,
                'pages': inventory.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@product_bp.route('/inventory/location/<int:location_id>', methods=['GET'])
@jwt_required()
def get_inventory_by_location(location_id):
    """Get inventory at a specific location"""
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

@product_bp.route('/inventory/product/<int:product_id>', methods=['GET'])
@jwt_required()
def get_inventory_by_product(product_id):
    """Get inventory of a product across all locations"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        inventory = Inventory.query.filter_by(product_id=product_id).all()
        
        total_quantity = sum(inv.quantity for inv in inventory)
        total_reserved = sum(inv.reserved_quantity for inv in inventory)
        
        return jsonify({
            'success': True,
            'product': product.to_dict(),
            'inventory': [inv.to_dict() for inv in inventory],
            'totals': {
                'total_quantity': total_quantity,
                'total_reserved': total_reserved,
                'total_available': total_quantity - total_reserved
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500
