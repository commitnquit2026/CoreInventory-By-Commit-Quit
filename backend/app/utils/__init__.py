import jwt
import pyotp
import qrcode
from io import BytesIO
import base64
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
import os

class AuthUtils:
    @staticmethod
    def generate_jwt_token(user_id, user_role, expires_in=3600):
        """Generate JWT token for user"""
        payload = {
            'sub': str(user_id),  # Required by Flask-JWT-Extended
            'user_id': user_id,
            'role': user_role,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(seconds=expires_in)
        }
        token = jwt.encode(
            payload,
            os.getenv('JWT_SECRET_KEY', 'change-this-secret'),
            algorithm='HS256'
        )
        return token
    
    @staticmethod
    def generate_otp_secret():
        """Generate OTP secret"""
        return pyotp.random_base32()
    
    @staticmethod
    def get_totp(secret):
        """Get current TOTP"""
        totp = pyotp.TOTP(secret)
        return totp.now()
    
    @staticmethod
    def verify_totp(secret, token):
        """Verify TOTP token"""
        totp = pyotp.TOTP(secret)
        return totp.verify(token)
    
    @staticmethod
    def generate_qr_code(secret, email, issuer="CoreInventory"):
        """Generate QR code for OTP setup"""
        totp = pyotp.TOTP(secret)
        uri = totp.provisioning_uri(name=email, issuer_name=issuer)
        
        qr = qrcode.QRCode()
        qr.add_data(uri)
        qr.make()
        
        img = qr.make_image()
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        
        img_base64 = base64.b64encode(buffer.getvalue()).decode()
        return img_base64

class RoleRequired:
    """Decorator to check user role"""
    def __init__(self, *allowed_roles):
        self.allowed_roles = allowed_roles
    
    def __call__(self, fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            user_role = claims.get('role')
            
            if user_role not in self.allowed_roles:
                return jsonify({
                    'success': False,
                    'message': f'Access denied. Required roles: {", ".join(self.allowed_roles)}'
                }), 403
            
            return fn(*args, **kwargs)
        return wrapper

class ValidationUtils:
    @staticmethod
    def validate_email(email):
        """Simple email validation"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_password(password):
        """Validate password strength"""
        import re
        if len(password) < 8:
            return False, "Password must be at least 8 characters"
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one digit"
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            return False, "Password must contain at least one special character"
        return True, "Password is valid"
    
    @staticmethod
    def validate_sku(sku):
        """Validate SKU format"""
        import re
        pattern = r'^[A-Z0-9-]{3,50}$'
        return re.match(pattern, sku) is not None
    
    @staticmethod
    def validate_quantity(quantity):
        """Validate quantity"""
        try:
            qty = int(quantity)
            return qty > 0, qty
        except (ValueError, TypeError):
            return False, None

class SequenceGenerator:
    """Generate unique sequential numbers"""
    
    @staticmethod
    def _get_warehouse_prefix(warehouse_id):
        from app.models import Warehouse
        if not warehouse_id:
            return "WH"
        warehouse = Warehouse.query.get(warehouse_id)
        if not warehouse or not warehouse.name:
            return "WH"
        # Try to use first 2 chars of warehouse name, defaulting to WH
        prefix = warehouse.name[:2].upper()
        # If warehouse name is exactly 'WarehouseX', just use WH
        if warehouse.name.lower().startswith('warehouse'):
            prefix = "WH"
        return prefix

    @staticmethod
    def generate_receipt_number(warehouse_id=None):
        from app.models import Receipt
        prefix = SequenceGenerator._get_warehouse_prefix(warehouse_id)
        last_receipt = Receipt.query.order_by(Receipt.id.desc()).first()
        sequence = (last_receipt.id + 1) if last_receipt else 1
        return f"{prefix}/IN/{sequence:04d}"
    
    @staticmethod
    def generate_delivery_number(warehouse_id=None):
        from app.models import Delivery
        prefix = SequenceGenerator._get_warehouse_prefix(warehouse_id)
        last_delivery = Delivery.query.order_by(Delivery.id.desc()).first()
        sequence = (last_delivery.id + 1) if last_delivery else 1
        return f"{prefix}/OUT/{sequence:04d}"
    
    @staticmethod
    def generate_transfer_number(warehouse_id=None):
        from app.models import Transfer
        prefix = SequenceGenerator._get_warehouse_prefix(warehouse_id)
        last_transfer = Transfer.query.order_by(Transfer.id.desc()).first()
        sequence = (last_transfer.id + 1) if last_transfer else 1
        return f"{prefix}/TRF/{sequence:04d}"
    
    @staticmethod
    def generate_adjustment_number(warehouse_id=None):
        from app.models import Adjustment
        prefix = SequenceGenerator._get_warehouse_prefix(warehouse_id)
        last_adjustment = Adjustment.query.order_by(Adjustment.id.desc()).first()
        sequence = (last_adjustment.id + 1) if last_adjustment else 1
        return f"{prefix}/ADJ/{sequence:04d}"
