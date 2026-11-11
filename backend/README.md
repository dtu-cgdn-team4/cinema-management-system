# Backend – Spring Boot

Code chia theo module nghiệp vụ trong `com.cgdn.cinema.modules`. Mỗi người làm trọn một module để tránh conflict.

## Bố cục chung

| Thư mục | Nội dung |
|---|---|
| `common/` | constants, enums, response chung (`ApiResponse<T>`), utils |
| `config/` | CORS, OpenAPI, Jackson, Scheduling |
| `security/` | Spring Security, JWT, Google OAuth2, khóa tài khoản sau 5 lần sai |
| `exception/` | `GlobalExceptionHandler`, `BusinessException`, `ErrorCode` |
| `infrastructure/` | tích hợp bên ngoài: messaging (RabbitMQ), websocket, mail, sms (Firebase), storage (Cloudinary), payment (PayPal), export (Excel, hóa đơn) |
| `modules/` | auth, user, movie, room, showtime, pricing, promotion, booking, payment, counter, ticket, loyalty, report |

## Bố cục một module

```text
modules/<ten-module>/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
│   ├── request/
│   └── response/
└── mapper/
```

Chỉ thêm thư mục riêng khi module cần, ví dụ `booking/queue/` (xử lý đặt vé qua message queue) và `booking/scheduler/` (nhả ghế giữ quá 10 phút).

## Resources

- `db/migration/`: Flyway áp dụng `V1__init_schema.sql` khi backend khởi động. Thay đổi schema tiếp theo dùng migration mới.
- `templates/mail/`: mẫu email vé QR, OTP

## Chạy backend với MySQL

Cần Java 17+, Maven 3.8+ và MySQL 8.0.16+ có thực thi `CHECK`.

1. Dùng tài khoản quản trị MySQL để tạo schema rỗng.

   ```sql
   CREATE DATABASE cinema_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Tạo tài khoản MySQL local dành cho backend. Cấp quyền tạo và thay đổi bảng để chạy Flyway, cùng quyền đọc/ghi trong schema `cinema_db`.
3. Từ thư mục `backend`, sao chép `.env.example` thành `.env` rồi điền thông tin tài khoản. Spring Boot nạp file `.env` dưới dạng Java Properties. Có thể đặt các biến trực tiếp trong môi trường để ghi đè giá trị trong file.
4. Chạy `mvn spring-boot:run`. Flyway áp dụng migration, sau đó Hibernate kiểm tra kiểu cột và mapping với `ddl-auto=validate`. Backend mặc định lắng nghe ở cổng 8080.

## Kiểm thử tích hợp

Tạo một database MySQL rỗng dành riêng cho test, ví dụ `cinema_test_local`, rồi cấp quyền tương tự như schema local. Đặt các biến kết nối tương ứng và chạy các lệnh sau trong PowerShell từ thư mục `backend`.

```powershell
$env:DB_NAME = 'cinema_test_local'
mvn test
mvn test
```

Test tích hợp chỉ chạy khi biến môi trường `DB_NAME` có tiền tố `cinema_test_`. Hai lần chạy kiểm tra khởi động trên database rỗng rồi khởi động lại với migration đã áp dụng. Dữ liệu kiểm thử được rollback.

## Chi tiết triển khai ERD

- Dùng `DECIMAL(15,2)` cho các cột tiền và mức giảm. Độ dài `VARCHAR` được chỉ định trong migration.
- `dat_ve.thanh_toan_luc` cho phép `NULL` để lưu đơn chưa thanh toán. `ghe_suat_chieu.nguoi_dung_id` cho phép `NULL` theo ERD. Điều kiện bắt buộc có người giữ ghế theo từng trạng thái cần nhóm chốt.
- `UNIQUE (suat_chieu_id, ghe_id)` giữ một dòng cho mỗi ghế trong mỗi suất chiếu. Luồng giữ và bán ghế cần cập nhật dòng đó trong transaction.
- Schema hiện hành gồm 16 bảng trong [ERD](../docs/database/cinema-management-erd.png). Thiết kế vé QR cần được chốt riêng.
