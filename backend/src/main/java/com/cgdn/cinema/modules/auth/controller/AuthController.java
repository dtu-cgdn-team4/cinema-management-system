package com.cgdn.cinema.modules.auth.controller;

import com.cgdn.cinema.modules.auth.dto.AuthDtos;
import com.cgdn.cinema.modules.auth.repository.AccountRepository;
import com.cgdn.cinema.modules.auth.service.AuthService;
import com.cgdn.cinema.modules.auth.service.GoogleIdentity;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService auth;
    private final AccountRepository accounts;
    private final GoogleIdentity google;

    public AuthController(AuthService auth, AccountRepository accounts, GoogleIdentity google) {
        this.auth = auth;
        this.accounts = accounts;
        this.google = google;
    }

    @GetMapping("/config")
    public Map<String, Object> config() {
        return Map.of("googleClientId", google.clientId());
    }

    @PostMapping("/login")
    public AuthDtos.Session login(@Valid @RequestBody AuthDtos.Login input) {
        return auth.login(input);
    }

    @PostMapping("/google")
    public AuthDtos.Session google(@Valid @RequestBody AuthDtos.Google input) {
        return auth.google(input);
    }

    @GetMapping("/me")
    public AuthDtos.User me(@AuthenticationPrincipal Jwt jwt) {
        return AuthDtos.User.of(accounts.byId(Long.parseLong(jwt.getSubject())).orElseThrow());
    }

    @PostMapping("/logout")
    public AuthDtos.Message logout(@AuthenticationPrincipal Jwt jwt) {
        accounts.revoke(Long.parseLong(jwt.getSubject()));
        return new AuthDtos.Message("Đã đăng xuất các phiên của tài khoản.");
    }
}

