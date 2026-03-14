from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False, index=True)
    email = db.Column(db.String(100), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    role = db.Column(db.String(50), default='Warehouse Staff', nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    otp_secret = db.Column(db.String(32))
    otp_enabled = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    receipts = db.relationship('Receipt', foreign_keys='Receipt.created_by', backref='creator')
    deliveries = db.relationship('Delivery', foreign_keys='Delivery.created_by', backref='creator')
    transfers = db.relationship('Transfer', foreign_keys='Transfer.created_by', backref='creator')
    adjustments = db.relationship('Adjustment', foreign_keys='Adjustment.created_by', backref='creator')
    ledger_entries = db.relationship('StockLedger', backref='user')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'role': self.role,
            'is_active': self.is_active,
            'otp_enabled': self.otp_enabled
        }

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    products = db.relationship('Product', backref='category', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    sku = db.Column(db.String(50), unique=True, nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    unit_of_measure = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    initial_stock = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    inventory = db.relationship('Inventory', backref='product', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'sku': self.sku,
            'name': self.name,
            'category': self.category.name if self.category else None,
            'unit_of_measure': self.unit_of_measure,
            'description': self.description,
            'initial_stock': self.initial_stock,
            'is_active': self.is_active
        }

class Warehouse(db.Model):
    __tablename__ = 'warehouses'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    location = db.Column(db.String(255))
    capacity = db.Column(db.Integer)
    manager_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    locations = db.relationship('Location', backref='warehouse', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'capacity': self.capacity,
            'is_active': self.is_active
        }

class Location(db.Model):
    __tablename__ = 'locations'
    
    id = db.Column(db.Integer, primary_key=True)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)
    rack_code = db.Column(db.String(50), nullable=False)
    location_type = db.Column(db.String(50), default='Rack')
    capacity = db.Column(db.Integer)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('warehouse_id', 'rack_code', name='unique_rack_per_warehouse'),)
    
    # Relationships
    inventory = db.relationship('Inventory', backref='location', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'warehouse_id': self.warehouse_id,
            'rack_code': self.rack_code,
            'location_type': self.location_type,
            'capacity': self.capacity,
            'is_active': self.is_active
        }

class Inventory(db.Model):
    __tablename__ = 'inventory'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    reserved_quantity = db.Column(db.Integer, default=0)
    last_counted_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('product_id', 'location_id', name='unique_product_location'),)
    
    def available_quantity(self):
        return self.quantity - self.reserved_quantity
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'product_name': self.product.name if self.product else None,
            'location_id': self.location_id,
            'location_code': self.location.rack_code if self.location else None,
            'quantity': self.quantity,
            'reserved_quantity': self.reserved_quantity,
            'available_quantity': self.available_quantity()
        }

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    contact_person = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    receipts = db.relationship('Receipt', backref='supplier', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'contact_person': self.contact_person,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'city': self.city,
            'country': self.country,
            'is_active': self.is_active
        }

