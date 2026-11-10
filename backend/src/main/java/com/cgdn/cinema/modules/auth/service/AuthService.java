package com.cgdn.cinema.modules.auth.service;

import com.cgdn.cinema.modules.auth.dto.AuthDtos;
import com.cgdn.cinema.modules.auth.entity.Account;
import com.cgdn.cinema.modules.auth.repository.AccountRepository;
import java.nio.charset.StandardCharsets;
import java.time.Clock;
import java.time.LocalDateTime;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final AccountRepository accounts;
    private final PasswordEncoder passwords;
    private final TokenService tokens;
    private final GoogleIdentity google;
    private final Clock clock;
    private final String dummyPassword;
    public AuthService(AccountRepository accounts, PasswordEncoder passwords, TokenService tokens, GoogleIdentity google, Clock clock) {
        this.accounts=accounts; this.passwords=passwords; this.tokens=tokens; this.google=google; this.clock=clock;
        dummyPassword=passwords.encode(java.util.UUID.randomUUID().toString());
    }
    @Transactional(noRollbackFor=AuthFailure.class)
    public AuthDtos.Session login(AuthDtos.Login input) {
        Account a = accounts.findByEmailForUpdate(input.email().trim().toLowerCase(Locale.ROOT)).orElse(null);
        if (a == null) {
            passwords.matches(input.password(), dummyPassword);
            throw badCredentials();
        }
        ensureAvailable(a);
        if (a.password() == null || a.password().isBlank() || input.password().getBytes(StandardCharsets.UTF_8).length > 72
                 || !passwords.matches(input.password(), a.password())) {
            if (a.recordFailure()) throw locked();
            throw badCredentials();
        }
        a.clearFailures();
        return tokens.issue(a, input.rememberMe());
    }
    @Transactional
    public AuthDtos.Session google(AuthDtos.Google input) {
        var identity = google.verify(input.token());
        Account a = accounts.findByGoogleIdForUpdate(identity.subject()).orElse(null);
        if (a == null) {
            a = accounts.findByEmailForUpdate(identity.email()).orElse(null);
            if (a == null) {
                a = accounts.save(Account.createGoogle(identity.email(), identity.name(), identity.subject()));
            } else {
                ensureAvailable(a);
                // Google is not authoritative for arbitrary third-party email addresses.
                if (!identity.authoritativeEmail() || (a.googleId() != null && !a.googleId().equals(identity.subject()))) {
                    throw new AuthFailure(HttpStatus.CONFLICT, "Email này đã có tài khoản. Vui lòng đăng nhập bằng mật khẩu.");
                }
                a.linkGoogle(identity.subject());
            }
        }
        ensureAvailable(a);
        a.clearFailures();
        return tokens.issue(a, input.rememberMe());
    }
    private void ensureAvailable(Account a) {
        if (a.status()!=1 || a.blocked()) throw new AuthFailure(HttpStatus.FORBIDDEN, "Tài khoản không hoạt động hoặc đã bị khóa.");
        if (!a.available(LocalDateTime.now(clock))) throw locked();
    }
    private AuthFailure badCredentials() { return new AuthFailure(HttpStatus.UNAUTHORIZED, "Email hoặc mật khẩu không đúng."); }
    private AuthFailure locked() { return new AuthFailure(HttpStatus.LOCKED, "Tài khoản tạm khóa 15 phút do đăng nhập sai 5 lần. Bạn có thể khôi phục mật khẩu."); }
}

