# Đồng thời và nhất quán tồn kho

## 1. Bài toán đặt ra

Trong hệ thống bán hàng đa kho, nhiều người dùng có thể đồng thời đặt cùng một sản phẩm. Nếu các transaction cùng đọc dữ liệu tồn kho trước khi có cơ chế khóa, hệ thống rất dễ gặp lỗi:

- mất cập nhật
- ghi đè giao dịch của nhau
- âm tồn kho
- báo cáo sai sau khi đồng bộ

Vì vậy, mục tiêu quan trọng của hệ thống là đảm bảo rằng:

- tồn kho không bao giờ nhỏ hơn 0
- một SKU không bị cấp phát vượt quá số lượng đang có
- request thất bại không để lại trạng thái dở dang

## 2. Khái niệm nhất quán trong bản demo

Nhất quán ở đây được hiểu theo nghĩa thực dụng cho:

- mỗi lần tạo đơn hàng phải bảo toàn ràng buộc `available_qty >= 0`
- số lượng đã giữ chỗ phải được phản ánh trong `reserved_qty`
- nếu giao dịch không hoàn thành, lượng đã giữ chỗ phải được trả lại
- log audit phải đủ để giải thích điều gì đã xảy ra

## 3. Mô hình xử lý tồn kho

Bảng `inventory` sử dụng hai trường quan trọng:

- `available_qty`: số lượng còn có thể bán ngay
- `reserved_qty`: số lượng đang được giữ chỗ bởi transaction đang xử lý

### Lợi ích của mô hình này

- tách bạch “còn hàng vật lý” và “đã được transaction tạm chiếm”
- giúp mô phỏng logic reserve / commit / release gần với hệ thống thật

## 4. Cơ chế khóa được áp dụng

Hệ thống dùng:

- `SELECT ... FOR UPDATE`

### Ý nghĩa

Khi transaction A đang đọc và chuẩn bị cập nhật một dòng tồn kho, dòng đó bị khóa ở mức row-level. Nếu transaction B đến sau muốn đọc-cập nhật cùng dòng theo cách tương tự, transaction B phải chờ.

### Tác dụng

- tránh hai transaction cùng lấy một lượng hàng từ cùng một dòng dữ liệu tại cùng thời điểm
- giúp loại bỏ race condition cơ bản gây âm kho

### 4.1. Isolation level

Hệ thống sử dụng transaction của PostgreSQL kết hợp:

```text
SELECT ... FOR UPDATE
```

để khóa dòng tồn kho đang được cập nhật.

Ý nghĩa:

- tránh dirty read
- tránh nhiều request cùng cập nhật một dòng inventory
- giảm race condition gây âm tồn kho

Trong phạm vi demo, hệ thống không sử dụng isolation level cao như:

```text
SERIALIZABLE
```

vì:

- chi phí xử lý cao hơn
- không cần thiết cho bài toán minh họa đồ án

Giải pháp hiện tại đủ để mô phỏng tính đồng thời và nhất quán tồn kho.

## 5. Chu trình reserve / commit / release

## 5.1. Reserve

1. khóa bản ghi tồn kho bằng `FOR UPDATE`
2. kiểm tra `available_qty >= requested_qty`
3. giảm `available_qty`
4. tăng `reserved_qty`
5. ghi `inventory_audit` với action `reserve`

## 5.2. Commit

1. sau khi order được tạo thành công
2. giảm lại `reserved_qty`
3. ghi `allocation_logs`
4. ghi `inventory_audit` với action `commit`

## 5.3. Release

Nếu transaction thất bại ở giữa:

1. tăng lại `available_qty`
2. giảm `reserved_qty`
3. ghi `inventory_audit` với action `release`

### Sơ đồ xử lý

