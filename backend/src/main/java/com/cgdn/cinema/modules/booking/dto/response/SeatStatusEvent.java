package com.cgdn.cinema.modules.booking.dto.response;

import java.util.List;
import com.cgdn.cinema.modules.booking.dto.response.SeatMapResponse.Availability;

/**
 * Tin đẩy qua WebSocket kênh /topic/showtimes/{showtimeId}/seats khi ghế đổi trạng thái.
 * status chỉ là AVAILABLE hoặc TAKEN; trình duyệt tự biết ghế nào của mình.
 */
public record SeatStatusEvent(Long showtimeId, List<Change> seats) {

    public record Change(Long seatId, Availability status) {
    }
}
