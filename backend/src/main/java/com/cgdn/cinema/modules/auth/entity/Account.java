package com.cgdn.cinema.modules.auth.entity;

import com.cgdn.cinema.modules.auth.service.AuthFailure;
import java.time.LocalDateTime;

public record Account(long id, String email, String fullName, String phone, String password,
                      String role, String googleId, int status, boolean blocked, int failures) {
    public String authority() {
        return switch (role) {
            case "ADMIN", "QUAN_TRI" -> "ROLE_ADMIN";
            case "NHAN_VIEN", "STAFF" -> "ROLE_STAFF";
            case "KHACH_HANG", "USER" -> "ROLE_USER";
            default -> throw new AuthFailure(org.springframework.http.HttpStatus.FORBIDDEN, "Vai trò không hợp lệ: " + role);
        };
    }
    public boolean available(LocalDateTime now) {
        return status == 1 && !blocked && failures < 5;
    }
}
