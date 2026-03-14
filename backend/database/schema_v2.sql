-- CoreInventory Database Schema
-- Complete schema matching system diagram

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (username),
  INDEX (email)
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  contact_email VARCHAR(255),
  contact_phone VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (name)
);

-- Warehouses Table
CREATE TABLE IF NOT EXISTS warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  capacity INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (name)
);

-- Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouse_id INT NOT NULL,
  rack_code VARCHAR(255) NOT NULL,
  location_type VARCHAR(50),
  capacity INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  UNIQUE KEY (warehouse_id, rack_code),
  INDEX (warehouse_id)
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sku VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(255),
  unit_price DECIMAL(10, 2),
  reorder_level INT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (sku),
  INDEX (name)
);

-- Stock Table (per product per location)
CREATE TABLE IF NOT EXISTS stock (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT DEFAULT 0,
  reserved INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  UNIQUE KEY (product_id, location_id),
  INDEX (product_id),
  INDEX (location_id),
  CONSTRAINT check_quantity CHECK (quantity >= 0),
  CONSTRAINT check_reserved CHECK (reserved >= 0)
);

-- Receipts Table
CREATE TABLE IF NOT EXISTS receipts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_number VARCHAR(255) UNIQUE NOT NULL,
  warehouse_id INT NOT NULL,
  supplier_id INT,
  status ENUM('Draft', 'Ready', 'Done') DEFAULT 'Draft',
  total_items INT DEFAULT 0,
  total_value DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX (receipt_number),
  INDEX (warehouse_id),
  INDEX (status),
  INDEX (created_at)
);

-- Receipt Items Table
CREATE TABLE IF NOT EXISTS receipt_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  receipt_id INT NOT NULL,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2),
  received_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (receipt_id) REFERENCES receipts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  INDEX (receipt_id),
  INDEX (product_id)
);

-- Deliveries Table
CREATE TABLE IF NOT EXISTS deliveries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  delivery_number VARCHAR(255) UNIQUE NOT NULL,
  warehouse_id INT NOT NULL,
  customer_id INT,
  status ENUM('Draft', 'Waiting', 'Ready', 'Done') DEFAULT 'Draft',
  total_items INT DEFAULT 0,
  total_value DECIMAL(12, 2) DEFAULT 0,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX (delivery_number),
  INDEX (warehouse_id),
  INDEX (status),
  INDEX (created_at)
);

-- Delivery Items Table
CREATE TABLE IF NOT EXISTS delivery_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  delivery_id INT NOT NULL,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  quantity INT NOT NULL,
  picked_quantity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (delivery_id) REFERENCES deliveries(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  INDEX (delivery_id),
  INDEX (product_id)
);

-- Stock Move History Table
CREATE TABLE IF NOT EXISTS stock_moves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  from_location_id INT,
  to_location_id INT,
  quantity INT NOT NULL,
  move_type ENUM('Receipt', 'Delivery', 'Transfer', 'Adjustment', 'Count') NOT NULL,
  reference_type VARCHAR(50),
  reference_id INT,
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (from_location_id) REFERENCES locations(id),
  FOREIGN KEY (to_location_id) REFERENCES locations(id),
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX (product_id),
  INDEX (created_at),
  INDEX (move_type),
  INDEX (reference_type, reference_id)
);
