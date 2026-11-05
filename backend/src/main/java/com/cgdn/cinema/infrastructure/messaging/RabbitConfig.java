package com.cgdn.cinema.infrastructure.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/** RabbitMQ: hàng đợi yêu cầu giữ ghế (architecture.md, "Luồng đặt vé online"). */
@Configuration
public class RabbitConfig {

    public static final String SEAT_HOLD_QUEUE = "booking.seat-hold";

    /** Single active consumer: dù chạy nhiều instance, chỉ một consumer nhận tin nên yêu cầu được xử lý tuần tự. */
    @Bean
    public Queue seatHoldQueue() {
        return QueueBuilder.durable(SEAT_HOLD_QUEUE).singleActiveConsumer().build();
    }

    /** Tin nhắn dạng JSON, dùng ObjectMapper của Spring Boot (hỗ trợ LocalDateTime, record). */
    @Bean
    public MessageConverter messageConverter(ObjectMapper objectMapper) {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter(objectMapper);
        converter.setAlwaysConvertToInferredType(true);
        return converter;
    }
}
