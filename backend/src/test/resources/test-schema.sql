CREATE TABLE rap (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ten_rap VARCHAR(255) NOT NULL
);

INSERT INTO rap (id, ten_rap) VALUES (1, 'Galaxy Nguyễn Du');

CREATE TABLE nguoi_dung (
    id                   BIGINT AUTO_INCREMENT PRIMARY KEY,
    tai_khoan            VARCHAR(100) NOT NULL UNIQUE,
    mat_khau             VARCHAR(255) NOT NULL,
    ho_ten               VARCHAR(255) NOT NULL,
    email                VARCHAR(255) NOT NULL UNIQUE,
    so_dien_thoai        VARCHAR(20) NOT NULL UNIQUE,
    ngay_sinh            DATE NOT NULL,
    gioi_tinh            VARCHAR(10) NOT NULL,
    cccd                 VARCHAR(12) NULL,
    dia_chi              VARCHAR(500) NULL,
    vai_tro              VARCHAR(20) NOT NULL,
    rap_id               BIGINT NULL,
    google_id            VARCHAR(255) NULL,
    diem_tich_luy        INT NOT NULL DEFAULT 0,
    so_lan_dang_nhap_sai INT NOT NULL DEFAULT 0,
    bi_khoa              BOOLEAN NOT NULL DEFAULT FALSE,
    trang_thai           TINYINT NOT NULL DEFAULT 1,
    ngay_tao             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_nguoi_dung_rap FOREIGN KEY (rap_id) REFERENCES rap (id)
);

-- Mật khẩu mẫu cho tất cả tài khoản bên dưới là: 123456
INSERT INTO nguoi_dung (id, tai_khoan, mat_khau, ho_ten, email, so_dien_thoai, ngay_sinh, gioi_tinh, vai_tro, rap_id) VALUES
    (1, 'khach1', '$2a$10$0YUmnRzrCtjGnIOaPcEEEu3C/Ztpwa.gsUZtR9.ZLK.PrgrkwNvAy', 'Nguyễn Văn An', 'khach1@example.com', '0900000001', '2000-01-15', 'NAM', 'KHACH_HANG', NULL),
    (2, 'khach2', '$2a$10$0YUmnRzrCtjGnIOaPcEEEu3C/Ztpwa.gsUZtR9.ZLK.PrgrkwNvAy', 'Trần Thị Bình', 'khach2@example.com', '0900000002', '2001-05-20', 'NU', 'KHACH_HANG', NULL),
    (3, 'nhanvien1', '$2a$10$0YUmnRzrCtjGnIOaPcEEEu3C/Ztpwa.gsUZtR9.ZLK.PrgrkwNvAy', 'Lê Văn Cường', 'nhanvien1@example.com', '0900000003', '1998-03-10', 'NAM', 'NHAN_VIEN', 1),
    (4, 'admin', '$2a$10$0YUmnRzrCtjGnIOaPcEEEu3C/Ztpwa.gsUZtR9.ZLK.PrgrkwNvAy', 'Quản Trị Viên', 'admin@example.com', '0900000004', '1995-07-25', 'NAM', 'ADMIN', NULL);

