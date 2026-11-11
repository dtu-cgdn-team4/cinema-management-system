package com.cgdn.cinema.modules.payment.entity;

import com.cgdn.cinema.modules.booking.entity.DatVe;

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
@Table(name = "thanh_toan")
public class ThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dat_ve_id", nullable = false)
    private DatVe datVe;

    @Column(name = "phuong_thuc", nullable = false, length = 32)
    private String phuongThuc;

    @Column(name = "so_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal soTien;

    @Column(name = "ma_giao_dich", nullable = false, length = 128)
    private String maGiaoDich;

    @Column(name = "trang_thai_thanh_toan", nullable = false, length = 32)
    private String trangThaiThanhToan;

    @Column(name = "thoi_diem", nullable = false)
    private LocalDateTime thoiDiem;

    public Long getId() {
        return id;
    }

    public DatVe getDatVe() {
        return datVe;
    }

    public String getPhuongThuc() {
        return phuongThuc;
    }

    public BigDecimal getSoTien() {
        return soTien;
    }

    public String getMaGiaoDich() {
        return maGiaoDich;
    }

    public String getTrangThaiThanhToan() {
        return trangThaiThanhToan;
    }

    public LocalDateTime getThoiDiem() {
        return thoiDiem;
    }
}
