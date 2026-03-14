from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db
from sqlalchemy import func
from datetime import datetime
import uuid

receipt_bp = Blueprint('receipts', __name__, url_prefix='/api/v1/receipt')

# Models (to be imported from app.models)
from app.models import User, Receipt, ReceiptItem, Stock, StockMove, Product, Location, Warehouse

@receipt_bp.route('', methods=['GET'])
@jwt_required()
def list_receipts():
    """List all receipts with pagination and filters"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    status = request.args.get('status')
    warehouse_id = request.args.get('warehouse_id', type=int)
    
    query = Receipt.query
    
    if status:
        query = query.filter_by(status=status)
    if warehouse_id:
        query = query.filter_by(warehouse_id=warehouse_id)
    
    receipts = query.order_by(Receipt.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'success': True,
        'data': [{
            'id': r.id,
            'receipt_number': r.receipt_number,
            'warehouse_id': r.warehouse_id,
            'status': r.status,
            'total_items': r.total_items,
            'total_value': float(r.total_value) if r.total_value else 0,
            'created_at': r.created_at.isoformat(),
            'updated_at': r.updated_at.isoformat()
        } for r in receipts.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': receipts.total,
            'pages': receipts.pages
        }
    }), 200

@receipt_bp.route('', methods=['POST'])
@jwt_required()
def create_receipt():
    """Create a new receipt (Draft status)"""
    user_id = get_jwt_identity()
    data = request.get_json(force=True)
    
    try:
        # Validate required fields
        if not data.get('warehouse_id'):
            return jsonify({'success': False, 'message': 'warehouse_id is required'}), 400
        
        # Generate receipt number
        receipt_number = f"REC-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
        
        # Create receipt (items are optional, can be added later)
        receipt = Receipt(
            receipt_number=receipt_number,
            warehouse_id=data['warehouse_id'],
            supplier_id=data.get('supplier_id'),
            status='Draft',
            notes=data.get('notes'),
            created_by=user_id,
            total_items=0,
            total_value=0
        )
        db.session.add(receipt)
        db.session.flush()  # Get the receipt ID
        
        # Add items if provided
        total_items = 0
        total_value = 0
        if data.get('items') and len(data['items']) > 0:
            for item_data in data['items']:
                product_id = item_data.get('product_id')
                location_id = item_data.get('location_id')
                quantity = item_data.get('quantity', 0)
                unit_price = item_data.get('unit_price', 0)
                
                if not product_id or not location_id or quantity <= 0:
                    db.session.rollback()
                    return jsonify({'success': False, 'message': 'Invalid item data'}), 400
                
                receipt_item = ReceiptItem(
                    receipt_id=receipt.id,
                    product_id=product_id,
                    location_id=location_id,
                    quantity=quantity,
                    unit_price=unit_price,
                    received_quantity=0
                )
                db.session.add(receipt_item)
                total_items += quantity
                total_value += quantity * unit_price
        
        receipt.total_items = total_items
        receipt.total_value = total_value
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt created successfully',
            'data': {
                'id': receipt.id,
                'receipt_number': receipt.receipt_number,
                'status': receipt.status,
                'total_items': receipt.total_items,
                'total_value': float(receipt.total_value)
            }
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@receipt_bp.route('/<int:receipt_id>', methods=['GET'])
@jwt_required()
def get_receipt(receipt_id):
    """Get receipt details with items"""
    receipt = Receipt.query.get(receipt_id)
    
    if not receipt:
        return jsonify({'success': False, 'message': 'Receipt not found'}), 404
    
    items = ReceiptItem.query.filter_by(receipt_id=receipt_id).all()
    
    return jsonify({
        'success': True,
        'data': {
            'id': receipt.id,
            'receipt_number': receipt.receipt_number,
            'warehouse_id': receipt.warehouse_id,
            'supplier_id': receipt.supplier_id,
            'status': receipt.status,
            'total_items': receipt.total_items,
            'total_value': float(receipt.total_value),
            'notes': receipt.notes,
            'created_at': receipt.created_at.isoformat(),
            'updated_at': receipt.updated_at.isoformat(),
            'items': [{
                'id': item.id,
                'product_id': item.product_id,
                'location_id': item.location_id,
                'quantity': item.quantity,
                'unit_price': float(item.unit_price) if item.unit_price else 0,
                'received_quantity': item.received_quantity
            } for item in items]
        }
    }), 200

@receipt_bp.route('/<int:receipt_id>', methods=['PUT'])
@jwt_required()
def update_receipt(receipt_id):
    """Update receipt (Draft only)"""
    receipt = Receipt.query.get(receipt_id)
    
    if not receipt:
        return jsonify({'success': False, 'message': 'Receipt not found'}), 404
    
    if receipt.status != 'Draft':
        return jsonify({'success': False, 'message': 'Can only update Draft receipts'}), 400
    
    data = request.get_json(force=True)
    
    try:
        # Update basic fields
        if 'notes' in data:
            receipt.notes = data['notes']
        if 'supplier_id' in data:
            receipt.supplier_id = data['supplier_id']
        
        # Update items if provided
        if 'items' in data:
            ReceiptItem.query.filter_by(receipt_id=receipt_id).delete()
            
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
                
                receipt_item = ReceiptItem(
                    receipt_id=receipt.id,
                    product_id=product_id,
                    location_id=location_id,
                    quantity=quantity,
                    unit_price=unit_price,
                    received_quantity=0
                )
                db.session.add(receipt_item)
                total_items += quantity
                total_value += quantity * unit_price
            
            receipt.total_items = total_items
            receipt.total_value = total_value
        
        receipt.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt updated successfully',
            'data': {
                'id': receipt.id,
                'receipt_number': receipt.receipt_number,
                'status': receipt.status
            }
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@receipt_bp.route('/<int:receipt_id>/ready', methods=['POST'])
@jwt_required()
def mark_receipt_ready(receipt_id):
    """Mark receipt as Ready (reserve stock)"""
    receipt = Receipt.query.get(receipt_id)
    
    if not receipt:
        return jsonify({'success': False, 'message': 'Receipt not found'}), 404
    
    if receipt.status != 'Draft':
        return jsonify({'success': False, 'message': 'Can only mark Draft receipts as Ready'}), 400
    
    try:
        items = ReceiptItem.query.filter_by(receipt_id=receipt_id).all()
        
        # Validate all items present
        if not items:
            return jsonify({'success': False, 'message': 'Receipt has no items'}), 400
        
        # Reserve stock
        for item in items:
            stock = Stock.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            if not stock:
                stock = Stock(
                    product_id=item.product_id,
                    location_id=item.location_id,
                    quantity=0,
                    reserved=0
                )
                db.session.add(stock)
                db.session.flush()
            
            stock.reserved += item.quantity
        
        receipt.status = 'Ready'
        receipt.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt marked as Ready',
            'data': {'status': receipt.status}
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@receipt_bp.route('/<int:receipt_id>/done', methods=['POST'])
@jwt_required()
def mark_receipt_done(receipt_id):
    """Mark receipt as Done (increment stock, create moves)"""
    user_id = get_jwt_identity()
    receipt = Receipt.query.get(receipt_id)
    
    if not receipt:
        return jsonify({'success': False, 'message': 'Receipt not found'}), 404
    
    if receipt.status != 'Ready':
        return jsonify({'success': False, 'message': 'Can only mark Ready receipts as Done'}), 400
    
    try:
        items = ReceiptItem.query.filter_by(receipt_id=receipt_id).all()
        
        # Process each item
        for item in items:
            stock = Stock.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            if not stock:
                stock = Stock(
                    product_id=item.product_id,
                    location_id=item.location_id,
                    quantity=0,
                    reserved=0
                )
                db.session.add(stock)
                db.session.flush()
            
            # Increment stock
            stock.quantity += item.quantity
            
            # Unreserve
            stock.reserved = max(0, stock.reserved - item.quantity)
            
            # Create stock move
            move = StockMove(
                product_id=item.product_id,
                from_location_id=None,
                to_location_id=item.location_id,
                quantity=item.quantity,
                move_type='Receipt',
                reference_type='Receipt',
                reference_id=receipt.id,
                created_by=user_id
            )
            db.session.add(move)
        
        receipt.status = 'Done'
        receipt.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt marked as Done. Stock updated.',
            'data': {'status': receipt.status}
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@receipt_bp.route('/<int:receipt_id>', methods=['DELETE'])
@jwt_required()
def delete_receipt(receipt_id):
    """Delete receipt (Draft only)"""
    receipt = Receipt.query.get(receipt_id)
    
    if not receipt:
        return jsonify({'success': False, 'message': 'Receipt not found'}), 404
    
    if receipt.status != 'Draft':
        return jsonify({'success': False, 'message': 'Can only delete Draft receipts'}), 400
    
    try:
        ReceiptItem.query.filter_by(receipt_id=receipt_id).delete()
        db.session.delete(receipt)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt deleted successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
