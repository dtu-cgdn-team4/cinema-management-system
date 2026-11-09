package com.cgdn.cinema;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import com.cgdn.cinema.common.enums.Role;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

/** Tạo header Authorization cho test, cùng khóa với profile h2 (backend chưa có API đăng nhập). */
public final class TestTokens {

    private static final String SECRET = "dev-only-secret-khong-dung-khi-chay-that";

    private TestTokens() {
    }

    public static String bearer(long userId, Role role) throws JOSEException {
        return bearer(userId, role, SECRET);
    }

    public static String bearer(long userId, Role role, String secret) throws JOSEException {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(String.valueOf(userId))
                .claim("role", role.name())
                .expirationTime(Date.from(Instant.now().plusSeconds(1800)))
                .build();
        SignedJWT jwt = new SignedJWT(new JWSHeader(JWSAlgorithm.HS256), claims);
        jwt.sign(new MACSigner(secret.getBytes(StandardCharsets.UTF_8)));
        return "Bearer " + jwt.serialize();
    }
}
