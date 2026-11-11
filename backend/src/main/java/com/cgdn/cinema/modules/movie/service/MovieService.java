package com.cgdn.cinema.modules.movie.service;

import com.cgdn.cinema.common.response.PageResponse;
import com.cgdn.cinema.modules.movie.dto.request.MovieFilterRequest;
import com.cgdn.cinema.modules.movie.dto.response.GenreResponse;
import com.cgdn.cinema.modules.movie.dto.response.MovieResponse;

import java.util.List;

public interface MovieService {

    // Lấy danh sách phim có phân trang, hỗ trợ tìm kiếm theo từ khóa và lọc đa điều kiện
    PageResponse<MovieResponse> getMovies(MovieFilterRequest request);

    //Lấy danh sách toàn bộ phim đang chiếu
    List<MovieResponse> getNowShowingMovies();

    // Lấy danh sách toàn bộ phim sắp chiếu
    List<MovieResponse> getComingSoonMovies();

    // Lấy chi tiết thông tin một bộ phim theo ID
    MovieResponse getMovieById(Long id);

    // Lấy danh sách toàn bộ các thể loại phim
    List<GenreResponse> getAllGenres();
}
