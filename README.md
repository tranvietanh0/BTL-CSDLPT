# Distributed Warehouse Demo

Demo CSDL phân tán cho đề tài **Hệ thống bán hàng trực tuyến đa kho**.

## Kiến trúc
- 3 site PostgreSQL: Bắc, Trung, Nam
- FastAPI + Swagger làm middleware/coordinator
- Dữ liệu nhân bản: `categories`, `products`, `warehouses`
- Dữ liệu phân mảnh theo site: `customers`, `inventory`, `orders`, `order_items`, `allocation_logs`, `inventory_audit`

## Chạy nhanh
1. Tạo môi trường Python và cài dependencies:
   - `pip install -r requirements.txt`
2. Tạo file `.env` từ `.env.example`
3. Khởi động database:
   - `docker compose up -d`
4. Chạy API:
   - `uvicorn app.main:app --reload`
5. Mở Swagger tại `http://localhost:8000/docs`
6. Gọi `POST /demo/seed`

## Các endpoint chính
- `GET /inventory/{sku}/global`
- `POST /inventory/quote-fulfillment`
- `POST /orders`
- `GET /orders/{order_code}`
- `POST /orders/demo-concurrency`
- `GET /reports/revenue-by-site`
- `GET /reports/top-products`
- `GET /reports/multi-warehouse-orders`

## Bộ demo đề xuất
1. `POST /demo/seed`
2. `GET /demo/health/distributed`
3. `GET /inventory/LAP-01/global`
4. `POST /inventory/quote-fulfillment`
5. `POST /orders`
6. `GET /orders/{order_code}`
7. `POST /orders/demo-concurrency`
