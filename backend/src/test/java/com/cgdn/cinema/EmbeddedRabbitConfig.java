package com.cgdn.cinema;

import java.io.IOException;
import java.net.ServerSocket;
import java.nio.file.Files;
import java.util.Map;
import org.apache.qpid.server.SystemLauncher;
import org.apache.qpid.server.model.ConfiguredObject;
import org.apache.qpid.server.model.SystemConfig;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

/**
 * Broker AMQP 0-9-1 nhúng (Apache Qpid) thay RabbitMQ khi test hoặc chạy thử trên máy không cài RabbitMQ.
 * Khởi động một lần mỗi JVM, cổng ngẫu nhiên; code chính vẫn nói chuyện qua giao thức của RabbitMQ.
 */
@TestConfiguration(proxyBeanMethods = false)
public class EmbeddedRabbitConfig {

    private static int port;

    @Bean
    public CachingConnectionFactory rabbitConnectionFactory() throws Exception {
        CachingConnectionFactory factory = new CachingConnectionFactory("localhost", startBroker());
        factory.setUsername("guest");
        factory.setPassword("guest");
        return factory;
    }

    private static synchronized int startBroker() throws Exception {
        if (port == 0) {
            int freePort = freePort();
            String workDir = Files.createTempDirectory("qpid").toString();
            new SystemLauncher().startup(Map.of(
                    SystemConfig.TYPE, "Memory",
                    SystemConfig.INITIAL_CONFIGURATION_LOCATION,
                    EmbeddedRabbitConfig.class.getResource("/qpid-config.json").toExternalForm(),
                    SystemConfig.STARTUP_LOGGED_TO_SYSTEM_OUT, false,
                    ConfiguredObject.CONTEXT, Map.of(
                            "qpid.amqp_port", String.valueOf(freePort),
                            "qpid.work_dir", workDir,
                            "qpid.home_dir", workDir)));
            port = freePort;
        }
        return port;
    }

    private static int freePort() throws IOException {
        try (ServerSocket socket = new ServerSocket(0)) {
            return socket.getLocalPort();
        }
    }
}
