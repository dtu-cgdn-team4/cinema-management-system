package com.cgdn.cinema.modules.movie.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    private Long id;
    private String tenPhim;
    private Integer thoiLuong;
    private String nhanTuoi;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayKhoiChieu;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate ngayKetThuc;

    private String daoDien;
    private String dienVien;
    private String hangSanXuat;
    private String trailerUrl;
    private String posterUrl;
    private String noiDung;
    private Integer trangThai;

    private List<String> theLoai;
    private List<GenreResponse> danhSachTheLoai;

    // NOW_SHOWING | COMING_SOON | ENDED
    private String status;
    private String statusText;
}
