-- Trạng thái từng ghế trong một suất (docs/database/database.md). Ghế không có bản ghi là ghế trống.
-- ma_phien tạm thay nguoi_dung_id cho tới khi có đăng nhập; dat_ve_id, gia thêm ở task đặt vé.
CREATE TABLE ghe_suat_chieu (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    suat_chieu_id  BIGINT NOT NULL,
    ghe_id         BIGINT NOT NULL,
    ma_phien       VARCHAR(64) NOT NULL,
    trang_thai_ghe VARCHAR(20) NOT NULL, -- DANG_GIU, CHO_THANH_TOAN, DA_THANH_TOAN
    het_han_luc    DATETIME NULL,        -- chỉ dùng khi DANG_GIU
    ngay_tao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_ghe_suat_chieu UNIQUE (suat_chieu_id, ghe_id), -- chặn bán trùng
    CONSTRAINT fk_gsc_suat_chieu FOREIGN KEY (suat_chieu_id) REFERENCES suat_chieu (id),
    CONSTRAINT fk_gsc_ghe FOREIGN KEY (ghe_id) REFERENCES ghe (id)
);
CREATE INDEX idx_gsc_phien ON ghe_suat_chieu (ma_phien, suat_chieu_id);
