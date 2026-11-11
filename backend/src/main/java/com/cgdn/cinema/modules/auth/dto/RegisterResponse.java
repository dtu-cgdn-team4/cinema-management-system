package com.cgdn.cinema.modules.auth.dto;

public record RegisterResponse(Long id, String username, String fullName, String email, String role) {
}
