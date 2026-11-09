package com.cgdn.cinema.modules.auth.service;

import com.cgdn.cinema.modules.auth.dto.AuthDtos;
import com.cgdn.cinema.modules.auth.entity.Account;
import com.cgdn.cinema.security.SecurityConfig;
import java.time.Clock;
import java.time.Duration;
import java.util.UUID;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
    private final JwtEncoder encoder;
    private final Clock clock;
    public TokenService(JwtEncoder encoder, Clock clock) { this.encoder = encoder; this.clock = clock; }
    public AuthDtos.Session issue(Account account, boolean rememberMe) {
        var now = clock.instant();
        var expiry = now.plus(Duration.ofHours(rememberMe ? 8 : 1));
        var claims = JwtClaimsSet.builder().issuer(SecurityConfig.ISSUER).subject(Long.toString(account.id()))
                .issuedAt(now).expiresAt(expiry).id(UUID.randomUUID().toString())
                .claim("role", account.authority()).build();
        var token = encoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();
        return new AuthDtos.Session(token, expiry, AuthDtos.User.of(account));
    }
}

