package com.cgdn.cinema.modules.auth.controller;

import com.cgdn.cinema.modules.auth.dto.AuthDtos;
import com.cgdn.cinema.modules.auth.repository.AccountRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
public class RoleSessionController {
    private final AccountRepository accounts;
    public RoleSessionController(AccountRepository accounts) { this.accounts = accounts; }
    @GetMapping({"/api/admin/session", "/api/staff/session", "/api/user/session"})
    public AuthDtos.User session(@AuthenticationPrincipal Jwt jwt) {
        return AuthDtos.User.of(accounts.byId(Long.parseLong(jwt.getSubject())).orElseThrow());
    }
}

