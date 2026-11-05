package com.cgdn.cinema.modules.booking.queue;

import com.cgdn.cinema.exception.BusinessException;
import com.cgdn.cinema.exception.ErrorCode;
import com.cgdn.cinema.infrastructure.messaging.RabbitConfig;
import com.cgdn.cinema.modules.booking.dto.response.SeatHoldResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;

/** Đẩy yêu cầu giữ ghế vào hàng đợi và chờ consumer trả kết quả (request/reply). */
@Slf4j
@Component
@RequiredArgsConstructor
public class SeatHoldProducer {

    private final RabbitTemplate rabbitTemplate;

    public SeatHoldResponse send(SeatHoldCommand command) {
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
