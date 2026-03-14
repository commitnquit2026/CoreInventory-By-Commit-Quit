from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import (
    db, Receipt, ReceiptItem, Delivery, DeliveryItem, Transfer, TransferItem,
    Adjustment, StockLedger, Inventory, Product, Location, Supplier, Category, Warehouse
)
from app.utils import SequenceGenerator, ValidationUtils, RoleRequired
from datetime import datetime

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/v1/inventory')

# ==================== RECEIPTS ====================

@inventory_bp.route('/receipts', methods=['GET'])
@jwt_required()
def get_receipts():
    """Get all receipts with filtering"""
    try:
        status = request.args.get('status')
        supplier_id = request.args.get('supplier_id', type=int)
        warehouse_id = request.args.get('warehouse_id', type=int)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Receipt.query
        
        if status:
            query = query.filter_by(status=status)
        if supplier_id:
            query = query.filter_by(supplier_id=supplier_id)
        if warehouse_id:
            query = query.filter_by(warehouse_id=warehouse_id)
        
        paginated = query.order_by(Receipt.created_at.desc()).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [receipt.to_dict() for receipt in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/receipts', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def create_receipt():
    """Create new receipt"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        data = request.get_json(force=True)
        
        if not data.get('supplier_id') or not data.get('warehouse_id'):
            return jsonify({
                'success': False,
                'message': 'supplier_id and warehouse_id are required'
            }), 400
        
        supplier = Supplier.query.get(data['supplier_id'])
        if not supplier:
            return jsonify({'success': False, 'message': 'Supplier not found'}), 404
        
        receipt = Receipt(
            receipt_number=SequenceGenerator.generate_receipt_number(data['warehouse_id']),
            supplier_id=data['supplier_id'],
            warehouse_id=data['warehouse_id'],
            notes=data.get('notes'),
            created_by=user_id
        )
        
        db.session.add(receipt)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt created successfully',
            'data': receipt.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/receipts/<int:receipt_id>', methods=['GET'])
@jwt_required()
def get_receipt(receipt_id):
    """Get receipt details"""
    try:
        receipt = Receipt.query.get(receipt_id)
        
        if not receipt:
            return jsonify({'success': False, 'message': 'Receipt not found'}), 404
        
        return jsonify({
            'success': True,
            'data': receipt.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/receipts/<int:receipt_id>/items', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def add_receipt_item(receipt_id):
    """Add item to receipt"""
    try:
        receipt = Receipt.query.get(receipt_id)
        
        if not receipt:
            return jsonify({'success': False, 'message': 'Receipt not found'}), 404
        
        if receipt.status != 'Draft':
            return jsonify({
                'success': False,
                'message': f'Cannot add items to a {receipt.status} receipt'
            }), 400
        
        data = request.get_json(force=True)
        
        required = ['product_id', 'quantity_expected', 'location_id']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        location = Location.query.get(data['location_id'])
        if not location:
            return jsonify({'success': False, 'message': 'Location not found'}), 404
        
        item = ReceiptItem(
            receipt_id=receipt_id,
            product_id=data['product_id'],
            quantity_expected=data['quantity_expected'],
            location_id=data['location_id'],
            unit_price=data.get('unit_price'),
            notes=data.get('notes')
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Item added to receipt',
            'data': item.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/receipts/<int:receipt_id>/validate', methods=['POST'])
@RoleRequired('Inventory Manager')
def validate_receipt(receipt_id):
    """Validate and finalize receipt"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        receipt = Receipt.query.get(receipt_id)
        
        if not receipt:
            return jsonify({'success': False, 'message': 'Receipt not found'}), 404
        
        if receipt.status != 'Draft':
            return jsonify({
                'success': False,
                'message': f'Receipt is already {receipt.status}'
            }), 400
        
        data = request.get_json(force=True) or {}
        
        # Update quantities received
        for item in receipt.items:
            qty_received = data.get(f'item_{item.id}_received', item.quantity_expected)
            item.quantity_received = qty_received
            
            # Update inventory
            inventory = Inventory.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            if not inventory:
                inventory = Inventory(
                    product_id=item.product_id,
                    location_id=item.location_id,
                    quantity=0,
                    reserved_quantity=0
                )
                db.session.add(inventory)
            
            old_qty = inventory.quantity
            inventory.quantity += qty_received
            
            # Log to stock ledger
            ledger = StockLedger(
                operation_type='Receipt',
                reference_id=receipt_id,
                reference_number=receipt.receipt_number,
                product_id=item.product_id,
                destination_location_id=item.location_id,
                quantity_change=qty_received,
                old_quantity=old_qty,
                new_quantity=inventory.quantity,
                created_by=user_id,
                notes=f'Receipt from {receipt.supplier.name}'
            )
            db.session.add(ledger)
        
        receipt.status = 'Validated'
        receipt.received_date = datetime.utcnow()
        receipt.validated_by = user_id
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Receipt validated successfully',
            'data': receipt.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DELIVERIES ====================

@inventory_bp.route('/deliveries', methods=['GET'])
@jwt_required()
def get_deliveries():
    """Get all deliveries"""
    try:
        status = request.args.get('status')
        warehouse_id = request.args.get('warehouse_id', type=int)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Delivery.query
        
        if status:
            query = query.filter_by(status=status)
        if warehouse_id:
            query = query.filter_by(warehouse_id=warehouse_id)
        
        paginated = query.order_by(Delivery.created_at.desc()).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [delivery.to_dict() for delivery in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/deliveries', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def create_delivery():
    """Create new delivery order"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        data = request.get_json(force=True)
        
        if not data.get('warehouse_id'):
            return jsonify({'success': False, 'message': 'warehouse_id is required'}), 400
        
        delivery = Delivery(
            delivery_number=SequenceGenerator.generate_delivery_number(data['warehouse_id']),
            warehouse_id=data['warehouse_id'],
            destination=data.get('destination'),
            notes=data.get('notes'),
            created_by=user_id
        )
        
        db.session.add(delivery)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery created successfully',
            'data': delivery.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/deliveries/<int:delivery_id>/items', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def add_delivery_item(delivery_id):
    """Add item to delivery"""
    try:
        delivery = Delivery.query.get(delivery_id)
        
        if not delivery:
            return jsonify({'success': False, 'message': 'Delivery not found'}), 404
        
        if delivery.status not in ['Draft', 'Picked']:
            return jsonify({
                'success': False,
                'message': f'Cannot add items to {delivery.status} delivery'
            }), 400
        
        data = request.get_json(force=True)
        
        required = ['product_id', 'quantity_required', 'location_id']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        location = Location.query.get(data['location_id'])
        if not location:
            return jsonify({'success': False, 'message': 'Location not found'}), 404
        
        item = DeliveryItem(
            delivery_id=delivery_id,
            product_id=data['product_id'],
            quantity_required=data['quantity_required'],
            location_id=data['location_id'],
            notes=data.get('notes')
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Item added to delivery',
            'data': item.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/deliveries/<int:delivery_id>/validate', methods=['POST'])
@RoleRequired('Inventory Manager')
def validate_delivery(delivery_id):
    """Validate delivery and reduce stock"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        delivery = Delivery.query.get(delivery_id)
        
        if not delivery:
            return jsonify({'success': False, 'message': 'Delivery not found'}), 404
        
        if delivery.status != 'Packed':
            return jsonify({
                'success': False,
                'message': 'Delivery must be packed before validation'
            }), 400
        
        # Reduce inventory
        for item in delivery.items:
            inventory = Inventory.query.filter_by(
                product_id=item.product_id,
                location_id=item.location_id
            ).first()
            
            if not inventory or inventory.quantity < item.quantity_packed:
                return jsonify({
                    'success': False,
                    'message': f'Insufficient inventory for {item.product.name}'
                }), 400
            
            old_qty = inventory.quantity
            inventory.quantity -= item.quantity_packed
            
            # Log to stock ledger
            ledger = StockLedger(
                operation_type='Delivery',
                reference_id=delivery_id,
                reference_number=delivery.delivery_number,
                product_id=item.product_id,
                source_location_id=item.location_id,
                quantity_change=-item.quantity_packed,
                old_quantity=old_qty,
                new_quantity=inventory.quantity,
                created_by=user_id,
                notes=f'Delivery to {delivery.destination}'
            )
            db.session.add(ledger)
        
        delivery.status = 'Shipped'
        delivery.delivery_date = datetime.utcnow()
        delivery.validated_by = user_id
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery validated and stock reduced',
            'data': delivery.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== TRANSFERS ====================

@inventory_bp.route('/transfers', methods=['GET'])
@jwt_required()
def get_transfers():
    """Get all transfers"""
    try:
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Transfer.query
        
        if status:
            query = query.filter_by(status=status)
        
        paginated = query.order_by(Transfer.created_at.desc()).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [transfer.to_dict() for transfer in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/transfers', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def create_transfer():
    """Create stock transfer between locations"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        data = request.get_json(force=True)
        
        required = ['source_location_id', 'destination_location_id']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        source = Location.query.get(data['source_location_id'])
        destination = Location.query.get(data['destination_location_id'])
        
        if not source or not destination:
            return jsonify({'success': False, 'message': 'Location not found'}), 404
        
        transfer = Transfer(
            transfer_number=SequenceGenerator.generate_transfer_number(source.warehouse_id),
            source_location_id=data['source_location_id'],
            destination_location_id=data['destination_location_id'],
            notes=data.get('notes'),
            created_by=user_id
        )
        
        db.session.add(transfer)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Transfer created successfully',
            'data': transfer.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/transfers/<int:transfer_id>/items', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def add_transfer_item(transfer_id):
    """Add item to transfer"""
    try:
        transfer = Transfer.query.get(transfer_id)
        
        if not transfer:
            return jsonify({'success': False, 'message': 'Transfer not found'}), 404
        
        if transfer.status != 'Draft':
            return jsonify({
                'success': False,
                'message': f'Cannot add items to {transfer.status} transfer'
            }), 400
        
        data = request.get_json(force=True)
        
        required = ['product_id', 'quantity']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({'success': False, 'message': 'Product not found'}), 404
        
        # Check source inventory
        source_inv = Inventory.query.filter_by(
            product_id=data['product_id'],
            location_id=transfer.source_location_id
        ).first()
        
        if not source_inv or source_inv.quantity < data['quantity']:
            return jsonify({
                'success': False,
                'message': 'Insufficient inventory at source location'
            }), 400
        
        item = TransferItem(
            transfer_id=transfer_id,
            product_id=data['product_id'],
            quantity=data['quantity']
        )
        
        db.session.add(item)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Item added to transfer',
            'data': item.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/transfers/<int:transfer_id>/complete', methods=['POST'])
@RoleRequired('Inventory Manager')
def complete_transfer(transfer_id):
    """Complete transfer and move inventory"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        transfer = Transfer.query.get(transfer_id)
        
        if not transfer:
            return jsonify({'success': False, 'message': 'Transfer not found'}), 404
        
        if transfer.status != 'In Transit':
            return jsonify({
                'success': False,
                'message': 'Transfer must be in transit to complete'
            }), 400
        
        # Move inventory
        for item in transfer.items:
            # Remove from source
            source_inv = Inventory.query.filter_by(
                product_id=item.product_id,
                location_id=transfer.source_location_id
            ).first()
            
            if source_inv:
                old_qty = source_inv.quantity
                source_inv.quantity -= item.quantity
                
                ledger = StockLedger(
                    operation_type='Transfer',
                    reference_id=transfer_id,
                    reference_number=transfer.transfer_number,
                    product_id=item.product_id,
                    source_location_id=transfer.source_location_id,
                    destination_location_id=transfer.destination_location_id,
                    quantity_change=-item.quantity,
                    old_quantity=old_qty,
                    new_quantity=source_inv.quantity,
                    created_by=user_id
                )
                db.session.add(ledger)
            
            # Add to destination
            dest_inv = Inventory.query.filter_by(
                product_id=item.product_id,
                location_id=transfer.destination_location_id
            ).first()
            
            if not dest_inv:
                dest_inv = Inventory(
                    product_id=item.product_id,
                    location_id=transfer.destination_location_id,
                    quantity=0
                )
                db.session.add(dest_inv)
            
            old_qty = dest_inv.quantity
            dest_inv.quantity += item.quantity
            
            ledger = StockLedger(
                operation_type='Transfer',
                reference_id=transfer_id,
                reference_number=transfer.transfer_number,
                product_id=item.product_id,
                destination_location_id=transfer.destination_location_id,
                quantity_change=item.quantity,
                old_quantity=old_qty,
                new_quantity=dest_inv.quantity,
                created_by=user_id
            )
            db.session.add(ledger)
        
        transfer.status = 'Completed'
        transfer.transfer_date = datetime.utcnow()
        transfer.completed_by = user_id
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Transfer completed successfully',
            'data': transfer.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ADJUSTMENTS ====================

@inventory_bp.route('/adjustments', methods=['GET'])
@jwt_required()
def get_adjustments():
    """Get all adjustments"""
    try:
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = Adjustment.query
        
        if status:
            query = query.filter_by(status=status)
        
        paginated = query.order_by(Adjustment.created_at.desc()).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [adj.to_dict() for adj in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/adjustments', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def create_adjustment():
    """Create stock adjustment"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        data = request.get_json(force=True)
        
        required = ['product_id', 'location_id', 'system_quantity', 'physical_quantity', 'reason']
        for field in required:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        product = Product.query.get(data['product_id'])
        location = Location.query.get(data['location_id'])
        
        if not product or not location:
            return jsonify({'success': False, 'message': 'Product or location not found'}), 404
        
        adjustment_qty = data['physical_quantity'] - data['system_quantity']
        
        adjustment = Adjustment(
            adjustment_number=SequenceGenerator.generate_adjustment_number(location.warehouse_id),
            product_id=data['product_id'],
            location_id=data['location_id'],
            system_quantity=data['system_quantity'],
            physical_quantity=data['physical_quantity'],
            adjustment_quantity=adjustment_qty,
            reason=data['reason'],
            notes=data.get('notes'),
            created_by=user_id
        )
        
        db.session.add(adjustment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Adjustment created successfully',
            'data': adjustment.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/adjustments/<int:adjustment_id>/approve', methods=['POST'])
@RoleRequired('Inventory Manager')
def approve_adjustment(adjustment_id):
    """Approve and apply adjustment"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        adjustment = Adjustment.query.get(adjustment_id)
        
        if not adjustment:
            return jsonify({'success': False, 'message': 'Adjustment not found'}), 404
        
        if adjustment.status != 'Draft':
            return jsonify({
                'success': False,
                'message': f'Adjustment is already {adjustment.status}'
            }), 400
        
        # Update inventory
        inventory = Inventory.query.filter_by(
            product_id=adjustment.product_id,
            location_id=adjustment.location_id
        ).first()
        
        if not inventory:
            inventory = Inventory(
                product_id=adjustment.product_id,
                location_id=adjustment.location_id,
                quantity=0
            )
            db.session.add(inventory)
        
        old_qty = inventory.quantity
        inventory.quantity = adjustment.physical_quantity
        
        # Log to stock ledger
        ledger = StockLedger(
            operation_type='Adjustment',
            reference_id=adjustment_id,
            reference_number=adjustment.adjustment_number,
            product_id=adjustment.product_id,
            destination_location_id=adjustment.location_id,
            quantity_change=adjustment.adjustment_quantity,
            old_quantity=old_qty,
            new_quantity=inventory.quantity,
            created_by=user_id,
            notes=f'Adjustment - {adjustment.reason}'
        )
        db.session.add(ledger)
        
        adjustment.status = 'Approved'
        adjustment.approved_by = user_id
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Adjustment approved and applied',
            'data': adjustment.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== STOCK LEDGER ====================

@inventory_bp.route('/ledger', methods=['GET'])
@jwt_required()
def get_stock_ledger():
    """Get stock ledger with filtering"""
    try:
        operation_type = request.args.get('operation_type')
        product_id = request.args.get('product_id', type=int)
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = StockLedger.query
        
        if operation_type:
            query = query.filter_by(operation_type=operation_type)
        if product_id:
            query = query.filter_by(product_id=product_id)
        
        paginated = query.order_by(StockLedger.created_at.desc()).paginate(page=page, per_page=per_page)
        
        return jsonify({
            'success': True,
            'data': [entry.to_dict() for entry in paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': paginated.total,
                'pages': paginated.pages
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DASHBOARD ====================

@inventory_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get dashboard KPIs and chart data"""
    try:
        from sqlalchemy import func, case
        
        # KPIs
        total_products_in_stock = db.session.query(
            func.coalesce(func.sum(Inventory.quantity), 0)
        ).scalar()
        
        # Low stock: products where total inventory < initial_stock * 0.2
        low_stock_subq = db.session.query(
            Inventory.product_id,
            func.sum(Inventory.quantity).label('total_qty')
        ).group_by(Inventory.product_id).subquery()
        
        low_stock_items = db.session.query(func.count()).select_from(
            Product
        ).join(
            low_stock_subq, Product.id == low_stock_subq.c.product_id
        ).filter(
            low_stock_subq.c.total_qty <= 10
        ).scalar() or 0
        
        pending_receipts = Receipt.query.filter(
            Receipt.status.in_(['Draft', 'Waiting'])
        ).count()
        
        pending_deliveries = Delivery.query.filter(
            Delivery.status.in_(['Draft', 'Picked', 'Packed'])
        ).count()
        
        internal_transfers = Transfer.query.filter(
            Transfer.status.in_(['Draft', 'In Transit'])
        ).count()
        
        kpis = {
            'totalProductsInStock': int(total_products_in_stock),
            'lowStockItems': low_stock_items,
            'pendingReceipts': pending_receipts,
            'pendingDeliveries': pending_deliveries,
            'internalTransfers': internal_transfers,
        }
        
        # Stock levels by category
        stock_levels_query = db.session.query(
            Category.name,
            func.coalesce(func.sum(Inventory.quantity), 0).label('value')
        ).join(
            Product, Product.category_id == Category.id
        ).outerjoin(
            Inventory, Inventory.product_id == Product.id
        ).group_by(Category.name).all()
        
        stock_levels = [{'name': row[0], 'value': int(row[1])} for row in stock_levels_query]
        if not stock_levels:
            stock_levels = [{'name': 'No Data', 'value': 0}]
        
        # Category distribution
        cat_dist_query = db.session.query(
            Category.name,
            func.count(Product.id).label('value')
        ).join(
            Product, Product.category_id == Category.id
        ).group_by(Category.name).all()
        
        category_distribution = [{'name': row[0], 'value': int(row[1])} for row in cat_dist_query]
        if not category_distribution:
            category_distribution = [{'name': 'No Data', 'value': 0}]
        
        # Movement timeline (last 7 days)
        from datetime import timedelta
        days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        movement_timeline = []
        for i in range(6, -1, -1):
            day = datetime.utcnow() - timedelta(days=i)
            day_start = day.replace(hour=0, minute=0, second=0, microsecond=0)
            day_end = day.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            incoming = db.session.query(
                func.coalesce(func.sum(StockLedger.quantity_change), 0)
            ).filter(
                StockLedger.quantity_change > 0,
                StockLedger.created_at.between(day_start, day_end)
            ).scalar()
            
            outgoing = db.session.query(
                func.coalesce(func.sum(func.abs(StockLedger.quantity_change)), 0)
            ).filter(
                StockLedger.quantity_change < 0,
                StockLedger.created_at.between(day_start, day_end)
            ).scalar()
            
            movement_timeline.append({
                'period': days[day.weekday()],
                'incoming': int(incoming),
                'outgoing': int(outgoing)
            })
        
        # Warehouse comparison
        wh_compare_query = db.session.query(
            Warehouse.name,
            func.coalesce(func.sum(Inventory.quantity), 0).label('stock')
        ).outerjoin(
            Location, Location.warehouse_id == Warehouse.id
        ).outerjoin(
            Inventory, Inventory.location_id == Location.id
        ).filter(
            Warehouse.is_active == True
        ).group_by(Warehouse.name).all()
        
        warehouse_comparison = [{'warehouse': row[0], 'stock': int(row[1])} for row in wh_compare_query]
        if not warehouse_comparison:
            warehouse_comparison = [{'warehouse': 'No Data', 'stock': 0}]
        
        return jsonify({
            'success': True,
            'data': {
                'kpis': kpis,
                'stockLevels': stock_levels,
                'categoryDistribution': category_distribution,
                'movementTimeline': movement_timeline,
                'warehouseComparison': warehouse_comparison,
            }
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== DELIVERY PICK/PACK ====================

@inventory_bp.route('/deliveries/<int:delivery_id>/pick', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def pick_delivery(delivery_id):
    """Mark delivery items as picked"""
    try:
        delivery = Delivery.query.get(delivery_id)
        
        if not delivery:
            return jsonify({'success': False, 'message': 'Delivery not found'}), 404
        
        if delivery.status != 'Draft':
            return jsonify({
                'success': False,
                'message': f'Delivery must be in Draft to pick, currently {delivery.status}'
            }), 400
        
        data = request.get_json(force=True) or {}
        
        for item in delivery.items:
            qty_picked = data.get(f'item_{item.id}_picked', item.quantity_required)
            item.quantity_picked = qty_picked
        
        delivery.status = 'Picked'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery items picked',
            'data': delivery.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@inventory_bp.route('/deliveries/<int:delivery_id>/pack', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def pack_delivery(delivery_id):
    """Mark delivery items as packed"""
    try:
        delivery = Delivery.query.get(delivery_id)
        
        if not delivery:
            return jsonify({'success': False, 'message': 'Delivery not found'}), 404
        
        if delivery.status != 'Picked':
            return jsonify({
                'success': False,
                'message': f'Delivery must be Picked to pack, currently {delivery.status}'
            }), 400
        
        data = request.get_json(force=True) or {}
        
        for item in delivery.items:
            qty_packed = data.get(f'item_{item.id}_packed', item.quantity_picked)
            item.quantity_packed = qty_packed
        
        delivery.status = 'Packed'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Delivery items packed',
            'data': delivery.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== TRANSFER START ====================

@inventory_bp.route('/transfers/<int:transfer_id>/start', methods=['POST'])
@RoleRequired('Inventory Manager', 'Warehouse Staff')
def start_transfer(transfer_id):
    """Start transfer - move to In Transit"""
    try:
        transfer = Transfer.query.get(transfer_id)
        
        if not transfer:
            return jsonify({'success': False, 'message': 'Transfer not found'}), 404
        
        if transfer.status != 'Draft':
            return jsonify({
                'success': False,
                'message': f'Transfer must be in Draft to start, currently {transfer.status}'
            }), 400
        
        if not transfer.items:
            return jsonify({
                'success': False,
                'message': 'Transfer must have at least one item'
            }), 400
        
        transfer.status = 'In Transit'
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Transfer started',
            'data': transfer.to_dict()
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
