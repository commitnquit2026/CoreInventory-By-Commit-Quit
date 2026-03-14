from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.models import db
from datetime import datetime, timedelta

movehistory_bp = Blueprint('movehistory', __name__, url_prefix='/api/v1/move-history')

# Models (to be imported from app.models)
from app.models import StockMove, Product, Location, User

@movehistory_bp.route('', methods=['GET'])
@jwt_required()
def list_moves():
    """List stock moves with filters and pagination"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    product_id = request.args.get('product_id', type=int)
    location_id = request.args.get('location_id', type=int)
    move_type = request.args.get('move_type')
    days = request.args.get('days', 30, type=int)
    
    query = StockMove.query
    
    # Filters
    if product_id:
        query = query.filter_by(product_id=product_id)
    if location_id:
        query = query.filter(
            (StockMove.from_location_id == location_id) |
            (StockMove.to_location_id == location_id)
        )
    if move_type:
        query = query.filter_by(move_type=move_type)
    
    # Date filter
    start_date = datetime.utcnow() - timedelta(days=days)
    query = query.filter(StockMove.created_at >= start_date)
    
    moves = query.order_by(StockMove.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'success': True,
        'data': [{
            'id': m.id,
            'product_id': m.product_id,
            'from_location_id': m.from_location_id,
            'to_location_id': m.to_location_id,
            'quantity': m.quantity,
            'move_type': m.move_type,
            'reference_type': m.reference_type,
            'reference_id': m.reference_id,
            'notes': m.notes,
            'created_by': m.created_by,
            'created_at': m.created_at.isoformat()
        } for m in moves.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': moves.total,
            'pages': moves.pages
        }
    }), 200

@movehistory_bp.route('/product/<int:product_id>', methods=['GET'])
@jwt_required()
def get_product_moves(product_id):
    """Get all moves for a specific product"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    moves = StockMove.query.filter_by(product_id=product_id).order_by(
        StockMove.created_at.desc()
    ).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'success': True,
        'data': [{
            'id': m.id,
            'product_id': m.product_id,
            'from_location_id': m.from_location_id,
            'to_location_id': m.to_location_id,
            'quantity': m.quantity,
            'move_type': m.move_type,
            'reference_type': m.reference_type,
            'reference_id': m.reference_id,
            'notes': m.notes,
            'created_by': m.created_by,
            'created_at': m.created_at.isoformat()
        } for m in moves.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': moves.total,
            'pages': moves.pages
        }
    }), 200

@movehistory_bp.route('/location/<int:location_id>', methods=['GET'])
@jwt_required()
def get_location_moves(location_id):
    """Get all moves in a specific location (incoming and outgoing)"""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    moves = StockMove.query.filter(
        (StockMove.from_location_id == location_id) |
        (StockMove.to_location_id == location_id)
    ).order_by(StockMove.created_at.desc()).paginate(page=page, per_page=per_page)
    
    return jsonify({
        'success': True,
        'data': [{
            'id': m.id,
            'product_id': m.product_id,
            'from_location_id': m.from_location_id,
            'to_location_id': m.to_location_id,
            'quantity': m.quantity,
            'move_type': m.move_type,
            'direction': 'In' if m.to_location_id == location_id else 'Out',
            'reference_type': m.reference_type,
            'reference_id': m.reference_id,
            'notes': m.notes,
            'created_by': m.created_by,
            'created_at': m.created_at.isoformat()
        } for m in moves.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': moves.total,
            'pages': moves.pages
        }
    }), 200

@movehistory_bp.route('/reference/<ref_type>/<int:ref_id>', methods=['GET'])
@jwt_required()
def get_reference_moves(ref_type, ref_id):
    """Get all moves for a specific receipt/delivery/transfer"""
    moves = StockMove.query.filter_by(
        reference_type=ref_type,
        reference_id=ref_id
    ).order_by(StockMove.created_at.desc()).all()
    
    return jsonify({
        'success': True,
        'data': [{
            'id': m.id,
            'product_id': m.product_id,
            'from_location_id': m.from_location_id,
            'to_location_id': m.to_location_id,
            'quantity': m.quantity,
            'move_type': m.move_type,
            'reference_type': m.reference_type,
            'reference_id': m.reference_id,
            'notes': m.notes,
            'created_by': m.created_by,
            'created_at': m.created_at.isoformat()
        } for m in moves]
    }), 200

@movehistory_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_moves_summary():
    """Get summary statistics for stock moves"""
    days = request.args.get('days', 30, type=int)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Query moves in period
    recent_moves = StockMove.query.filter(StockMove.created_at >= start_date).all()
    
    # Summary by type
    summary = {
        'Receipt': 0,
        'Delivery': 0,
        'Transfer': 0,
        'Adjustment': 0,
        'Count': 0
    }
    
    total_quantity_in = 0
    total_quantity_out = 0
    
    for move in recent_moves:
        summary[move.move_type] = summary.get(move.move_type, 0) + 1
        
        if move.move_type == 'Receipt':
            total_quantity_in += move.quantity
        elif move.move_type == 'Delivery':
            total_quantity_out += move.quantity
    
    return jsonify({
        'success': True,
        'data': {
            'period_days': days,
            'summary': summary,
            'total_moves': len(recent_moves),
            'total_quantity_in': total_quantity_in,
            'total_quantity_out': total_quantity_out,
            'net_change': total_quantity_in - total_quantity_out
        }
    }), 200
