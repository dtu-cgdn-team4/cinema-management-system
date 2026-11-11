package com.cgdn.cinema.modules.booking.entity;

import com.cgdn.cinema.modules.promotion.entity.KhuyenMai;
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
@Table(name = "dat_ve")
public class DatVe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ma_dat_ve", nullable = false, length = 64)
    private String maDatVe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nguoi_dung_id")
    private NguoiDung nguoiDung;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "suat_chieu_id", nullable = false)
    private SuatChieu suatChieu;

    @Column(name = "kenh", nullable = false, length = 20)
    private String kenh;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "nhan_vien_id")
    private NguoiDung nhanVien;

    @Column(name = "ten_nguoi_nhan", length = 150)
    private String tenNguoiNhan;

    @Column(name = "sdt_nguoi_nhan", length = 20)
    private String sdtNguoiNhan;

    @Column(name = "email_nguoi_nhan", length = 254)
    private String emailNguoiNhan;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "khuyen_mai_id")
    private KhuyenMai khuyenMai;

    @Column(name = "tong_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal tongTien;

    @Column(name = "tien_giam", nullable = false, precision = 15, scale = 2)
    private BigDecimal tienGiam;

    @Column(name = "thanh_tien", nullable = false, precision = 15, scale = 2)
    private BigDecimal thanhTien;

    @Column(name = "trang_thai_dat_ve", nullable = false, length = 32)
    private String trangThaiDatVe;

    @Column(name = "thanh_toan_luc")
    private LocalDateTime thanhToanLuc;

    @Column(name = "nhan_ve_luc")
    private LocalDateTime nhanVeLuc;

    public Long getId() {
        return id;
    }

    public String getMaDatVe() {
        return maDatVe;
    }

    public NguoiDung getNguoiDung() {
        return nguoiDung;
    }

    public SuatChieu getSuatChieu() {
        return suatChieu;
    }

    public String getKenh() {
        return kenh;
    }

    public NguoiDung getNhanVien() {
        return nhanVien;
    }

    public String getTenNguoiNhan() {
        return tenNguoiNhan;
    }

    public String getSdtNguoiNhan() {
        return sdtNguoiNhan;
    }

    public String getEmailNguoiNhan() {
        return emailNguoiNhan;
    }

    public KhuyenMai getKhuyenMai() {
        return khuyenMai;
    }

    public BigDecimal getTongTien() {
        return tongTien;
    }

    public BigDecimal getTienGiam() {
        return tienGiam;
    }

    public BigDecimal getThanhTien() {
        return thanhTien;
    }

    public String getTrangThaiDatVe() {
        return trangThaiDatVe;
    }

    public LocalDateTime getThanhToanLuc() {
        return thanhToanLuc;
    }

    public LocalDateTime getNhanVeLuc() {
        return nhanVeLuc;
    }
}
