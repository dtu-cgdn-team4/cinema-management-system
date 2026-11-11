package com.cgdn.cinema.modules.loyalty.entity;

import com.cgdn.cinema.modules.booking.entity.DatVe;
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

@Entity
@Table(name = "lich_su_diem")
public class LichSuDiem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "nguoi_dung_id", nullable = false)
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dat_ve_id", nullable = false)
    private DatVe datVe;

    @Column(name = "so_diem", nullable = false)
    private Integer soDiem;

    @Column(name = "loai", nullable = false, length = 32)
    private String loai;

    public Long getId() {
        return id;
    }

    public NguoiDung getNguoiDung() {
        return nguoiDung;
    }

    public DatVe getDatVe() {
        return datVe;
    }

    public Integer getSoDiem() {
        return soDiem;
    }

    public String getLoai() {
        return loai;
    }
}
