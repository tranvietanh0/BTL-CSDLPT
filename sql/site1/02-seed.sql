INSERT INTO categories (category_code, name, description) VALUES
('LAP', 'Laptop', 'Máy tính xách tay'),
('PHN', 'Điện thoại', 'Điện thoại thông minh'),
('ACC', 'Phụ kiện', 'Phụ kiện công nghệ')
ON CONFLICT (category_code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

INSERT INTO products (sku, category_code, name, price, is_active) VALUES
('LAP-01', 'LAP', 'Laptop Pro 14', 32000000, TRUE),
('PHN-01', 'PHN', 'Phone X', 18000000, TRUE),
('MSE-01', 'ACC', 'Chuột không dây', 450000, TRUE),
('KEY-01', 'ACC', 'Bàn phím cơ', 1200000, TRUE),
('MON-01', 'ACC', 'Màn hình 27 inch', 5900000, TRUE),
('TAB-01', 'PHN', 'Tablet Air', 12500000, TRUE)
ON CONFLICT (sku) DO UPDATE SET category_code = EXCLUDED.category_code, name = EXCLUDED.name, price = EXCLUDED.price, is_active = EXCLUDED.is_active;

INSERT INTO warehouses (warehouse_code, site_code, warehouse_name, city, region_code, is_active) VALUES
('WH-NORTH-01', 'north', 'Kho Hà Nội', 'Hà Nội', 'north', TRUE)
ON CONFLICT (warehouse_code) DO UPDATE SET site_code = EXCLUDED.site_code, warehouse_name = EXCLUDED.warehouse_name, city = EXCLUDED.city, region_code = EXCLUDED.region_code, is_active = EXCLUDED.is_active;

INSERT INTO customers (customer_code, full_name, phone, email, city, region_code) VALUES
('CUS-N-01', 'Nguyễn Văn Bắc', '0901000001', 'bac1@example.com', 'Hà Nội', 'north'),
('CUS-N-02', 'Trần Thu Hà', '0901000002', 'ha2@example.com', 'Hải Phòng', 'north'),
('CUS-N-03', 'Lê Quang Minh', '0901000003', 'minh3@example.com', 'Quảng Ninh', 'north')
ON CONFLICT (customer_code) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, email = EXCLUDED.email, city = EXCLUDED.city, region_code = EXCLUDED.region_code;

INSERT INTO inventory (warehouse_code, sku, available_qty, reserved_qty, reorder_level) VALUES
('WH-NORTH-01', 'LAP-01', 2, 0, 2),
('WH-NORTH-01', 'PHN-01', 10, 0, 3),
('WH-NORTH-01', 'MSE-01', 0, 0, 2),
('WH-NORTH-01', 'KEY-01', 6, 0, 2),
('WH-NORTH-01', 'MON-01', 1, 0, 1),
('WH-NORTH-01', 'TAB-01', 4, 0, 1)
ON CONFLICT (warehouse_code, sku) DO UPDATE SET available_qty = EXCLUDED.available_qty, reserved_qty = EXCLUDED.reserved_qty, reorder_level = EXCLUDED.reorder_level, updated_at = CURRENT_TIMESTAMP;

INSERT INTO orders (order_code, customer_code, primary_site_code, primary_warehouse_code, status, total_amount, created_at) VALUES
('ORD-N-001', 'CUS-N-01', 'north', 'WH-NORTH-01', 'completed', 36000000, '2026-04-01 09:00:00'),
('ORD-N-002', 'CUS-N-02', 'north', 'WH-NORTH-01', 'completed', 18450000, '2026-04-10 14:30:00')
ON CONFLICT (order_code) DO UPDATE SET customer_code = EXCLUDED.customer_code, primary_site_code = EXCLUDED.primary_site_code, primary_warehouse_code = EXCLUDED.primary_warehouse_code, status = EXCLUDED.status, total_amount = EXCLUDED.total_amount, created_at = EXCLUDED.created_at;

INSERT INTO order_items (order_code, sku, quantity, unit_price, line_total) VALUES
('ORD-N-001', 'LAP-01', 1, 32000000, 32000000),
('ORD-N-001', 'KEY-01', 2, 1200000, 2400000),
('ORD-N-001', 'MSE-01', 1, 450000, 450000),
('ORD-N-002', 'PHN-01', 1, 18000000, 18000000),
('ORD-N-002', 'MSE-01', 1, 450000, 450000)
ON CONFLICT (order_code, sku) DO UPDATE SET quantity = EXCLUDED.quantity, unit_price = EXCLUDED.unit_price, line_total = EXCLUDED.line_total;
