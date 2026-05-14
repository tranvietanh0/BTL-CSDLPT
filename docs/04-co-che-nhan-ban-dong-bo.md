# Cơ chế nhân bản và đồng bộ dữ liệu

## 1. Mục tiêu của cơ chế nhân bản

Nhân bản dữ liệu trong hệ phân tán nhằm giải quyết ba bài toán chính:

- tăng tốc độ đọc dữ liệu dùng chung
- giảm số lần truy vấn xuyên site
- giữ cho các site có cùng hiểu biết về catalog sản phẩm và kho

Tuy nhiên, không phải bảng nào cũng nên nhân bản. Nếu nhân bản cả các bảng giao dịch như `orders` hay `inventory`, hệ thống sẽ tốn nhiều công sức đồng bộ và dễ phát sinh xung đột.

## 2. Dữ liệu được nhân bản trong đồ án

Trong hệ thống demo hiện tại, các bảng sau được xem là dữ liệu dùng chung và tồn tại ở cả 3 site:

- `categories`
- `products`
- `warehouses`

## 3. Vì sao chọn đúng 3 bảng này

## 3.1. categories

- thường dùng để hiển thị và phân loại sản phẩm
- không mang tính giao dịch thời gian thực

## 3.2. products

- là danh mục sản phẩm toàn hệ thống
- mọi site đều cần hiểu cùng một SKU là cùng một sản phẩm
- dùng chung cho tồn kho, báo cáo, đơn hàng, giao diện frontend

## 3.3. warehouses

- dùng để biết kho nào thuộc site nào
- cần cho mọi site khi hiển thị allocation hoặc inventory global

## 4. Dữ liệu không nhân bản

Các bảng sau không được nhân bản toàn phần:

- `customers`
- `inventory`
- `orders`
- `order_items`
- `allocation_logs`
- `inventory_audit`

### Lý do

Đây là dữ liệu:

- cập nhật thường xuyên
- mang tính cục bộ cao
- dễ xung đột nếu sao chép toàn phần
- phù hợp hơn với mô hình phân mảnh ngang

## 5. Cơ chế đồng bộ trong bản demo

Tập trung vào minh họa logic phân tán, bản demo hiện tại không triển khai replication engine tự động giữa các site. Thay vào đó, đồng bộ được mô phỏng theo hướng:

- dữ liệu dùng chung được seed giống nhau ở cả 3 site
- coordinator luôn giả định catalog là nhất quán giữa các site
- truy vấn toàn hệ thống được tạo bằng cách gọi từng site rồi tổng hợp kết quả
- giao dịch cập nhật tồn kho được điều phối từ middleware

Điều này phù hợp vì nhấn mạnh **logic phân tán**, không sa đà vào cấu hình replication chuyên sâu của một DBMS cụ thể.

## 5.1. Chiến lược replication được sử dụng

Trong hệ thống thực tế, replication thường được triển khai theo hai hướng:

- synchronous replication: cơ chế đồng bộ theo thời gian thực. Khi dữ liệu được ghi tại một site, transaction chỉ được xem là hoàn tất nếu các bản sao ở site khác cũng ghi thành công.

- asynchronous replication: cơ chế đồng bộ không tức thời. Site chính sẽ ghi dữ liệu trước, sau đó việc cập nhật sang các site khác được thực hiện ở thời điểm sau.

Trong phạm vi dự án, hệ thống sử dụng cách tiếp cận đơn giản hơn:

### Logical asynchronous replication (giả lập)

Ý tưởng:

- dữ liệu dùng chung (`products`, `categories`, `warehouses`) được seed giống nhau ở cả 3 site
- coordinator giả định catalog dữ liệu luôn nhất quán
- không triển khai replication engine thời gian thực giữa PostgreSQL

Lý do lựa chọn:

- phù hợp phạm vi đồ án
- tập trung minh họa logic phân tán
- tránh phụ thuộc DBMS-specific replication

Hạn chế:

- thay đổi catalog chưa tự động lan sang site khác
- cần reseed hoặc cập nhật thủ công nếu dữ liệu shared thay đổi

