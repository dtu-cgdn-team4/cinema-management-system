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
@Table(name = "phong_chieu")
public class PhongChieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rap_id", nullable = false)
    private Rap rap;

    @Column(name = "ten_phong", nullable = false, length = 100)
    private String tenPhong;

    @Column(name = "so_hang", nullable = false)
    private Integer soHang;

    @Column(name = "so_cot", nullable = false)
    private Integer soCot;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai;

    public Long getId() {
        return id;
    }

    public Rap getRap() {
        return rap;
    }

    public String getTenPhong() {
        return tenPhong;
    }

    public Integer getSoHang() {
        return soHang;
    }

    public Integer getSoCot() {
        return soCot;
    }

    public Byte getTrangThai() {
        return trangThai;
    }
}
