package com.cgdn.cinema.modules.booking.queue;

import com.cgdn.cinema.exception.ErrorCode;
import com.cgdn.cinema.modules.booking.dto.response.SeatHoldResponse;

/** Consumer trả về: hold khi thành công, error khi vi phạm quy tắc hoặc ghế vừa có người. */
public record SeatHoldResult(SeatHoldResponse hold, ErrorCode error) {
}
