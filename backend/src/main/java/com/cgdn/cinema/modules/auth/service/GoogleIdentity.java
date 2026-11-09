package com.cgdn.cinema.modules.auth.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

@Service
public class GoogleIdentity {
    public record Identity(String subject, String email, String name, boolean authoritativeEmail) { }
    private final NimbusJwtDecoder decoder;
    private final String clientId;
    @org.springframework.beans.factory.annotation.Autowired
    public GoogleIdentity(@Value("${app.google.client-id:}") String clientId) {
        this(clientId, NimbusJwtDecoder.withJwkSetUri("https://www.googleapis.com/oauth2/v3/certs").build());
    }
    public GoogleIdentity(String clientId, NimbusJwtDecoder decoder) {
        this.clientId = clientId;
        this.decoder = decoder;
        OAuth2TokenValidator<Jwt> identity = jwt -> {
            String issuer = jwt.getClaimAsString("iss");
            if (List.of("https://accounts.google.com", "accounts.google.com").contains(issuer == null ? "" : issuer)
                    && jwt.getAudience().contains(clientId) && Boolean.TRUE.equals(jwt.getClaim("email_verified"))
                    && jwt.getExpiresAt() != null && jwt.getSubject() != null && jwt.getClaimAsString("email") != null) {
                return OAuth2TokenValidatorResult.success();
            }
            return OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token"));
        };
        decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(new JwtTimestampValidator(), identity));
    }
    public String clientId() { return clientId; }
    public Identity verify(String token) {
        if (clientId.isBlank()) throw new AuthFailure(HttpStatus.SERVICE_UNAVAILABLE, "Đăng nhập Google chưa được cấu hình.");
        try {
            Jwt jwt = decoder.decode(token);
            String email = jwt.getClaimAsString("email").toLowerCase(java.util.Locale.ROOT);
            String name = jwt.getClaimAsString("name");
            return new Identity(jwt.getSubject(), email, name == null ? email : name,
                    email.endsWith("@gmail.com") || jwt.getClaimAsString("hd") != null);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new AuthFailure(HttpStatus.UNAUTHORIZED, "Không xác thực được tài khoản Google.");
        }
    }
}