```mermaid
flowchart TD
    A[Begin transaction]

    A --> B[SELECT inventory<br/>FOR UPDATE]

    B --> C{available_qty<br/>đủ?}

    C -- No --> D[Fail request<br/>không đủ tồn kho]

    C -- Yes --> E[Reserve<br/>available_qty--<br/>reserved_qty++]

    E --> F[Ghi inventory_audit<br/>action = reserve]

    F --> G[Create order]

    G --> H[Create order_items]

    H --> I{Các bước thành công?}

    I -- Yes --> J[Commit<br/>reserved_qty--]

    J --> K[Ghi allocation_logs]

    K --> L[Ghi inventory_audit<br/>action = commit]

    L --> M[Transaction complete]

    I -- No --> N[Release<br/>available_qty++<br/>reserved_qty--]

    N --> O[Ghi inventory_audit<br/>action = release]

    O --> P[Rollback transaction]
```

## 6. Kịch bản đồng thời trong bản demo

Endpoint dùng để minh họa:

- `POST /orders/demo-concurrency`

### Ý tưởng

Hai khách hàng cùng đặt một SKU trong gần như cùng một thời điểm.

Ví dụ:

- khách 1: `CUS-N-02`
- khách 2: `CUS-N-03`
- SKU: `PHN-01`
- quantity: `6`

### Kỳ vọng

Khi hai request cùng đặt một SKU gần như đồng thời, hệ thống sẽ sử dụng:

```text
SELECT ... FOR UPDATE
```

để khóa row inventory tương ứng.

Do đó:

- request đến trước sẽ giữ được lock và thực hiện reserve trước
- request đến sau phải chờ transaction đầu hoàn tất rồi mới đọc lại tồn kho

Kết quả có thể xảy ra:

#### Trường hợp 1: Tồn kho toàn hệ thống vẫn đủ

Cả hai request đều thành công.

Ví dụ:

```text
available_qty toàn hệ thống = 20
```

Hai khách cùng đặt:

```text
6 + 6 = 12
```

Kết quả:

- request 1 thành công
- request 2 vẫn thành công
- tồn kho còn lại hợp lệ

---

#### Trường hợp 2: Tồn kho không còn đủ

Request đến trước reserve thành công.

Request đến sau sau khi đọc lại inventory:

```text
available_qty < requested_qty
```

sẽ:

```text
fail request
```

hoặc trả về:

```text
shortfall_qty
```

nếu hệ thống không thể fulfillment đủ số lượng.

---

Trong mọi trường hợp, hệ thống cần đảm bảo:

- không xảy ra overselling
- `available_qty` không bị âm
- tổng tồn kho cuối cùng luôn nhất quán
- không có stock bị treo nhờ cơ chế reserve / release

## 7. Vai trò của inventory_audit

`inventory_audit` cho phép chỉ ra:

- request nào đã reserve
- request nào đã commit
- request nào đã release
- thứ tự thay đổi dữ liệu

Nhờ đó, phần “đồng thời và nhất quán” không chỉ là bằng lý thuyết, mà còn có thể chứng minh bằng log dữ liệu thật.

## 8. Sơ đồ tuần tự của concurrency demo

```mermaid
sequenceDiagram
    participant R1 as Request 1
    participant API as Coordinator
    participant DB as Inventory row
    participant R2 as Request 2

    R1->>API: Create order
    API->>DB: SELECT ... FOR UPDATE
    DB-->>API: Lock granted

    API->>DB: Check available_qty
    API->>DB: Reserve stock<br/>available-- reserved++

    R2->>API: Create order
    API->>DB: SELECT ... FOR UPDATE
    DB-->>API: Wait (row locked by R1)

    API->>DB: Create order + order_items
    API->>DB: Commit or release
    DB-->>API: Unlock row

    API->>DB: R2 acquires lock
    API->>DB: Re-check available_qty

    alt Inventory đủ
        API->>DB: Reserve stock
        API->>DB: Commit transaction
    else Inventory không đủ
        API-->>R2: Fail request
    end
```

## 9. Nhận xét về mức độ hoàn chỉnh

Bản demo hiện tại không triển khai distributed transaction manager hoàn chỉnh kiểu 2PC thực thụ. Tuy nhiên, với phạm vi đự án, giải pháp đang dùng là hợp lý vì:

- có khóa mức dòng
- có reserve/commit/release rõ ràng
- có audit log
- có thể chứng minh không âm kho bằng demo thực tế

Nói cách khác, hệ thống đã đáp ứng tốt yêu cầu “mô phỏng giao dịch hoặc đồng thời trong môi trường phân tán” của đề bài.
