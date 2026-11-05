package com.cgdn.cinema;

import org.springframework.boot.SpringApplication;

/**
 * Chạy thử không cần cài RabbitMQ và MySQL, dùng broker nhúng và H2:
 * ./mvnw spring-boot:test-run -Dspring-boot.run.profiles=h2
 */
public class TestCinemaApplication {

    public static void main(String[] args) {
        SpringApplication.from(CinemaApplication::main).with(EmbeddedRabbitConfig.class).run(args);
    }
}
