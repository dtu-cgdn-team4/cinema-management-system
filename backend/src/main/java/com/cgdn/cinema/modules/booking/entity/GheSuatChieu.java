package com.cgdn.cinema.modules.booking.entity;

import com.cgdn.cinema.modules.room.entity.Ghe;
import com.cgdn.cinema.modules.showtime.entity.SuatChieu;
import com.cgdn.cinema.modules.user.entity.NguoiDung;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "ghe_suat_chieu")
public class GheSuatChieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "suat_chieu_id", nullable = false)
    private SuatChieu suatChieu;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ghe_id", nullable = false)
    private Ghe ghe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dat_ve_id")
    private DatVe datVe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id")
    private NguoiDung nguoiDung;

    @Column(name = "trang_thai_ghe", nullable = false, length = 32)
    private String trangThaiGhe;

    @Column(name = "gia", precision = 15, scale = 2)
    private BigDecimal gia;

    @Column(name = "het_han_luc")
    private LocalDateTime hetHanLuc;

    public Long getId() {
        return id;
    }

    public SuatChieu getSuatChieu() {
        return suatChieu;
    }

    public Ghe getGhe() {
        return ghe;
    }

    public DatVe getDatVe() {
        return datVe;
    }

    public NguoiDung getNguoiDung() {
        return nguoiDung;
    }

    public String getTrangThaiGhe() {
        return trangThaiGhe;
    }

    public BigDecimal getGia() {
        return gia;
    }

    public LocalDateTime getHetHanLuc() {
        return hetHanLuc;
    }
}
