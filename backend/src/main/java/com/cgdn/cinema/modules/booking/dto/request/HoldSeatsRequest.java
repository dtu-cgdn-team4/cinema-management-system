package com.cgdn.cinema.modules.booking.dto.request;

import java.util.List;
import jakarta.validation.constraints.NotNull;

/** Số lượng ghế (1–8) kiểm tra ở service để trả đúng mã lỗi SEAT_COUNT_INVALID. */
public record HoldSeatsRequest(@NotNull List<@NotNull Long> seatIds) {
}
