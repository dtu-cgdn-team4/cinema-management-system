package com.cgdn.cinema.modules.auth.dto;

import com.cgdn.cinema.modules.auth.entity.Account;
import jakarta.validation.constraints.*;
import java.time.Instant;

public final class AuthDtos {
    private AuthDtos() { }
    public record Login(@NotBlank @Email @Size(max=255) String email,
                        @NotBlank @Size(max=72) String password, boolean rememberMe) {
        @Override public String toString() { return "Login[REDACTED]"; }
    }
    public record Google(@NotBlank @Size(max=8192) String token, boolean rememberMe) {
        @Override public String toString() { return "Google[REDACTED]"; }
    }
    public record User(long id, String email, String fullName, String phone, String role) {
        public static User of(Account a) { return new User(a.id(), a.email(), a.fullName(), a.phone(), a.authority()); }
    }
    public record Session(String token, Instant expiresAt, User user) {
        @Override public String toString() { return "Session[token=REDACTED]"; }
    }
    public record Message(String message) { }
}