class Receipt(db.Model):
    __tablename__ = 'receipts'
    
    id = db.Column(db.Integer, primary_key=True)
    receipt_number = db.Column(db.String(50), unique=True, nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)
    status = db.Column(db.String(20), default='Draft')
    received_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    validated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    warehouse = db.relationship('Warehouse', backref='receipts')
    items = db.relationship('ReceiptItem', backref='receipt', lazy=True, cascade='all, delete-orphan')
    validated_by_user = db.relationship('User', foreign_keys=[validated_by], backref='validated_receipts')
    
    def to_dict(self):
        return {
            'id': self.id,
            'receipt_number': self.receipt_number,
            'supplier': self.supplier.name if self.supplier else None,
            'warehouse': self.warehouse.name if self.warehouse else None,
            'status': self.status,
            'received_date': self.received_date.isoformat() if self.received_date else None,
            'items': [item.to_dict() for item in self.items],
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class ReceiptItem(db.Model):
    __tablename__ = 'receipt_items'
    
    id = db.Column(db.Integer, primary_key=True)
    receipt_id = db.Column(db.Integer, db.ForeignKey('receipts.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity_expected = db.Column(db.Integer, nullable=False)
    quantity_received = db.Column(db.Integer, default=0)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    unit_price = db.Column(db.Numeric(10, 2))
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = db.relationship('Product')
    location = db.relationship('Location')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product.name if self.product else None,
            'sku': self.product.sku if self.product else None,
            'quantity_expected': self.quantity_expected,
            'quantity_received': self.quantity_received,
            'location': self.location.rack_code if self.location else None,
            'unit_price': float(self.unit_price) if self.unit_price else None,
            'notes': self.notes
        }

class Delivery(db.Model):
    __tablename__ = 'deliveries'
    
    id = db.Column(db.Integer, primary_key=True)
    delivery_number = db.Column(db.String(50), unique=True, nullable=False)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'), nullable=False)
    status = db.Column(db.String(20), default='Draft')
    delivery_date = db.Column(db.DateTime)
    destination = db.Column(db.String(255))
    notes = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    validated_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    warehouse = db.relationship('Warehouse', backref='deliveries')
    items = db.relationship('DeliveryItem', backref='delivery', lazy=True, cascade='all, delete-orphan')
    validated_by_user = db.relationship('User', foreign_keys=[validated_by], backref='validated_deliveries')
    
    def to_dict(self):
        return {
            'id': self.id,
            'delivery_number': self.delivery_number,
            'warehouse': self.warehouse.name if self.warehouse else None,
            'status': self.status,
            'delivery_date': self.delivery_date.isoformat() if self.delivery_date else None,
            'destination': self.destination,
            'items': [item.to_dict() for item in self.items],
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class DeliveryItem(db.Model):
    __tablename__ = 'delivery_items'
    
    id = db.Column(db.Integer, primary_key=True)
    delivery_id = db.Column(db.Integer, db.ForeignKey('deliveries.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity_required = db.Column(db.Integer, nullable=False)
    quantity_picked = db.Column(db.Integer, default=0)
    quantity_packed = db.Column(db.Integer, default=0)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = db.relationship('Product')
    location = db.relationship('Location')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product.name if self.product else None,
            'sku': self.product.sku if self.product else None,
            'quantity_required': self.quantity_required,
            'quantity_picked': self.quantity_picked,
            'quantity_packed': self.quantity_packed,
            'location': self.location.rack_code if self.location else None,
            'notes': self.notes
        }

class Transfer(db.Model):
    __tablename__ = 'transfers'
    
    id = db.Column(db.Integer, primary_key=True)
    transfer_number = db.Column(db.String(50), unique=True, nullable=False)
    source_location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    destination_location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    status = db.Column(db.String(20), default='Draft')
    transfer_date = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    completed_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    source_location = db.relationship('Location', foreign_keys=[source_location_id])
    destination_location = db.relationship('Location', foreign_keys=[destination_location_id])
    items = db.relationship('TransferItem', backref='transfer', lazy=True, cascade='all, delete-orphan')
    completed_by_user = db.relationship('User', foreign_keys=[completed_by], backref='completed_transfers')
    
    def to_dict(self):
        return {
            'id': self.id,
            'transfer_number': self.transfer_number,
            'source_location': self.source_location.rack_code if self.source_location else None,
            'destination_location': self.destination_location.rack_code if self.destination_location else None,
            'status': self.status,
            'transfer_date': self.transfer_date.isoformat() if self.transfer_date else None,
            'items': [item.to_dict() for item in self.items],
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class TransferItem(db.Model):
    __tablename__ = 'transfer_items'
    
    id = db.Column(db.Integer, primary_key=True)
    transfer_id = db.Column(db.Integer, db.ForeignKey('transfers.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    product = db.relationship('Product')
    
    def to_dict(self):
        return {
            'id': self.id,
            'product': self.product.name if self.product else None,
            'sku': self.product.sku if self.product else None,
            'quantity': self.quantity
        }

class Adjustment(db.Model):
    __tablename__ = 'adjustments'
    
    id = db.Column(db.Integer, primary_key=True)
    adjustment_number = db.Column(db.String(50), unique=True, nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('locations.id'), nullable=False)
    system_quantity = db.Column(db.Integer, nullable=False)
    physical_quantity = db.Column(db.Integer, nullable=False)
    adjustment_quantity = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(50), nullable=False)
    notes = db.Column(db.Text)
    status = db.Column(db.String(20), default='Draft')
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    approved_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    product = db.relationship('Product')
    location = db.relationship('Location')
    approved_by_user = db.relationship('User', foreign_keys=[approved_by], backref='approved_adjustments')
    
    def to_dict(self):
        return {
            'id': self.id,
            'adjustment_number': self.adjustment_number,
            'product': self.product.name if self.product else None,
            'sku': self.product.sku if self.product else None,
            'location': self.location.rack_code if self.location else None,
            'system_quantity': self.system_quantity,
            'physical_quantity': self.physical_quantity,
            'adjustment_quantity': self.adjustment_quantity,
            'reason': self.reason,
            'status': self.status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat()
        }

class StockLedger(db.Model):
    __tablename__ = 'stock_ledger'
    
    id = db.Column(db.Integer, primary_key=True)
    operation_type = db.Column(db.String(50), nullable=False, index=True)
    reference_id = db.Column(db.Integer)
    reference_number = db.Column(db.String(50), index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    source_location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    destination_location_id = db.Column(db.Integer, db.ForeignKey('locations.id'))
    quantity_change = db.Column(db.Integer, nullable=False)
    old_quantity = db.Column(db.Integer)
    new_quantity = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    
    # Relationships
    product = db.relationship('Product')
    source_location = db.relationship('Location', foreign_keys=[source_location_id])
    destination_location = db.relationship('Location', foreign_keys=[destination_location_id])
    
    def to_dict(self):
        return {
            'id': self.id,
            'operation_type': self.operation_type,
            'reference_number': self.reference_number,
            'product': self.product.name if self.product else None,
            'sku': self.product.sku if self.product else None,
            'source_location': self.source_location.rack_code if self.source_location else None,
            'destination_location': self.destination_location.rack_code if self.destination_location else None,
            'quantity_change': self.quantity_change,
            'old_quantity': self.old_quantity,
            'new_quantity': self.new_quantity,
            'created_at': self.created_at.isoformat(),
            'created_by': self.user.username if self.user else None
        }

class PasswordResetToken(db.Model):
    __tablename__ = 'password_reset_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False, index=True)
    otp_code = db.Column(db.String(6))
    expires_at = db.Column(db.DateTime, nullable=False, index=True)
    used = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='reset_tokens')
