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

- `db/migration/`: script Flyway `V1__init.sql`, `V2__...`
- `templates/mail/`: mẫu email vé QR, OTP

## Chạy

- Đầy đủ: cần MySQL (database `cinema_db`) và RabbitMQ. Chép `.env.example` ở gốc repo thành `.env`, rồi `./mvnw spring-boot:run`.
- Chạy thử không cài MySQL và RabbitMQ: `./mvnw spring-boot:test-run -Dspring-boot.run.profiles=h2` (H2 trong bộ nhớ, broker AMQP nhúng Apache Qpid, có dữ liệu mẫu).
- Test: `./mvnw test` (H2 và broker nhúng, chạy cả migration và dữ liệu mẫu).
- WebSocket STOMP: `ws://localhost:8080/ws`, trạng thái ghế ở kênh `/topic/showtimes/{id}/seats`.
- Swagger: http://localhost:8080/swagger-ui/index.html
