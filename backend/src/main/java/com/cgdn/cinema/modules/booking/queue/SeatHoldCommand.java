package com.cgdn.cinema.modules.booking.queue;

import java.time.Instant;
import java.util.List;

/**
 * Tin nhắn yêu cầu giữ ghế gửi vào hàng đợi booking.seat-hold.
 * deadline: lúc người gửi thôi chờ kết quả; consumer bỏ qua tin đã quá hạn để không giữ ghế cho khách đã nhận lỗi.
 */
public record SeatHoldCommand(Long showtimeId, Long userId, List<Long> seatIds, Instant deadline) {
}
