from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import DevelopmentConfig
from app.models import db
import os
from dotenv import load_dotenv

load_dotenv()

def create_app(config_class=DevelopmentConfig):
    """Application factory"""
    app = Flask(__name__)
    
    # Configuration
    app.config.from_object(config_class)
    
    # Enable CORS for frontend communication
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    
    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.products import product_bp
    from app.routes.warehouses import warehouse_bp
    from app.routes.inventory import inventory_bp
    from app.routes.suppliers import supplier_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(warehouse_bp)
    app.register_blueprint(inventory_bp)
    app.register_blueprint(supplier_bp)
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Resource not found'
        }), 404
    
    @app.errorhandler(415)
    def unsupported_media_type(error):
        return jsonify({
            'success': False,
            'message': 'Content-Type must be application/json'
        }), 415
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Internal server error'
        }), 500
    
    # Health check
    @app.route('/health', methods=['GET'])
    def health():
        return jsonify({
            'status': 'healthy',
            'service': 'CoreInventory API'
        }), 200
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=True
    )
