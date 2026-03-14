from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db
from datetime import datetime
import uuid

delivery_bp = Blueprint('deliveries', __name__, url_prefix='/api/v1/delivery')

# Models (to be imported from app.models)
from app.models import User, Delivery, DeliveryItem, Stock, StockMove, Product, Location, Warehouse

@delivery_bp.route('', methods=['GET'])
@jwt_required()
def list_deliveries():
    """List all deliveries with pagination and filters"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    warehouse_id = request.args.get('warehouse_id', type=int)
    
    query = Delivery.query
    
    if status:
        query = query.filter_by(status=status)
    if warehouse_id:
        query = query.filter_by(warehouse_id=warehouse_id)
    
    deliveries = query.order_by(Delivery.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'success': True,
        'data': [{
            'id': d.id,
            'delivery_number': d.delivery_number,
            'warehouse_id': d.warehouse_id,
            'status': d.status,
            'total_items': d.total_items,
            'total_value': float(d.total_value) if d.total_value else 0,
            'created_at': d.created_at.isoformat(),
            'updated_at': d.updated_at.isoformat()
        } for d in deliveries.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': deliveries.total,
            'pages': deliveries.pages
        }
    }), 200

@delivery_bp.route('', methods=['POST'])
@jwt_required()
def create_delivery():
    """Create a new delivery (Draft status)"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    try:
        # Validate required fields
        if not data.get('warehouse_id'):
            return jsonify({'success': False, 'message': 'warehouse_id is required'}), 400
        if not data.get('items') or len(data['items']) == 0:
            return jsonify({'success': False, 'message': 'At least one item is required'}), 400
        
        # Generate delivery number
        delivery_number = f"DEL-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        
        # Create delivery
        delivery = Delivery(
            delivery_number=delivery_number,
            warehouse_id=data['warehouse_id'],
            customer_id=data.get('customer_id'),
            status='Draft',
            notes=data.get('notes'),
            created_by=user_id,
            total_items=0,
            total_value=0
        )
        db.session.add(delivery)
        db.session.flush()
        
        # Add items
        total_items = 0
        total_value = 0
        for item_data in data['items']:
            product_id = item_data.get('product_id')
            location_id = item_data.get('location_id')
            quantity = item_data.get('quantity', 0)
            unit_price = item_data.get('unit_price', 0)
            
            if not product_id or not location_id or quantity <= 0:
                db.session.rollback()
                return jsonify({'success': False, 'message': 'Invalid item data'}), 400
            
            delivery_item = DeliveryItem(
                delivery_id=delivery.id,
                product_id=product_id,
                location_id=location_id,
                quantity=quantity,
                picked_quantity=0
            )
            db.session.add(delivery_item)
            total_items += quantity
            total_value += quantity * unit_price
        
        delivery.total_items = total_items
        delivery.total_value = total_value
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery created successfully',
            'data': {
                'id': delivery.id,
                'delivery_number': delivery.delivery_number,
                'status': delivery.status,
                'total_items': delivery.total_items,
                'total_value': float(delivery.total_value)
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@delivery_bp.route('/<int:delivery_id>', methods=['GET'])
@jwt_required()
def get_delivery(delivery_id):
    """Get delivery details with items"""
    delivery = Delivery.query.get(delivery_id)
    
    if not delivery:
        return jsonify({'success': False, 'message': 'Delivery not found'}), 404
    
    items = DeliveryItem.query.filter_by(delivery_id=delivery_id).all()
    
    return jsonify({
        'success': True,
        'data': {
            'id': delivery.id,
            'delivery_number': delivery.delivery_number,
            'warehouse_id': delivery.warehouse_id,
            'customer_id': delivery.customer_id,
            'status': delivery.status,
            'total_items': delivery.total_items,
            'total_value': float(delivery.total_value),
            'notes': delivery.notes,
            'created_at': delivery.created_at.isoformat(),
            'updated_at': delivery.updated_at.isoformat(),
            'items': [{
                'id': item.id,
                'product_id': item.product_id,
                'location_id': item.location_id,
                'quantity': item.quantity,
                'picked_quantity': item.picked_quantity
            } for item in items]
        }
    }), 200

@delivery_bp.route('/<int:delivery_id>', methods=['PUT'])
@jwt_required()
def update_delivery(delivery_id):
    """Update delivery (Draft only)"""
    delivery = Delivery.query.get(delivery_id)
    
    if not delivery:
        return jsonify({'success': False, 'message': 'Delivery not found'}), 404
    
    if delivery.status == 'Done':
        return jsonify({'success': False, 'message': 'Cannot update completed deliveries'}), 400
    
    data = request.get_json()
    
    try:
        if 'notes' in data:
            delivery.notes = data['notes']
        if 'customer_id' in data:
            delivery.customer_id = data['customer_id']
        
        if 'items' in data:
            DeliveryItem.query.filter_by(delivery_id=delivery_id).delete()
            
            total_items = 0
            total_value = 0
            for item_data in data['items']:
                product_id = item_data.get('product_id')
                location_id = item_data.get('location_id')
                quantity = item_data.get('quantity', 0)
                unit_price = item_data.get('unit_price', 0)
                
                if not product_id or not location_id or quantity <= 0:
                    db.session.rollback()
                    return jsonify({'success': False, 'message': 'Invalid item data'}), 400
                
                delivery_item = DeliveryItem(
                    delivery_id=delivery.id,
                    product_id=product_id,
                    location_id=location_id,
                    quantity=quantity,
                    picked_quantity=0
                )
                db.session.add(delivery_item)
                total_items += quantity
                total_value += quantity * unit_price
            
            delivery.total_items = total_items
            delivery.total_value = total_value
        
        delivery.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery updated successfully',
            'data': {
                'id': delivery.id,
                'delivery_number': delivery.delivery_number,
                'status': delivery.status
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@delivery_bp.route('/<int:delivery_id>/waiting', methods=['POST'])
@jwt_required()
def mark_delivery_waiting(delivery_id):
    """Mark delivery as Waiting"""
    delivery = Delivery.query.get(delivery_id)
    
    if not delivery:
        return jsonify({'success': False, 'message': 'Delivery not found'}), 404
    
    if delivery.status != 'Draft':
        return jsonify({'success': False, 'message': 'Can only mark Draft deliveries as Waiting'}), 400
    
    try:
        items = DeliveryItem.query.filter_by(delivery_id=delivery_id).all()
        
        if not items:
            return jsonify({'success': False, 'message': 'Delivery has no items'}), 400
        
        # Validate stock available
        for item in items:
            stock = Stock.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            available = 0
            if stock:
                available = stock.quantity - stock.reserved
            
            if available < item.quantity:
                return jsonify({
                    'success': False,
                    'message': f'Insufficient stock for product {item.product_id} in location {item.location_id}'
                }), 400
        
        delivery.status = 'Waiting'
        delivery.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery marked as Waiting',
            'data': {'status': delivery.status}
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@delivery_bp.route('/<int:delivery_id>/ready', methods=['POST'])
@jwt_required()
def mark_delivery_ready(delivery_id):
    """Mark delivery as Ready (reserve stock)"""
    delivery = Delivery.query.get(delivery_id)
    
    if not delivery:
        return jsonify({'success': False, 'message': 'Delivery not found'}), 404
    
    if delivery.status != 'Waiting':
        return jsonify({'success': False, 'message': 'Can only mark Waiting deliveries as Ready'}), 400
    
    try:
        items = DeliveryItem.query.filter_by(delivery_id=delivery_id).all()
        
        # Reserve stock
        for item in items:
            stock = Stock.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            if not stock:
                return jsonify({
                    'success': False,
                    'message': f'No stock record for product {item.product_id}'
                }), 400
            
            # Check available stock
            available = stock.quantity - stock.reserved
            if available < item.quantity:
                return jsonify({
                    'success': False,
                    'message': f'Insufficient stock. Available: {available}, Required: {item.quantity}'
                }), 400
            
            stock.reserved += item.quantity
        
        delivery.status = 'Ready'
        delivery.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery marked as Ready',
            'data': {'status': delivery.status}
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@delivery_bp.route('/<int:delivery_id>/done', methods=['POST'])
@jwt_required()
def mark_delivery_done(delivery_id):
    """Mark delivery as Done (decrement stock, create moves)"""
    user_id = get_jwt_identity()
    delivery = Delivery.query.get(delivery_id)
    
    if not delivery:
        return jsonify({'success': False, 'message': 'Delivery not found'}), 404
    
    if delivery.status != 'Ready':
        return jsonify({'success': False, 'message': 'Can only mark Ready deliveries as Done'}), 400
    
    try:
        items = DeliveryItem.query.filter_by(delivery_id=delivery_id).all()
        
        # Process each item
        for item in items:
            stock = Stock.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            if not stock:
                db.session.rollback()
                return jsonify({
                    'success': False,
                    'message': f'No stock record for product {item.product_id}'
                }), 400
            
            # Check stock available
            if stock.quantity < item.quantity:
                db.session.rollback()
                return jsonify({
                    'success': False,
                    'message': f'Insufficient stock. Available: {stock.quantity}, Required: {item.quantity}'
                }), 400
            
            # Decrement stock
            stock.quantity -= item.quantity
            stock.reserved = max(0, stock.reserved - item.quantity)
            
            # Create stock move
            move = StockMove(
                product_id=item.product_id,
                from_location_id=item.location_id,
                to_location_id=None,
                quantity=item.quantity,
                move_type='Delivery',
                reference_type='Delivery',
                reference_id=delivery.id,
                created_by=user_id
            )
            db.session.add(move)
        
        delivery.status = 'Done'
        delivery.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery marked as Done. Stock updated.',
            'data': {'status': delivery.status}
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@delivery_bp.route('/<int:delivery_id>', methods=['DELETE'])
@jwt_required()
def delete_delivery(delivery_id):
    """Delete delivery (Draft only)"""
    delivery = Delivery.query.get(delivery_id)
    
    if not delivery:
        return jsonify({'success': False, 'message': 'Delivery not found'}), 404
    
    if delivery.status != 'Draft':
        return jsonify({'success': False, 'message': 'Can only delete Draft deliveries'}), 400
    
    try:
        DeliveryItem.query.filter_by(delivery_id=delivery_id).delete()
        db.session.delete(delivery)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
