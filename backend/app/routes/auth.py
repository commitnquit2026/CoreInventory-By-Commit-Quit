from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, User, PasswordResetToken
from app.utils import AuthUtils, ValidationUtils
from app.utils.email import EmailUtils
from datetime import datetime, timedelta
import uuid

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """User signup endpoint"""
    try:
        data = request.get_json(force=True)
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'{field} is required'
                }), 400
        
        # Validate username length
        username = data.get('username')
        if len(username) < 6 or len(username) > 12:
            return jsonify({'success': False, 'message': 'Login Id must be between 6 and 12 characters'}), 400
        
        # Validate email
        if not ValidationUtils.validate_email(data['email']):
            return jsonify({'success': False, 'message': 'Invalid email format'}), 400
        
        # Validate password strength
        is_valid, message = ValidationUtils.validate_password(data['password'])
        if not is_valid:
            return jsonify({'success': False, 'message': message}), 400
        
        # Check if user exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'success': False, 'message': 'Username already exists'}), 409
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'success': False, 'message': 'Email already exists'}), 409
        
        # Create user
        user = User(
            username=data['username'],
            email=data['email'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            role=data.get('role', 'Warehouse Staff')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'User created successfully',
            'user': user.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json(force=True)
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'success': False, 'message': 'Username and password required'}), 400
        
        # Find user
        user = User.query.filter_by(username=username).first()
        
        if not user or not user.check_password(password):
            return jsonify({'success': False, 'message': 'Invalid Login Id or Password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'message': 'User account is inactive'}), 403
        
        # Generate JWT token
        token = AuthUtils.generate_jwt_token(user.id, user.role)
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict(),
            'otp_enabled': user.otp_enabled
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/setup-2fa', methods=['POST'])
@jwt_required()
def setup_2fa():
    """Setup 2-factor authentication"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Generate OTP secret
        secret = AuthUtils.generate_otp_secret()
        qr_code = AuthUtils.generate_qr_code(secret, user.email)
        
        return jsonify({
            'success': True,
            'message': '2FA setup initiated',
            'secret': secret,
            'qr_code': qr_code
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/verify-2fa', methods=['POST'])
@jwt_required()
def verify_2fa():
    """Verify and enable 2-factor authentication"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        data = request.get_json(force=True)
        secret = data.get('secret')
        token = data.get('token')
        
        if not secret or not token:
            return jsonify({'success': False, 'message': 'Secret and token required'}), 400
        
        # Verify token
        if not AuthUtils.verify_totp(secret, token):
            return jsonify({'success': False, 'message': 'Invalid token'}), 400
        
        user = User.query.get(user_id)
        user.otp_secret = secret
        user.otp_enabled = True
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': '2FA enabled successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/request-password-reset', methods=['POST'])
def request_password_reset():
    """Request password reset OTP"""
    try:
        data = request.get_json(force=True)
        email = data.get('email')
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user:
            # Don't reveal if user exists
            return jsonify({
                'success': True,
                'message': 'If email exists, reset link has been sent'
            }), 200
        
        # Generate reset token and OTP
        reset_token = str(uuid.uuid4())
        otp_secret = AuthUtils.generate_otp_secret()
        otp_code = AuthUtils.get_totp(otp_secret)
        
        reset_record = PasswordResetToken(
            user_id=user.id,
            token=reset_token,
            otp_code=otp_code,
            expires_at=datetime.utcnow() + timedelta(hours=1)
        )
        
        db.session.add(reset_record)
        db.session.commit()
        
        # Send password reset email with OTP
        email_sent, email_message = EmailUtils.send_password_reset_email(
            user_email=user.email,
            user_name=f"{user.first_name} {user.last_name}",
            reset_token=reset_token,
            otp_code=otp_code
        )
        
        return jsonify({
            'success': True,
            'message': 'Password reset OTP sent to email' if email_sent else 'OTP generated (email may not be configured)',
            'reset_token': reset_token
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """Reset password with OTP"""
    try:
        data = request.get_json(force=True)
        reset_token = data.get('reset_token')
        otp_code = data.get('otp_code')
        new_password = data.get('new_password')
        
        if not all([reset_token, otp_code, new_password]):
            return jsonify({
                'success': False,
                'message': 'reset_token, otp_code, and new_password are required'
            }), 400
        
        # Validate password
        is_valid, message = ValidationUtils.validate_password(new_password)
        if not is_valid:
            return jsonify({'success': False, 'message': message}), 400
        
        # Find reset token
        reset_record = PasswordResetToken.query.filter_by(token=reset_token).first()
        
        if not reset_record or reset_record.used:
            return jsonify({'success': False, 'message': 'Invalid or expired reset token'}), 400
        
        if reset_record.expires_at < datetime.utcnow():
            return jsonify({'success': False, 'message': 'Reset token has expired'}), 400
        
        if reset_record.otp_code != otp_code:
            return jsonify({'success': False, 'message': 'Invalid OTP code'}), 400
        
        # Reset password
        user = reset_record.user
        user.set_password(new_password)
        reset_record.used = True
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Password reset successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get user profile"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        return jsonify({
            'success': True,
            'user': user.to_dict()
        }), 200
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    try:
        user_id = get_jwt_identity()
        if isinstance(user_id, dict):
            user_id = user_id.get('user_id')
        
        data = request.get_json(force=True)
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        
        if not old_password or not new_password:
            return jsonify({
                'success': False,
                'message': 'old_password and new_password are required'
            }), 400
        
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        # Verify old password
        if not user.check_password(old_password):
            return jsonify({'success': False, 'message': 'Incorrect current password'}), 401
        
        # Validate new password
        is_valid, message = ValidationUtils.validate_password(new_password)
        if not is_valid:
            return jsonify({'success': False, 'message': message}), 400
        
        # Update password
        user.set_password(new_password)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Password changed successfully'
        }), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 500
