package com.cgdn.cinema.modules.counter.entity;

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

import java.time.LocalDateTime;

@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dat_ve_id", nullable = false)
    private DatVe datVe;

    @Column(name = "so_hoa_don", nullable = false, length = 64)
    private String soHoaDon;

    @Column(name = "ngay_xuat", nullable = false)
    private LocalDateTime ngayXuat;

    public Long getId() {
        return id;
    }

    public DatVe getDatVe() {
        return datVe;
    }

    public String getSoHoaDon() {
        return soHoaDon;
    }

    public LocalDateTime getNgayXuat() {
        return ngayXuat;
    }
}
