package com.cgdn.cinema.modules.room.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "ghe")
public class Ghe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "phong_chieu_id", nullable = false)
    private PhongChieu phongChieu;

    @Column(name = "ten_hang", nullable = false, length = 20)
    private String tenHang;

    @Column(name = "so_ghe", nullable = false)
    private Integer soGhe;

    @Column(name = "vi_tri_cot", nullable = false)
    private Integer viTriCot;

    @Column(name = "loai_ghe", nullable = false, length = 32)
    private String loaiGhe;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai;

    public Long getId() {
        return id;
    }

    public PhongChieu getPhongChieu() {
        return phongChieu;
    }

    public String getTenHang() {
        return tenHang;
    }

    public Integer getSoGhe() {
        return soGhe;
    }

    public Integer getViTriCot() {
        return viTriCot;
    }

    public String getLoaiGhe() {
        return loaiGhe;
    }

    public Byte getTrangThai() {
        return trangThai;
    }
}
