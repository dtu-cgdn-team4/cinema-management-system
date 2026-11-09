package com.cgdn.cinema.modules.booking.queue;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import com.cgdn.cinema.exception.BusinessException;
import com.cgdn.cinema.exception.ErrorCode;
import com.cgdn.cinema.infrastructure.messaging.RabbitConfig;
import com.cgdn.cinema.modules.booking.dto.response.SeatHoldResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;

/** Đẩy yêu cầu giữ ghế vào hàng đợi và chờ consumer trả kết quả (request/reply). */
@Slf4j
@Component
public class SeatHoldProducer {

    private final RabbitTemplate rabbitTemplate;
    private final Clock clock;
    private final Duration replyTimeout;

    public SeatHoldProducer(RabbitTemplate rabbitTemplate, Clock clock,
                            @Value("${spring.rabbitmq.template.reply-timeout}") Duration replyTimeout) {
        this.rabbitTemplate = rabbitTemplate;
        this.clock = clock;
        this.replyTimeout = replyTimeout;
    }

    public SeatHoldResponse send(Long showtimeId, Long userId, List<Long> seatIds) {
        SeatHoldCommand command = new SeatHoldCommand(showtimeId, userId, seatIds,
                Instant.now(clock).plus(replyTimeout));
        SeatHoldResult result;
        try {
            result = rabbitTemplate.convertSendAndReceiveAsType(
                    "", RabbitConfig.SEAT_HOLD_QUEUE, command, new ParameterizedTypeReference<SeatHoldResult>() {
                    });
        } catch (AmqpException e) {
            log.error("Không gửi được yêu cầu giữ ghế vào RabbitMQ", e);
            throw new BusinessException(ErrorCode.SEAT_HOLD_UNAVAILABLE);
        }
        if (result == null) { // hết thời gian chờ (spring.rabbitmq.template.reply-timeout)
            throw new BusinessException(ErrorCode.SEAT_HOLD_UNAVAILABLE);
        }
        if (result.error() != null) {
            throw new BusinessException(result.error());
        }
        return result.hold();
    }
}
