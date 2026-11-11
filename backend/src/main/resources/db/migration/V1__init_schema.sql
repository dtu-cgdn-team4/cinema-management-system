CREATE TABLE the_loai (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ten VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_the_loai_ten (ten)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE phim (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ten_phim VARCHAR(255) NOT NULL,
    thoi_luong INT NOT NULL,
    nhan_tuoi VARCHAR(20) NOT NULL,
    ngay_khoi_chieu DATE NOT NULL,
    ngay_ket_thuc DATE NOT NULL,
    dao_dien VARCHAR(255) NOT NULL,
    dien_vien VARCHAR(1000) NOT NULL,
    hang_san_xuat VARCHAR(255) NOT NULL,
    trailer_url VARCHAR(2048) NOT NULL,
    poster_url VARCHAR(2048) NOT NULL,
    noi_dung TEXT NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE phim_the_loai (
    phim_id BIGINT NOT NULL,
    the_loai_id BIGINT NOT NULL,
    PRIMARY KEY (phim_id, the_loai_id),
    CONSTRAINT fk_phim_the_loai_phim_id FOREIGN KEY (phim_id) REFERENCES phim (id),
    CONSTRAINT fk_phim_the_loai_the_loai_id FOREIGN KEY (the_loai_id) REFERENCES the_loai (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE rap (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ten_rap VARCHAR(150) NOT NULL,
    thanh_pho VARCHAR(100) NOT NULL,
    dia_chi VARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    gio_mo_cua TIME NOT NULL,
    gio_dong_cua TIME NOT NULL,
    hinh_anh_url VARCHAR(2048) NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_rap_ten (ten_rap)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE phong_chieu (
    id BIGINT NOT NULL AUTO_INCREMENT,
    rap_id BIGINT NOT NULL,
    ten_phong VARCHAR(100) NOT NULL,
    so_hang INT NOT NULL,
    so_cot INT NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_phong_chieu_rap_ten (rap_id, ten_phong),
    CONSTRAINT fk_phong_chieu_rap_id FOREIGN KEY (rap_id) REFERENCES rap (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ghe (
    id BIGINT NOT NULL AUTO_INCREMENT,
    phong_chieu_id BIGINT NOT NULL,
    ten_hang VARCHAR(20) NOT NULL,
    so_ghe INT NOT NULL,
    vi_tri_cot INT NOT NULL,
    loai_ghe VARCHAR(32) NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_ghe_phong_hang_so (phong_chieu_id, ten_hang, so_ghe),
    CONSTRAINT fk_ghe_phong_chieu_id FOREIGN KEY (phong_chieu_id) REFERENCES phong_chieu (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE suat_chieu (
    id BIGINT NOT NULL AUTO_INCREMENT,
    phim_id BIGINT NOT NULL,
    phong_chieu_id BIGINT NOT NULL,
    bat_dau DATETIME NOT NULL,
    ket_thuc DATETIME NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY ix_suat_chieu_phong_bat_dau (phong_chieu_id, bat_dau),
    CONSTRAINT fk_suat_chieu_phim_id FOREIGN KEY (phim_id) REFERENCES phim (id),
    CONSTRAINT fk_suat_chieu_phong_chieu_id FOREIGN KEY (phong_chieu_id) REFERENCES phong_chieu (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE bang_gia (
    id BIGINT NOT NULL AUTO_INCREMENT,
    thu_trong_tuan TINYINT NOT NULL,
    loai_ghe VARCHAR(32) NOT NULL,
    gia DECIMAL(15,2) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_bang_gia_thu_loai (thu_trong_tuan, loai_ghe)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE khuyen_mai (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ma VARCHAR(64) NULL,
    tieu_de VARCHAR(255) NOT NULL,
    noi_dung TEXT NOT NULL,
    hinh_anh_url VARCHAR(2048) NOT NULL,
    loai_giam VARCHAR(32) NOT NULL,
    muc_giam DECIMAL(15,2) NOT NULL,
    bat_dau DATETIME NOT NULL,
    ket_thuc DATETIME NOT NULL,
    tu_dong_ap_dung BOOLEAN NOT NULL DEFAULT FALSE,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_khuyen_mai_ma (ma)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE khuyen_mai_thu (
    khuyen_mai_id BIGINT NOT NULL,
    thu_trong_tuan TINYINT NOT NULL,
    PRIMARY KEY (khuyen_mai_id, thu_trong_tuan),
    CONSTRAINT fk_khuyen_mai_thu_khuyen_mai_id FOREIGN KEY (khuyen_mai_id) REFERENCES khuyen_mai (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE nguoi_dung (
    id BIGINT NOT NULL AUTO_INCREMENT,
    tai_khoan VARCHAR(64) NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten VARCHAR(150) NOT NULL,
    email VARCHAR(254) NOT NULL,
    so_dien_thoai VARCHAR(20) NOT NULL,
    ngay_sinh DATE NOT NULL,
    gioi_tinh VARCHAR(32) NOT NULL,
    cccd VARCHAR(20) NULL,
    dia_chi VARCHAR(255) NULL,
    vai_tro VARCHAR(32) NOT NULL,
    rap_id BIGINT NULL,
    google_id VARCHAR(255) NULL,
    diem_tich_luy INT NOT NULL DEFAULT 0,
    so_lan_dang_nhap_sai INT NOT NULL DEFAULT 0,
    bi_khoa BOOLEAN NOT NULL DEFAULT FALSE,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    UNIQUE KEY uk_nguoi_dung_tai_khoan (tai_khoan),
    UNIQUE KEY uk_nguoi_dung_email (email),
    UNIQUE KEY uk_nguoi_dung_sdt (so_dien_thoai),
    CONSTRAINT ck_nguoi_dung_rap CHECK (
        (vai_tro = 'NHAN_VIEN' AND rap_id IS NOT NULL)
        OR (vai_tro <> 'NHAN_VIEN' AND rap_id IS NULL)
    ),
    CONSTRAINT fk_nguoi_dung_rap_id FOREIGN KEY (rap_id) REFERENCES rap (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE dat_ve (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ma_dat_ve VARCHAR(64) NOT NULL,
    nguoi_dung_id BIGINT NULL,
    suat_chieu_id BIGINT NOT NULL,
    kenh VARCHAR(20) NOT NULL,
    nhan_vien_id BIGINT NULL,
    ten_nguoi_nhan VARCHAR(150) NULL,
    sdt_nguoi_nhan VARCHAR(20) NULL,
    email_nguoi_nhan VARCHAR(254) NULL,
    khuyen_mai_id BIGINT NULL,
    tong_tien DECIMAL(15,2) NOT NULL,
    tien_giam DECIMAL(15,2) NOT NULL DEFAULT 0,
    thanh_tien DECIMAL(15,2) NOT NULL,
    trang_thai_dat_ve VARCHAR(32) NOT NULL,
    thanh_toan_luc DATETIME NULL,
    nhan_ve_luc DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_dat_ve_ma (ma_dat_ve),
    CONSTRAINT ck_dat_ve_kenh CHECK (
        (kenh = 'ONLINE' AND nguoi_dung_id IS NOT NULL AND nhan_vien_id IS NULL
            AND ten_nguoi_nhan IS NOT NULL AND sdt_nguoi_nhan IS NOT NULL
            AND email_nguoi_nhan IS NOT NULL)
        OR (kenh = 'TAI_QUAY' AND nhan_vien_id IS NOT NULL)
    ),
    CONSTRAINT fk_dat_ve_nguoi_dung_id FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (id),
    CONSTRAINT fk_dat_ve_suat_chieu_id FOREIGN KEY (suat_chieu_id) REFERENCES suat_chieu (id),
    CONSTRAINT fk_dat_ve_nhan_vien_id FOREIGN KEY (nhan_vien_id) REFERENCES nguoi_dung (id),
    CONSTRAINT fk_dat_ve_khuyen_mai_id FOREIGN KEY (khuyen_mai_id) REFERENCES khuyen_mai (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ghe_suat_chieu (
    id BIGINT NOT NULL AUTO_INCREMENT,
    suat_chieu_id BIGINT NOT NULL,
    ghe_id BIGINT NOT NULL,
    dat_ve_id BIGINT NULL,
    nguoi_dung_id BIGINT NULL,
    trang_thai_ghe VARCHAR(32) NOT NULL,
    gia DECIMAL(15,2) NULL,
    het_han_luc DATETIME NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_ghe_suat_chieu_suat_ghe (suat_chieu_id, ghe_id),
    CONSTRAINT fk_ghe_suat_chieu_suat_chieu_id FOREIGN KEY (suat_chieu_id) REFERENCES suat_chieu (id),
    CONSTRAINT fk_ghe_suat_chieu_ghe_id FOREIGN KEY (ghe_id) REFERENCES ghe (id),
    CONSTRAINT fk_ghe_suat_chieu_dat_ve_id FOREIGN KEY (dat_ve_id) REFERENCES dat_ve (id),
    CONSTRAINT fk_ghe_suat_chieu_nguoi_dung_id FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE thanh_toan (
    id BIGINT NOT NULL AUTO_INCREMENT,
    dat_ve_id BIGINT NOT NULL,
    phuong_thuc VARCHAR(32) NOT NULL,
    so_tien DECIMAL(15,2) NOT NULL,
    ma_giao_dich VARCHAR(128) NOT NULL,
    trang_thai_thanh_toan VARCHAR(32) NOT NULL,
    thoi_diem DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_thanh_toan_dat_ve_id FOREIGN KEY (dat_ve_id) REFERENCES dat_ve (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE hoa_don (
    id BIGINT NOT NULL AUTO_INCREMENT,
    dat_ve_id BIGINT NOT NULL,
    so_hoa_don VARCHAR(64) NOT NULL,
    ngay_xuat DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_hoa_don_dat_ve_id FOREIGN KEY (dat_ve_id) REFERENCES dat_ve (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE lich_su_diem (
    id BIGINT NOT NULL AUTO_INCREMENT,
    nguoi_dung_id BIGINT NOT NULL,
    dat_ve_id BIGINT NOT NULL,
    so_diem INT NOT NULL,
    loai VARCHAR(32) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_lich_su_diem_nguoi_dung_id FOREIGN KEY (nguoi_dung_id) REFERENCES nguoi_dung (id),
    CONSTRAINT fk_lich_su_diem_dat_ve_id FOREIGN KEY (dat_ve_id) REFERENCES dat_ve (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
