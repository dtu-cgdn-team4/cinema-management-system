package com.cgdn.cinema.modules.auth.entity;

import com.cgdn.cinema.modules.auth.service.AuthFailure;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.http.HttpStatus;

/** JPA entity mapping the {@code nguoi_dung} table for authentication. */
@Entity
@Table(name = "nguoi_dung")
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tai_khoan", nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "mat_khau", nullable = false, length = 255)
    private String password;

    @Column(name = "ho_ten", nullable = false, length = 255)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "so_dien_thoai", nullable = false, unique = true, length = 20)
    private String phone;

    @Column(name = "ngay_sinh", nullable = false)
    private LocalDate birthDate;

    @Column(name = "gioi_tinh", nullable = false, length = 10)
    private String gender;

    @Column(name = "vai_tro", nullable = false, length = 20)
    private String role;

    @Column(name = "google_id", length = 255)
    private String googleId;

    @Column(name = "so_lan_dang_nhap_sai", nullable = false)
    private int failures;

    @Column(name = "bi_khoa", nullable = false)
    private boolean blocked;

    @Column(name = "trang_thai", nullable = false)
    private int status;

    protected Account() {
    }

    public static Account createGoogle(String email, String name, String googleSub) {
        Account account = new Account();
        String randomDigits = UUID.randomUUID().toString().replaceAll("[^0-9]", "0");
        String fakePhone = "09" + (randomDigits.length() >= 8 ? randomDigits.substring(0, 8) : "00000000");
        account.username = "g_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        account.password = "";
        account.fullName = name;
        account.email = email;
        account.phone = fakePhone;
        account.birthDate = LocalDate.of(2000, 1, 1);
        account.gender = "KHAC";
        account.role = "KHACH_HANG";
        account.googleId = googleSub;
        account.failures = 0;
        account.blocked = false;
        account.status = 1;
        return account;
    }

    public long id() { return id; }
    public String email() { return email; }
    public String fullName() { return fullName; }
    public String phone() { return phone; }
    public String password() { return password; }
    public String role() { return role; }
    public String googleId() { return googleId; }
    public int status() { return status; }
    public boolean blocked() { return blocked; }
    public int failures() { return failures; }

    public String authority() {
        return switch (role) {
            case "ADMIN", "QUAN_TRI" -> "ROLE_ADMIN";
            case "NHAN_VIEN", "STAFF" -> "ROLE_STAFF";
            case "KHACH_HANG", "USER" -> "ROLE_USER";
            default -> throw new AuthFailure(HttpStatus.FORBIDDEN, "Vai trò không hợp lệ: " + role);
        };
    }

    public boolean available(LocalDateTime now) {
        return status == 1 && !blocked && failures < 5;
    }

    public boolean recordFailure() {
        this.failures += 1;
        if (this.failures >= 5) {
            this.blocked = true;
            return true;
        }
        return false;
    }

    public void clearFailures() {
        this.failures = 0;
        this.blocked = false;
    }

    public void linkGoogle(String googleSub) {
        this.googleId = googleSub;
    }
}
