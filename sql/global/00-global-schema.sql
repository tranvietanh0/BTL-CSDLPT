-- Global schema reference used for the report.
-- Replicated tables: categories, products, warehouses.
-- Fragmented tables by site: customers, inventory, orders, order_items, allocation_logs, inventory_audit.

CREATE TABLE categories (
    category_code VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL DEFAULT ''
);

CREATE TABLE products (
    sku VARCHAR(20) PRIMARY KEY,
    category_code VARCHAR(20) NOT NULL,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (category_code) REFERENCES categories(category_code)
);

CREATE TABLE warehouses (
    warehouse_code VARCHAR(20) PRIMARY KEY,
    site_code VARCHAR(20) NOT NULL,
    warehouse_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region_code VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE customers (
    customer_code VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    region_code VARCHAR(20) NOT NULL
);

CREATE TABLE inventory (
    warehouse_code VARCHAR(20) NOT NULL,
    sku VARCHAR(20) NOT NULL,
    available_qty INTEGER NOT NULL CHECK (available_qty >= 0),
    reserved_qty INTEGER NOT NULL DEFAULT 0 CHECK (reserved_qty >= 0),
    reorder_level INTEGER NOT NULL DEFAULT 0 CHECK (reorder_level >= 0),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (warehouse_code, sku),
    FOREIGN KEY (warehouse_code) REFERENCES warehouses(warehouse_code),
    FOREIGN KEY (sku) REFERENCES products(sku)
);

CREATE TABLE orders (
    order_code VARCHAR(20) PRIMARY KEY,
    customer_code VARCHAR(20) NOT NULL,
    primary_site_code VARCHAR(20) NOT NULL,
    primary_warehouse_code VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_code VARCHAR(20) NOT NULL,
    sku VARCHAR(20) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
    PRIMARY KEY (order_code, sku),
    FOREIGN KEY (order_code) REFERENCES orders(order_code),
    FOREIGN KEY (sku) REFERENCES products(sku)
);

CREATE TABLE allocation_logs (
    id BIGSERIAL PRIMARY KEY,
    order_code VARCHAR(20) NOT NULL,
    sku VARCHAR(20) NOT NULL,
    site_code VARCHAR(20) NOT NULL,
    warehouse_code VARCHAR(20) NOT NULL,
    allocated_qty INTEGER NOT NULL CHECK (allocated_qty > 0),
    action VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory_audit (
    id BIGSERIAL PRIMARY KEY,
    request_code VARCHAR(40) NOT NULL,
    sku VARCHAR(20) NOT NULL,
    warehouse_code VARCHAR(20) NOT NULL,
    action VARCHAR(30) NOT NULL,
    delta_available INTEGER NOT NULL,
    delta_reserved INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
