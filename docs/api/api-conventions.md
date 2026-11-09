# Quy ước API

REST JSON, tài liệu tự sinh bằng SpringDoc tại `http://localhost:8080/swagger-ui/index.html`. Swagger là nơi tra danh sách endpoint; tài liệu này chỉ ghi quy ước chung.

## Đường dẫn

- Tiền tố `/api/v1`.
- Danh từ số nhiều, kebab-case, tiếng Anh: `/api/v1/movies`, `/api/v1/showtimes/{id}/seats`.
- Chức năng theo vai trò dùng tiền tố: `/api/v1/admin/...` cho admin, `/api/v1/staff/...` cho nhân viên. Đường dẫn còn lại dành cho khách.
- Hành động không phải CRUD dùng động từ ở cuối: `POST /api/v1/bookings/{id}/confirm`.
- Rạp là tài nguyên `/api/v1/cinemas`. Dữ liệu theo rạp lọc bằng query `cinemaId`: `GET /api/v1/movies/{movieId}/showtimes?cinemaId=1&date=2026-11-05`. Response suất chiếu kèm `cinemaId`, `cinemaName` để giao diện không phải gọi thêm.

## Dữ liệu

- Field JSON dạng `camelCase`. Ngày giờ ISO-8601 theo giờ Việt Nam: `2026-11-05T19:30:00`.
- Tiền là số nguyên VND.
- Mọi response bọc trong `ApiResponse`:

```json
{ "success": true, "data": { }, "message": null, "errorCode": null }
```

- Danh sách có phân trang dùng `?page=0&size=20&sort=startTime,asc`, `data` là `PageResponse` gồm `items`, `page`, `size`, `totalItems`, `totalPages`.

## Lỗi

- `GlobalExceptionHandler` trả `success: false`, `errorCode` là hằng số trong `ErrorCode` (ví dụ `SEAT_ALREADY_TAKEN`, `SEAT_HOLD_EXPIRED`, `SINGLE_SEAT_GAP`), `message` tiếng Việt hiển thị được cho người dùng.
- HTTP status: 400 dữ liệu sai, 401 chưa đăng nhập, 403 không đủ quyền, 404 không tìm thấy, 409 xung đột trạng thái (ghế đã có người, hết hạn giữ ghế), 500 lỗi hệ thống.
- Validate request bằng Jakarta Validation (`@NotBlank`, `@Size`…) trên DTO request.

## Xác thực

- Header `Authorization: Bearer <JWT>`, ký HS256 bằng `JWT_SECRET` (ít nhất 32 ký tự).
- Claim `sub` là `nguoi_dung.id`, claim `role` là vai trò: `KHACH_HANG`, `NHAN_VIEN`, `ADMIN`. Phân quyền theo bảng tác nhân mục 5.1 của SRS.
- Token sai hoặc hết hạn được coi như chưa đăng nhập: trang công khai vẫn xem được, đường dẫn cần đăng nhập trả 401 `UNAUTHORIZED`.
- Phiên hết hạn sau 30 phút không thao tác.
