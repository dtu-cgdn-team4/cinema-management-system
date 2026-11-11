package com.cgdn.cinema.modules.room.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalTime;

@Entity
@Table(name = "rap")
public class Rap {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ten_rap", nullable = false, length = 150)
    private String tenRap;

    @Column(name = "thanh_pho", nullable = false, length = 100)
    private String thanhPho;

    @Column(name = "dia_chi", nullable = false, length = 255)
    private String diaChi;

    @Column(name = "so_dien_thoai", nullable = false, length = 20)
    private String soDienThoai;

    @Column(name = "gio_mo_cua", nullable = false)
    private LocalTime gioMoCua;

    @Column(name = "gio_dong_cua", nullable = false)
    private LocalTime gioDongCua;

    @Column(name = "hinh_anh_url", nullable = false, length = 2048)
    private String hinhAnhUrl;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai;

    public Long getId() {
        return id;
    }

    public String getTenRap() {
        return tenRap;
    }

    public String getThanhPho() {
        return thanhPho;
    }

    public String getDiaChi() {
        return diaChi;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public LocalTime getGioMoCua() {
        return gioMoCua;
    }

    public LocalTime getGioDongCua() {
        return gioDongCua;
    }

    public String getHinhAnhUrl() {
        return hinhAnhUrl;
    }

    public Byte getTrangThai() {
        return trangThai;
    }
}
