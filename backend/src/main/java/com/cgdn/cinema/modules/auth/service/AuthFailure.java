package com.cgdn.cinema.modules.auth.service;

import org.springframework.http.HttpStatus;

public class AuthFailure extends RuntimeException {
    private final HttpStatus status;
    public AuthFailure(HttpStatus status, String message) { super(message); this.status = status; }
    public HttpStatus status() { return status; }
}

