-- Phim, phòng chiếu, ghế, suất chiếu, bảng giá (docs/database/database.md)
-- Tên phim dùng VARCHAR: CSDL đã là utf8mb4, NVARCHAR của MySQL lại là utf8mb3.

CREATE TABLE the_loai (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten           VARCHAR(100) NOT NULL UNIQUE,
    ngay_tao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE phim (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_phim        VARCHAR(255) NOT NULL,
    thoi_luong      INT NOT NULL,
    nhan_tuoi       VARCHAR(5) NOT NULL,
    ngay_khoi_chieu DATE NOT NULL,
    ngay_ket_thuc   DATE NOT NULL,
    dao_dien        VARCHAR(255),
    dien_vien       VARCHAR(1000),
    hang_san_xuat   VARCHAR(255),
    trailer_url     VARCHAR(500),
    poster_url      VARCHAR(500),
    noi_dung        TEXT,
    trang_thai      TINYINT NOT NULL DEFAULT 1,
    ngay_tao        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE INDEX idx_phim_ngay_chieu ON phim (ngay_khoi_chieu, ngay_ket_thuc);

CREATE TABLE phim_the_loai (
    phim_id     BIGINT NOT NULL,
    the_loai_id BIGINT NOT NULL,
    PRIMARY KEY (phim_id, the_loai_id),
    CONSTRAINT fk_ptl_phim FOREIGN KEY (phim_id) REFERENCES phim (id),
    CONSTRAINT fk_ptl_the_loai FOREIGN KEY (the_loai_id) REFERENCES the_loai (id)
);

CREATE TABLE phong_chieu (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_phong     VARCHAR(50) NOT NULL UNIQUE,
    so_hang       INT NOT NULL,
    so_cot        INT NOT NULL,
    trang_thai    TINYINT NOT NULL DEFAULT 1,
    ngay_tao      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE ghe (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    phong_chieu_id BIGINT NOT NULL,
    ten_hang       VARCHAR(5) NOT NULL,
    so_ghe         INT NOT NULL,
    vi_tri_cot     INT NOT NULL,
    loai_ghe       VARCHAR(10) NOT NULL,
    trang_thai     TINYINT NOT NULL DEFAULT 1,
    ngay_tao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_ghe UNIQUE (phong_chieu_id, ten_hang, so_ghe),
    CONSTRAINT fk_ghe_phong FOREIGN KEY (phong_chieu_id) REFERENCES phong_chieu (id)
);

CREATE TABLE suat_chieu (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    phim_id        BIGINT NOT NULL,
    phong_chieu_id BIGINT NOT NULL,
    bat_dau        DATETIME NOT NULL,
    ket_thuc       DATETIME NOT NULL, -- đã cộng thời gian dọn phòng
    trang_thai     TINYINT NOT NULL DEFAULT 1,
    ngay_tao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_sc_phim FOREIGN KEY (phim_id) REFERENCES phim (id),
    CONSTRAINT fk_sc_phong FOREIGN KEY (phong_chieu_id) REFERENCES phong_chieu (id)
);
CREATE INDEX idx_sc_phim_bat_dau ON suat_chieu (phim_id, bat_dau);
CREATE INDEX idx_sc_phong_bat_dau ON suat_chieu (phong_chieu_id, bat_dau);

-- thu_trong_tuan theo ISO: 1 = Thứ hai ... 7 = Chủ nhật
CREATE TABLE bang_gia (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    thu_trong_tuan TINYINT NOT NULL,
    loai_ghe       VARCHAR(10) NOT NULL,
    gia            DECIMAL(12, 0) NOT NULL,
    ngay_tao       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_bang_gia UNIQUE (thu_trong_tuan, loai_ghe)
);

-- Giá tạm ghế thường (SRS 6.8). Giá VIP chưa chốt.
INSERT INTO bang_gia (thu_trong_tuan, loai_ghe, gia) VALUES
    (1, 'THUONG', 50000), (2, 'THUONG', 45000), (3, 'THUONG', 50000), (4, 'THUONG', 50000),
    (5, 'THUONG', 65000), (6, 'THUONG', 65000), (7, 'THUONG', 65000);
