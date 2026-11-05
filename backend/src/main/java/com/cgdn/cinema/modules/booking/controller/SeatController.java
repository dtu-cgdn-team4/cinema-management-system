package com.cgdn.cinema.modules.booking.controller;

import com.cgdn.cinema.common.response.ApiResponse;
import com.cgdn.cinema.modules.booking.dto.request.HoldSeatsRequest;
import com.cgdn.cinema.modules.booking.dto.response.SeatHoldResponse;
import com.cgdn.cinema.modules.booking.dto.response.SeatMapResponse;
import com.cgdn.cinema.modules.booking.service.SeatHoldService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/showtimes/{showtimeId}/seats")
@RequiredArgsConstructor
public class SeatController {

    /** Mã phiên trình duyệt. ponytail: thay bằng người dùng trong JWT khi có đăng nhập. */
    public static final String SESSION_HEADER = "X-Booking-Session";

    private final SeatHoldService seatHoldService;

    /** Sơ đồ ghế; suất không tồn tại hoặc đã bắt đầu trả 404 SHOWTIME_NOT_FOUND. */
    @GetMapping
    public ApiResponse<SeatMapResponse> getSeatMap(
            @PathVariable Long showtimeId,
            @RequestHeader(value = SESSION_HEADER, required = false) String sessionId) {
        return ApiResponse.ok(seatHoldService.getSeatMap(showtimeId, sessionId));
    }

    /**
     * Giữ ghế 10 phút qua hàng đợi RabbitMQ; trạng thái mới được đẩy qua WebSocket /topic/showtimes/{id}/seats.
     * Lỗi: SEAT_COUNT_INVALID, SEAT_NOT_FOUND, SINGLE_SEAT_GAP (400), SEAT_ALREADY_TAKEN (409),
     * SEAT_HOLD_UNAVAILABLE (503).
     */
    @PostMapping("/hold")
    public ApiResponse<SeatHoldResponse> holdSeats(
            @PathVariable Long showtimeId,
            @RequestHeader(SESSION_HEADER) String sessionId,
            @Valid @RequestBody HoldSeatsRequest request) {
        return ApiResponse.ok(seatHoldService.requestHold(showtimeId, sessionId, request.seatIds()));
    }
}
