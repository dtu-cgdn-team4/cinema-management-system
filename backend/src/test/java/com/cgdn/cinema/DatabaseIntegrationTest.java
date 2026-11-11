package com.cgdn.cinema;

import java.sql.SQLException;

import com.cgdn.cinema.modules.movie.entity.TheLoai;
import com.cgdn.cinema.modules.movie.repository.TheLoaiRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@EnabledIfEnvironmentVariable(named = "DB_NAME", matches = "cinema_test_[A-Za-z0-9_]+")
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Transactional
class DatabaseIntegrationTest {
    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private TheLoaiRepository genres;

    @Autowired
    private EntityManager entityManager;

    @Test
    void migratesAllTablesAndPersistsThroughJpa() {
        assertThat(jdbc.queryForList("""
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name <> 'flyway_schema_history'
                """, String.class)).containsExactlyInAnyOrder(
                "the_loai", "phim_the_loai", "phim", "rap", "phong_chieu", "ghe",
                "suat_chieu", "bang_gia", "khuyen_mai", "khuyen_mai_thu", "dat_ve",
                "ghe_suat_chieu", "thanh_toan", "hoa_don", "lich_su_diem", "nguoi_dung");
        assertThat(jdbc.queryForObject(
                "SELECT COUNT(*) FROM flyway_schema_history WHERE version = '1' AND success = 1",
                Integer.class)).isEqualTo(1);

        var genre = genres.saveAndFlush(new TheLoai("Phiêu lưu"));
        entityManager.clear();
        assertThat(genres.findById(genre.getId()).orElseThrow().getTen()).isEqualTo("Phiêu lưu");
    }

    @Test
    void enforcesSeatUniquenessAndBusinessChecks() {
        jdbc.update("""
                INSERT INTO rap (id, ten_rap, thanh_pho, dia_chi, so_dien_thoai,
                                 gio_mo_cua, gio_dong_cua, hinh_anh_url)
                VALUES (1, 'Test Cinema', 'Đà Nẵng', 'Test', '0900000000', '08:00', '23:00', 'test')
                """);
        jdbc.update("INSERT INTO phong_chieu (id, rap_id, ten_phong, so_hang, so_cot) VALUES (1, 1, 'A', 1, 1)");
        jdbc.update("""
                INSERT INTO phim (id, ten_phim, thoi_luong, nhan_tuoi, ngay_khoi_chieu, ngay_ket_thuc,
                                  dao_dien, dien_vien, hang_san_xuat, trailer_url, poster_url, noi_dung)
                VALUES (1, 'Test', 90, 'P', '2026-11-01', '2026-12-01', 'Test', 'Test', 'Test', 'test', 'test', 'Test')
                """);
        jdbc.update("""
                INSERT INTO suat_chieu (id, phim_id, phong_chieu_id, bat_dau, ket_thuc)
                VALUES (1, 1, 1, '2026-11-09 10:00:00', '2026-11-09 11:30:00')
                """);
        jdbc.update("""
                INSERT INTO ghe (id, phong_chieu_id, ten_hang, so_ghe, vi_tri_cot, loai_ghe)
                VALUES (1, 1, 'A', 1, 1, 'THUONG')
                """);
        String seat = "INSERT INTO ghe_suat_chieu (suat_chieu_id, ghe_id, trang_thai_ghe) VALUES (1, 1, 'TRONG')";
        jdbc.update(seat);
        assertMySqlError(1062, "uk_ghe_suat_chieu_suat_ghe", () -> jdbc.update(seat));

        String user = """
                INSERT INTO nguoi_dung (id, tai_khoan, mat_khau, ho_ten, email,
                                        so_dien_thoai, ngay_sinh, gioi_tinh, vai_tro, rap_id)
                VALUES (1, 'test', 'unused-test-hash', 'Test', 'test@example.com',
                        '0900000001', '2000-01-01', 'NAM', 'NHAN_VIEN', ?)
                """;
        assertMySqlError(3819, "ck_nguoi_dung_rap", () -> jdbc.update(user, (Integer) null));
        jdbc.update(user, 1);

        String booking = """
                INSERT INTO dat_ve (ma_dat_ve, suat_chieu_id, kenh, nhan_vien_id,
                                    tong_tien, thanh_tien, trang_thai_dat_ve)
                VALUES ('TEST', 1, ?, ?, 100000, 100000, 'CHO_THANH_TOAN')
                """;
        assertMySqlError(3819, "ck_dat_ve_kenh", () -> jdbc.update(booking, "ONLINE", 1));
        assertMySqlError(3819, "ck_dat_ve_kenh", () -> jdbc.update(booking, "TAI_QUAY", null));
        assertThat(jdbc.update(booking, "TAI_QUAY", 1)).isEqualTo(1);
    }

    private void assertMySqlError(int code, String constraint, Runnable statement) {
        assertThatThrownBy(statement::run)
                .isInstanceOf(DataAccessException.class)
                .hasRootCauseInstanceOf(SQLException.class)
                .satisfies(error -> {
                    var sqlError = (SQLException) error.getCause();
                    assertThat(sqlError.getErrorCode()).isEqualTo(code);
                    assertThat(sqlError.getMessage()).contains(constraint);
                });
    }
}
