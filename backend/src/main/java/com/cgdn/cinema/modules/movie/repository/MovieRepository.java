package com.cgdn.cinema.modules.movie.repository;

import com.cgdn.cinema.modules.movie.entity.Movie;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {

    // Danh sách phim đang chiếu
    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.theLoai " +
           "WHERE m.trangThai = 1 AND m.ngayKhoiChieu <= :today " +
           "AND (m.ngayKetThuc IS NULL OR m.ngayKetThuc >= :today) " +
           "ORDER BY m.ngayKhoiChieu DESC")
    List<Movie> findNowShowingMovies(@Param("today") LocalDate today);

    // Danh sách phim sắp chiếu
    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.theLoai " +
           "WHERE m.trangThai = 1 AND m.ngayKhoiChieu > :today " +
           "ORDER BY m.ngayKhoiChieu ASC")
    List<Movie> findComingSoonMovies(@Param("today") LocalDate today);

    // Tìm kiếm nhanh theo keyword trên các trường tên phim, đạo diễn, diễn viên
    @Query("SELECT DISTINCT m FROM Movie m LEFT JOIN FETCH m.theLoai " +
           "WHERE m.trangThai = 1 AND (" +
           "LOWER(m.tenPhim) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.daoDien) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.dienVien) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
           ")")
    Page<Movie> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
