package com.cgdn.cinema.modules.booking.dto.response;

import java.util.List;
import com.cgdn.cinema.common.enums.SeatType;

/** Kết quả giữ ghế. Giá chỉ để hiển thị, chốt lúc khách xác nhận thanh toán (Q&A #25). */
public record SeatHoldResponse(Long showtimeId, List<HeldSeat> seats, long total, int holdSecondsLeft) {

    public record HeldSeat(Long id, String label, SeatType type, long price) {
    }
}
