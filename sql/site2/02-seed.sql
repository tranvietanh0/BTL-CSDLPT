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
('WH-CENTRAL-01', 'central', 'Kho Đà Nẵng', 'Đà Nẵng', 'central', TRUE)
ON CONFLICT (warehouse_code) DO UPDATE SET site_code = EXCLUDED.site_code, warehouse_name = EXCLUDED.warehouse_name, city = EXCLUDED.city, region_code = EXCLUDED.region_code, is_active = EXCLUDED.is_active;

INSERT INTO customers (customer_code, full_name, phone, email, city, region_code) VALUES
('CUS-C-01', 'Phạm Minh Trung', '0902000001', 'trung1@example.com', 'Đà Nẵng', 'central'),
('CUS-C-02', 'Đặng Thị Ngọc', '0902000002', 'ngoc2@example.com', 'Huế', 'central'),
('CUS-C-03', 'Hoàng Gia Bảo', '0902000003', 'bao3@example.com', 'Quảng Nam', 'central')
ON CONFLICT (customer_code) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, email = EXCLUDED.email, city = EXCLUDED.city, region_code = EXCLUDED.region_code;

INSERT INTO inventory (warehouse_code, sku, available_qty, reserved_qty, reorder_level) VALUES
('WH-CENTRAL-01', 'LAP-01', 0, 0, 2),
('WH-CENTRAL-01', 'PHN-01', 5, 0, 3),
('WH-CENTRAL-01', 'MSE-01', 3, 0, 2),
('WH-CENTRAL-01', 'KEY-01', 4, 0, 2),
('WH-CENTRAL-01', 'MON-01', 2, 0, 1),
('WH-CENTRAL-01', 'TAB-01', 6, 0, 2)
ON CONFLICT (warehouse_code, sku) DO UPDATE SET available_qty = EXCLUDED.available_qty, reserved_qty = EXCLUDED.reserved_qty, reorder_level = EXCLUDED.reorder_level, updated_at = CURRENT_TIMESTAMP;

INSERT INTO orders (order_code, customer_code, primary_site_code, primary_warehouse_code, status, total_amount, created_at) VALUES
('ORD-C-001', 'CUS-C-01', 'central', 'WH-CENTRAL-01', 'completed', 25000000, '2026-04-05 10:00:00'),
('ORD-C-002', 'CUS-C-02', 'central', 'WH-CENTRAL-01', 'completed', 12950000, '2026-04-11 15:45:00')
ON CONFLICT (order_code) DO UPDATE SET customer_code = EXCLUDED.customer_code, primary_site_code = EXCLUDED.primary_site_code, primary_warehouse_code = EXCLUDED.primary_warehouse_code, status = EXCLUDED.status, total_amount = EXCLUDED.total_amount, created_at = EXCLUDED.created_at;

INSERT INTO order_items (order_code, sku, quantity, unit_price, line_total) VALUES
('ORD-C-001', 'TAB-01', 2, 12500000, 25000000),
('ORD-C-002', 'MON-01', 2, 5900000, 11800000),
('ORD-C-002', 'KEY-01', 1, 1200000, 1200000)
ON CONFLICT (order_code, sku) DO UPDATE SET quantity = EXCLUDED.quantity, unit_price = EXCLUDED.unit_price, line_total = EXCLUDED.line_total;
