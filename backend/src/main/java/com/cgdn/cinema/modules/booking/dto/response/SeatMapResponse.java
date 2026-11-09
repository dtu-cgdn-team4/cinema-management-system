package com.cgdn.cinema.modules.booking.dto.response;

import java.util.List;
import java.util.Map;
import com.cgdn.cinema.common.enums.SeatType;
import com.cgdn.cinema.modules.movie.dto.response.MovieResponse;
import com.cgdn.cinema.modules.showtime.dto.response.ShowtimeResponse;

/**
 * Sơ đồ ghế của một suất (SRS 6.2.2).
 * holdSecondsLeft: số giây còn lại của các ghế người xem đang giữ, null nếu không giữ ghế nào.
 */
public record SeatMapResponse(
        MovieResponse movie,
        ShowtimeResponse showtime,
        Map<SeatType, Long> prices,
        int maxSeats,
        List<Row> rows,
        Integer holdSecondsLeft) {

    public record Row(String name, List<Cell> seats) {
    }

    /** column: vị trí trên lưới, cột trống là lối đi. */
    public record Cell(Long id, String label, int number, int column, SeatType type, Availability status) {
    }

    /** MINE: ghế người xem đang giữ. TAKEN: người khác đang giữ hoặc đã thanh toán. */
    public enum Availability {
        AVAILABLE, TAKEN, MINE
    }
}
