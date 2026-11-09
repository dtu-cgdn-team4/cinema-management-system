package com.cgdn.cinema.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "Dữ liệu không hợp lệ"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập để tiếp tục"),
    FORBIDDEN(HttpStatus.FORBIDDEN, "Bạn không có quyền thực hiện thao tác này"),
    NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy đường dẫn"),
    MOVIE_NOT_FOUND(HttpStatus.NOT_FOUND, "Không tìm thấy phim đang chiếu"),
    SHOWTIME_NOT_FOUND(HttpStatus.NOT_FOUND, "Suất chiếu không tồn tại hoặc đã bắt đầu"),
    SEAT_COUNT_INVALID(HttpStatus.BAD_REQUEST, "Mỗi lần đặt chọn từ 1 đến 8 ghế"),
    SEAT_NOT_FOUND(HttpStatus.BAD_REQUEST, "Ghế không thuộc phòng chiếu của suất này"),
    SINGLE_SEAT_GAP(HttpStatus.BAD_REQUEST, "Vui lòng không để trống 1 ghế lẻ sát ghế bạn chọn"),
    SEAT_ALREADY_TAKEN(HttpStatus.CONFLICT, "Ghế bạn chọn vừa có người đặt, vui lòng chọn ghế khác"),
    SEAT_HOLD_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "Hệ thống giữ ghế đang bận, vui lòng thử lại"),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi hệ thống, vui lòng thử lại sau");

    private final HttpStatus status;
    private final String message;
}
