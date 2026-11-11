package com.cgdn.cinema.modules.movie.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "phim")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_phim", nullable = false, length = 255)
    private String tenPhim;

    @Column(name = "thoi_luong", nullable = false)
    private Integer thoiLuong;

    @Column(name = "nhan_tuoi", length = 20)
    private String nhanTuoi;

    @Column(name = "ngay_khoi_chieu", nullable = false)
    private LocalDate ngayKhoiChieu;

    @Column(name = "ngay_ket_thuc")
    private LocalDate ngayKetThuc;

    @Column(name = "dao_dien", length = 255)
    private String daoDien;

    @Column(name = "dien_vien", length = 1000)
    private String dienVien;

    @Column(name = "hang_san_xuat", length = 255)
    private String hangSanXuat;

    @Column(name = "trailer_url", length = 500)
    private String trailerUrl;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "noi_dung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "trang_thai", nullable = false)
    @Builder.Default
    private Integer trangThai = 1; // 1: Active, 2: Deleted

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "phim_the_loai",
        joinColumns = @JoinColumn(name = "phim_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "the_loai_id", referencedColumnName = "id")
    )
    @Builder.Default
    private Set<Genre> theLoai = new HashSet<>();
}
