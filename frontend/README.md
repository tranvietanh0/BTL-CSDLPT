# Frontend demo React

Frontend React + Vite cho đồ án **CSDL phân tán đa kho**.

## Chạy local
1. Đảm bảo backend FastAPI đang chạy ở `http://127.0.0.1:8000`
2. Trong thư mục `frontend/` chạy:
   - `npm install`
   - `npm run dev`
3. Mở `http://127.0.0.1:5173`

## Các màn chính
- Dashboard
- Catalog & Inventory
- Fulfillment Quote
- Order Execution
- Reports & Concurrency

## Luồng demo nhanh
1. Seed dữ liệu từ Dashboard
2. Kiểm tra health 3 site
3. Tra SKU `LAP-01` trong Catalog & Inventory
4. Quote `LAP-01`, quantity `10`, region `north`
5. Tạo order với `CUS-N-01`
6. Xem order detail và allocation
7. Kiểm tra reports và chạy concurrency demo
