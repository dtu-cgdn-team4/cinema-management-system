package com.cgdn.cinema.modules.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;

@Entity
@Table(name = "phim")
public class Phim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ten_phim", nullable = false, length = 255)
    private String tenPhim;

    @Column(name = "thoi_luong", nullable = false)
    private Integer thoiLuong;

    @Column(name = "nhan_tuoi", nullable = false, length = 20)
    private String nhanTuoi;

    @Column(name = "ngay_khoi_chieu", nullable = false)
    private LocalDate ngayKhoiChieu;

    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;

    @Column(name = "dao_dien", nullable = false, length = 255)
    private String daoDien;

    @Column(name = "dien_vien", nullable = false, length = 1000)
    private String dienVien;

    @Column(name = "hang_san_xuat", nullable = false, length = 255)
    private String hangSanXuat;

    @Column(name = "trailer_url", nullable = false, length = 2048)
    private String trailerUrl;

    @Column(name = "poster_url", nullable = false, length = 2048)
    private String posterUrl;

    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai;

    public Long getId() {
        return id;
    }

    public String getTenPhim() {
        return tenPhim;
    }

    public Integer getThoiLuong() {
        return thoiLuong;
    }

    public String getNhanTuoi() {
        return nhanTuoi;
    }

    public LocalDate getNgayKhoiChieu() {
        return ngayKhoiChieu;
    }

    public LocalDate getNgayKetThuc() {
        return ngayKetThuc;
    }

    public String getDaoDien() {
        return daoDien;
    }

    public String getDienVien() {
        return dienVien;
    }

    public String getHangSanXuat() {
        return hangSanXuat;
    }

    public String getTrailerUrl() {
        return trailerUrl;
    }

    public String getPosterUrl() {
        return posterUrl;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public Byte getTrangThai() {
        return trangThai;
    }
}
