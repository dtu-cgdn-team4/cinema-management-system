package com.cgdn.cinema.modules.booking.queue;

import java.time.Clock;
import java.time.Instant;
import com.cgdn.cinema.exception.BusinessException;
import com.cgdn.cinema.exception.ErrorCode;
import com.cgdn.cinema.infrastructure.messaging.RabbitConfig;
import com.cgdn.cinema.modules.booking.dto.response.SeatHoldResponse;
import com.cgdn.cinema.modules.booking.service.SeatHoldService;
import com.cgdn.cinema.modules.booking.service.SeatStatusBroadcaster;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

/**
 * Bước 3–4 của luồng đặt vé (architecture.md): một consumer xử lý lần lượt từng yêu cầu, ghi "đang giữ"
 * trong transaction, rồi đẩy trạng thái ghế mới qua WebSocket. Lỗi trả về trong kết quả, không ném ra
 * để tin nhắn không bị đưa lại hàng đợi.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SeatHoldConsumer {

    private final SeatHoldService seatHoldService;
    private final SeatStatusBroadcaster seatStatusBroadcaster;
    private final Clock clock;

    @RabbitListener(queues = RabbitConfig.SEAT_HOLD_QUEUE, concurrency = "1")
    public SeatHoldResult handle(SeatHoldCommand command) {
        if (Instant.now(clock).isAfter(command.deadline())) { // người gửi đã thôi chờ và báo lỗi cho khách
            return new SeatHoldResult(null, ErrorCode.SEAT_HOLD_UNAVAILABLE);
        }
        try {
            SeatHoldService.HoldOutcome outcome =
                    seatHoldService.holdSeats(command.showtimeId(), command.userId(), command.seatIds());
            seatStatusBroadcaster.publish(command.showtimeId(), outcome.released(),
                    outcome.response().seats().stream().map(SeatHoldResponse.HeldSeat::id).toList());
            return new SeatHoldResult(outcome.response(), null);
        } catch (BusinessException e) {
            return new SeatHoldResult(null, e.getErrorCode());
        } catch (RuntimeException e) {
            log.error("Lỗi xử lý yêu cầu giữ ghế {}", command, e);
            return new SeatHoldResult(null, ErrorCode.INTERNAL_ERROR);
        }
    }
}
