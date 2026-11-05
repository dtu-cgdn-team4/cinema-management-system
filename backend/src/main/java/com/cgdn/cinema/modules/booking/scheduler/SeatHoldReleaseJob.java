package com.cgdn.cinema.modules.booking.scheduler;

import java.util.List;
import java.util.concurrent.TimeUnit;
import com.cgdn.cinema.modules.booking.service.SeatHoldService;
import com.cgdn.cinema.modules.booking.service.SeatStatusBroadcaster;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/** Bước 7 (architecture.md): định kỳ nhả ghế "đang giữ" đã quá hạn và đẩy cập nhật qua WebSocket. */
@Component
@RequiredArgsConstructor
public class SeatHoldReleaseJob {

    private final SeatHoldService seatHoldService;
    private final SeatStatusBroadcaster seatStatusBroadcaster;

    @Scheduled(fixedDelay = 10, timeUnit = TimeUnit.SECONDS)
    public void releaseExpiredHolds() {
        seatHoldService.releaseExpiredHolds()
                .forEach((showtimeId, seatIds) -> seatStatusBroadcaster.publish(showtimeId, seatIds, List.of()));
    }
}
