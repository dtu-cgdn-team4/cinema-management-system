package com.cgdn.cinema.modules.promotion.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "khuyen_mai")
public class KhuyenMai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ma", length = 64)
    private String ma;

    @Column(name = "tieu_de", nullable = false, length = 255)
    private String tieuDe;

    @Column(name = "noi_dung", nullable = false, columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "hinh_anh_url", nullable = false, length = 2048)
    private String hinhAnhUrl;

    @Column(name = "loai_giam", nullable = false, length = 32)
    private String loaiGiam;

    @Column(name = "muc_giam", nullable = false, precision = 15, scale = 2)
    private BigDecimal mucGiam;

    @Column(name = "bat_dau", nullable = false)
    private LocalDateTime batDau;

    @Column(name = "ket_thuc", nullable = false)
    private LocalDateTime ketThuc;

    @Column(name = "tu_dong_ap_dung", nullable = false)
    private Boolean tuDongApDung;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai;

    public Long getId() {
        return id;
    }

    public String getMa() {
        return ma;
    }

    public String getTieuDe() {
        return tieuDe;
    }

    public String getNoiDung() {
        return noiDung;
    }

    public String getHinhAnhUrl() {
        return hinhAnhUrl;
    }

    public String getLoaiGiam() {
        return loaiGiam;
    }

    public BigDecimal getMucGiam() {
        return mucGiam;
    }

    public LocalDateTime getBatDau() {
        return batDau;
    }

    public LocalDateTime getKetThuc() {
        return ketThuc;
    }

    public Boolean getTuDongApDung() {
        return tuDongApDung;
    }

    public Byte getTrangThai() {
        return trangThai;
    }
}
