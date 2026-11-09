package com.cgdn.cinema.modules.auth.repository;

import com.cgdn.cinema.modules.auth.entity.Account;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class AccountRepository {
    private final JdbcTemplate jdbc;
    public AccountRepository(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    private Account map(ResultSet rs, int row) throws SQLException {
        return new Account(
                rs.getLong("id"),
                rs.getString("email"),
                rs.getString("ho_ten"),
                rs.getString("so_dien_thoai"),
                rs.getString("mat_khau"),
                rs.getString("vai_tro"),
                rs.getString("google_id"),
                rs.getInt("trang_thai"),
                rs.getBoolean("bi_khoa"),
                rs.getInt("so_lan_dang_nhap_sai")
        );
    }

    public Optional<Account> byId(long id) {
        return jdbc.query("SELECT * FROM nguoi_dung WHERE id = ?", this::map, id).stream().findFirst();
    }

    public Optional<Account> byEmailForUpdate(String email) {
        return jdbc.query("SELECT * FROM nguoi_dung WHERE email = ? FOR UPDATE", this::map, email).stream().findFirst();
    }

    public Optional<Account> byPhoneForUpdate(String phone) {
        return jdbc.query("SELECT * FROM nguoi_dung WHERE so_dien_thoai = ? FOR UPDATE", this::map, phone).stream().findFirst();
    }

    public Optional<Account> byGoogleForUpdate(String sub) {
        return jdbc.query("SELECT * FROM nguoi_dung WHERE google_id = ? FOR UPDATE", this::map, sub).stream().findFirst();
    }

    public void failed(Account account, LocalDateTime now) {
        int failures = account.failures() + 1;
        jdbc.update("UPDATE nguoi_dung SET so_lan_dang_nhap_sai = ?, bi_khoa = ? WHERE id = ?",
                failures, failures >= 5, account.id());
    }

    public void clearFailures(long id) {
        jdbc.update("UPDATE nguoi_dung SET so_lan_dang_nhap_sai = 0, bi_khoa = FALSE WHERE id = ?", id);
    }

    public Account createGoogle(String email, String name, String sub) {
        String randomDigits = UUID.randomUUID().toString().replaceAll("[^0-9]", "0");
        String fakePhone = "09" + (randomDigits.length() >= 8 ? randomDigits.substring(0, 8) : "00000000");
        String username = "g_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);

        jdbc.update("INSERT INTO nguoi_dung (tai_khoan, mat_khau, ho_ten, email, so_dien_thoai, ngay_sinh, gioi_tinh, vai_tro, google_id) " +
                "VALUES (?, '', ?, ?, ?, '2000-01-01', 'KHAC', 'KHACH_HANG', ?)",
                username, name, email, fakePhone, sub);
        return byGoogleForUpdate(sub).orElseThrow();
    }

    public void linkGoogle(long id, String sub) {
        jdbc.update("UPDATE nguoi_dung SET google_id = ? WHERE id = ?", sub, id);
    }

    public void revoke(long id) {
        // Có thể cập nhật trạng thái nếu cần
    }
}
