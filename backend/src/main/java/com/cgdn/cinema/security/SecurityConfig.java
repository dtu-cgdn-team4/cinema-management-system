package com.cgdn.cinema.security;

import com.cgdn.cinema.modules.auth.entity.Account;
import com.cgdn.cinema.modules.auth.repository.AccountRepository;
import com.cgdn.cinema.modules.auth.service.AuthFailure;
import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.List;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {
    public static final String ISSUER = "cinema-api";
    @Bean public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
    @Bean public Clock clock() { return Clock.systemUTC(); }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter(AccountRepository accounts, Clock clock) {
        var conv = new JwtAuthenticationConverter();
        conv.setJwtGrantedAuthoritiesConverter(jwt -> {
            try {
                long id = Long.parseLong(jwt.getSubject());
                Account a = accounts.byId(id).orElse(null);
                if (a == null || !a.available(LocalDateTime.now(clock))) return List.of();
                return List.of(new SimpleGrantedAuthority(a.authority()));
            } catch (IllegalArgumentException | AuthFailure ignored) { }
            return List.of();
        });
        return conv;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtDecoder decoder,
            JwtAuthenticationConverter conv, @Value("${app.frontend-url}") String frontendUrl) throws Exception {
        return http.csrf(c -> c.disable()).cors(c -> c.configurationSource(corsConfigurationSource(frontendUrl)))
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/auth/me", "/api/auth/logout").authenticated()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")
                        .requestMatchers("/api/user/**").hasRole("USER")
                        .anyRequest().authenticated())
                .oauth2ResourceServer(o -> o.jwt(j -> j.decoder(decoder).jwtAuthenticationConverter(conv)))
                .build();
    }

    private CorsConfigurationSource corsConfigurationSource(String frontendUrl) {
        var config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public JwtEncoder jwtEncoder(@Value("${app.jwt.secret}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) throw new IllegalStateException("JWT_SECRET must be at least 32 UTF-8 bytes");
        return new NimbusJwtEncoder(new ImmutableSecret<>(new SecretKeySpec(keyBytes, "HmacSHA256")));
    }

    @Bean
    public JwtDecoder jwtDecoder(@Value("${app.jwt.secret}") String secret) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) throw new IllegalStateException("JWT_SECRET must be at least 32 UTF-8 bytes");
        var decoder = NimbusJwtDecoder.withSecretKey(new SecretKeySpec(keyBytes, "HmacSHA256"))
                .macAlgorithm(MacAlgorithm.HS256).build();
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
                new JwtTimestampValidator(),
                new JwtIssuerValidator(ISSUER)));
        return decoder;
    }
}