## 6. Đồng bộ logic thông qua middleware

FastAPI middleware đóng vai trò coordinator ở giữa frontend và 3 site PostgreSQL.

### Coordinator thực hiện các nhiệm vụ sau

1. gửi truy vấn tới nhiều site
2. gom kết quả về một response chung
3. tính toán allocation khi một site không đủ hàng
4. giữ chỗ tồn kho bằng reserve trước khi commit
5. release phần đã reserve nếu transaction không hoàn tất

### Sơ đồ vai trò của coordinator

```mermaid
flowchart TD
    FE[Frontend React] --> API[FastAPI Coordinator]
    API --> N[PostgreSQL North]
    API --> C[PostgreSQL Central]
    API --> S[PostgreSQL South]

    API --> OUT[Unified response cho người dùng]
```

## 7. Đồng bộ trong truy vấn đọc và truy vấn ghi

## 7.1. Truy vấn đọc

Ví dụ tra cứu tồn kho toàn hệ thống:

- dữ liệu được đọc cục bộ ở mỗi site
- coordinator tổng hợp kết quả
- không cần sao chép bảng `inventory` sang site khác

### Sơ đồ truy vấn đọc phân tán

```mermaid
flowchart TD
    A[Frontend gửi request<br/>GET /inventory/LAP-01/global]

    A --> B[FastAPI Coordinator]

    B --> C[Query site north]
    B --> D[Query site central]
    B --> E[Query site south]

    C --> C1[Đọc inventory local<br/>SELECT sku = LAP-01]
    D --> D1[Đọc inventory local<br/>SELECT sku = LAP-01]
    E --> E1[Đọc inventory local<br/>SELECT sku = LAP-01]

    C1 --> F[Partial result]
    D1 --> F
    E1 --> F

    F --> G[Tổng hợp kết quả<br/>aggregate available + reserved]

    G --> H[Unified response<br/>trả về cho frontend]
```

## 7.2. Truy vấn ghi

Ví dụ tạo đơn hàng từ nhiều kho:

- coordinator reserve số lượng ở từng site
- ghi order ở site xử lý chính
- ghi allocation logs ở site tương ứng
- commit thành công ở các site liên quan
- nếu lỗi thì rollback và release phần đã reserve

### Sơ đồ truy vấn ghi phân tán

```mermaid
flowchart TD
    A[Frontend gửi request<br/>POST /orders]

    A --> B[FastAPI Coordinator]

    B --> C[Quote fulfillment<br/>xác định site cấp hàng]

    C --> D[Reserve tồn kho<br/>ở từng site liên quan]

    D --> E{Reserve thành công?}

    E -- No --> F[Release phần đã reserve]
    F --> G[Rollback request]
    G --> H[Trả lỗi cho frontend]

    E -- Yes --> I[Ghi orders<br/>ở site xử lý chính]

    I --> J[Ghi order_items]

    J --> K[Ghi allocation_logs<br/>ở từng site cấp hàng]

    K --> L{Các bước thành công?}

    L -- No --> M[Rollback transaction]
    M --> N[Release reserved_qty<br/>khôi phục available_qty]
    N --> H

    L -- Yes --> O[Commit transaction<br/>ở các site liên quan]

    O --> P[Inventory cập nhật thành công]
    P --> Q[Trả order response]
```

## 8. Ưu điểm và hạn chế của cách làm hiện tại

### Ưu điểm

- dễ cài đặt
- phù hợp cho đồ án và demo trên máy cá nhân
- dễ giải thích phân biệt local data và shared data
- dễ kiểm soát luồng đọc/ghi giữa các site

### Hạn chế

- chưa có replication engine thật sự theo thời gian thực
- chưa có cơ chế tự đồng bộ khi catalog thay đổi
- chưa có distributed transaction manager hoàn chỉnh kiểu 2PC thực thụ

Tuy vậy, với phạm vi dự án, mô hình này là hợp lý vì vẫn làm nổi bật các khái niệm quan trọng của cơ sở dữ liệu phân tán.
