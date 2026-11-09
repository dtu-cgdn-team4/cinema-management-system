package com.cgdn.cinema.security;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import javax.crypto.spec.SecretKeySpec;
import com.cgdn.cinema.common.enums.Role;
import com.cgdn.cinema.common.response.ApiResponse;
import com.cgdn.cinema.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/** Phân quyền API. Phát hành token (đăng nhập) thuộc module auth; ở đây chỉ kiểm tra token. */
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder, ObjectMapper objectMapper)
            throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Đặt vé online chỉ dành cho thành viên đã đăng nhập (#46)
                        .requestMatchers(HttpMethod.POST, "/api/v1/showtimes/*/seats/hold")
                        .hasRole(Role.KHACH_HANG.name())
                        .requestMatchers(HttpMethod.GET, "/api/v1/movies/**", "/api/v1/cinemas/**", "/api/v1/showtimes/**")
                        .permitAll()
                        .requestMatchers("/ws/**", "/error", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**")
                        .permitAll()
                        .anyRequest().authenticated())
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, ex) ->
                                writeError(response, ErrorCode.UNAUTHORIZED, objectMapper))
                        .accessDeniedHandler((request, response, ex) ->
                                writeError(response, ErrorCode.FORBIDDEN, objectMapper)))
                .addFilterBefore(new JwtAuthenticationFilter(jwtDecoder), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /** JWT ký HS256 bằng JWT_SECRET (ít nhất 32 ký tự). */
    @Bean
    public JwtDecoder jwtDecoder(@Value("${app.jwt-secret}") String secret) {
        return NimbusJwtDecoder
                .withSecretKey(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    private static void writeError(HttpServletResponse response, ErrorCode code, ObjectMapper objectMapper)
            throws IOException {
        response.setStatus(code.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        objectMapper.writeValue(response.getWriter(), ApiResponse.error(code.name(), code.getMessage()));
    }
}
