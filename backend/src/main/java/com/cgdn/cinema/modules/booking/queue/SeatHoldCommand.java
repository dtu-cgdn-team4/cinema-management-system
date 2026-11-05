package com.cgdn.cinema.modules.booking.queue;

import java.util.List;

/** Tin nhắn yêu cầu giữ ghế gửi vào hàng đợi booking.seat-hold. */
public record SeatHoldCommand(Long showtimeId, String sessionId, List<Long> seatIds) {
}
