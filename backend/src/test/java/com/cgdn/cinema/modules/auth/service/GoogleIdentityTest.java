package com.cgdn.cinema.modules.auth.service;

import com.nimbusds.jose.jwk.*;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import java.security.KeyPairGenerator;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import static org.assertj.core.api.Assertions.*;

class GoogleIdentityTest {
    static GoogleIdentity identity;
    static JwtEncoder signer;
    @BeforeAll static void keys() throws Exception {
        var generator=KeyPairGenerator.getInstance("RSA"); generator.initialize(2048);
        var pair=generator.generateKeyPair();
        var jwk=new RSAKey.Builder((RSAPublicKey)pair.getPublic()).privateKey((RSAPrivateKey)pair.getPrivate()).keyID("test").build();
        signer=new NimbusJwtEncoder(new ImmutableJWKSet<>(new JWKSet(jwk)));
        identity=new GoogleIdentity("client-id",NimbusJwtDecoder.withPublicKey((RSAPublicKey)pair.getPublic()).build());
    }
    private String token(String issuer,String audience,boolean verified,Instant expiry) {
        var claims=JwtClaimsSet.builder().issuer(issuer).subject("google-sub").audience(List.of(audience))
                .issuedAt(Instant.now().minusSeconds(600)).claim("email","user@gmail.com").claim("email_verified",verified).claim("name","User");
        if(expiry!=null) claims.expiresAt(expiry);
        return signer.encode(JwtEncoderParameters.from(JwsHeader.with(SignatureAlgorithm.RS256).keyId("test").build(),claims.build())).getTokenValue();
    }
    @Test void signedValidIdentityIsAccepted() {
        var result=identity.verify(token("https://accounts.google.com","client-id",true,Instant.now().plusSeconds(3600)));
        assertThat(result.subject()).isEqualTo("google-sub"); assertThat(result.authoritativeEmail()).isTrue();
    }
    @Test void rejectsWrongIssuerAudienceAndUnverifiedEmail() {
        var expiry=Instant.now().plusSeconds(3600);
        for(String input:List.of(token("https://evil.example","client-id",true,expiry),
                token("https://accounts.google.com","other-client",true,expiry),
                token("https://accounts.google.com","client-id",false,expiry))) {
            assertThatThrownBy(()->identity.verify(input)).isInstanceOf(AuthFailure.class);
        }
    }
    @Test void rejectsExpiredOrMissingExpiry() {
        assertThatThrownBy(()->identity.verify(token("https://accounts.google.com","client-id",true,Instant.now().minusSeconds(120)))).isInstanceOf(AuthFailure.class);
        assertThatThrownBy(()->identity.verify(token("https://accounts.google.com","client-id",true,null))).isInstanceOf(AuthFailure.class);
    }
    @Test void rejectsTamperingAndDisabledGoogle() {
        String valid=token("https://accounts.google.com","client-id",true,Instant.now().plusSeconds(3600));
        assertThatThrownBy(()->identity.verify(valid+"invalid")).isInstanceOf(AuthFailure.class);
        var disabled=new GoogleIdentity("");
        assertThatThrownBy(()->disabled.verify(valid)).isInstanceOf(AuthFailure.class);
    }
}
