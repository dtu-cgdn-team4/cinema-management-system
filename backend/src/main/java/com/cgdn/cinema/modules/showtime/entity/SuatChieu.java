package com.cgdn.cinema.modules.showtime.entity;

import com.cgdn.cinema.modules.movie.entity.Phim;
import com.cgdn.cinema.modules.room.entity.PhongChieu;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "suat_chieu")
public class SuatChieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "phim_id", nullable = false)
    private Phim phim;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "phong_chieu_id", nullable = false)
    private PhongChieu phongChieu;

    @Column(name = "bat_dau", nullable = false)
    private LocalDateTime batDau;

    @Column(name = "ket_thuc", nullable = false)
    private LocalDateTime ketThuc;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai;

    public Long getId() {
        return id;
    }

    public Phim getPhim() {
        return phim;
    }

    public PhongChieu getPhongChieu() {
        return phongChieu;
    }

    public LocalDateTime getBatDau() {
        return batDau;
    }

    public LocalDateTime getKetThuc() {
        return ketThuc;
    }

    public Byte getTrangThai() {
        return trangThai;
    }
}
