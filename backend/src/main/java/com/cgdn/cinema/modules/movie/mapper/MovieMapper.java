package com.cgdn.cinema.modules.movie.mapper;

import com.cgdn.cinema.modules.movie.dto.response.GenreResponse;
import com.cgdn.cinema.modules.movie.dto.response.MovieResponse;
import com.cgdn.cinema.modules.movie.entity.Genre;
import com.cgdn.cinema.modules.movie.entity.Movie;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class MovieMapper {

    public GenreResponse toGenreResponse(Genre genre) {
        if (genre == null) return null;
        return GenreResponse.builder()
                .id(genre.getId())
                .ten(genre.getTen())
                .build();
    }

    public MovieResponse toMovieResponse(Movie movie) {
        if (movie == null) return null;

        List<String> genreNames = movie.getTheLoai() != null
                ? movie.getTheLoai().stream().map(Genre::getTen).sorted().collect(Collectors.toList())
                : Collections.emptyList();

        List<GenreResponse> genreResponses = movie.getTheLoai() != null
                ? movie.getTheLoai().stream().map(this::toGenreResponse).collect(Collectors.toList())
                : Collections.emptyList();

        LocalDate today = LocalDate.now();
        String status = "NOW_SHOWING";
        String statusText = "Đang chiếu";

        if (movie.getTrangThai() != null && movie.getTrangThai() == 2) {
            status = "ENDED";
            statusText = "Đã ngừng chiếu";
        } else if (movie.getNgayKhoiChieu() != null && movie.getNgayKhoiChieu().isAfter(today)) {
            status = "COMING_SOON";
            statusText = "Sắp chiếu";
        } else if (movie.getNgayKetThuc() != null && movie.getNgayKetThuc().isBefore(today)) {
            status = "ENDED";
            statusText = "Đã ngừng chiếu";
        }

        return MovieResponse.builder()
                .id(movie.getId())
                .tenPhim(movie.getTenPhim())
                .thoiLuong(movie.getThoiLuong())
                .nhanTuoi(movie.getNhanTuoi())
                .ngayKhoiChieu(movie.getNgayKhoiChieu())
                .ngayKetThuc(movie.getNgayKetThuc())
                .daoDien(movie.getDaoDien())
                .dienVien(movie.getDienVien())
                .hangSanXuat(movie.getHangSanXuat())
                .trailerUrl(movie.getTrailerUrl())
                .posterUrl(movie.getPosterUrl())
                .noiDung(movie.getNoiDung())
                .trangThai(movie.getTrangThai())
                .theLoai(genreNames)
                .danhSachTheLoai(genreResponses)
                .status(status)
                .statusText(statusText)
                .build();
    }
}
