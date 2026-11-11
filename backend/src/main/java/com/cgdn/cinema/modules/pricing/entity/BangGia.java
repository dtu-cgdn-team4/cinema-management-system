package com.cgdn.cinema.modules.pricing.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "bang_gia")
public class BangGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "thu_trong_tuan", nullable = false)
    private Byte thuTrongTuan;

    @Column(name = "loai_ghe", nullable = false, length = 32)
    private String loaiGhe;

    @Column(name = "gia", nullable = false, precision = 15, scale = 2)
    private BigDecimal gia;

    public Long getId() {
        return id;
    }

    public Byte getThuTrongTuan() {
        return thuTrongTuan;
    }

    public String getLoaiGhe() {
        return loaiGhe;
    }

    public BigDecimal getGia() {
        return gia;
    }
}
