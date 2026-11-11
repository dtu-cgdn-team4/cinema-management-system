package com.cgdn.cinema.modules.movie.controller;

import com.cgdn.cinema.common.response.ApiResponse;
import com.cgdn.cinema.common.response.PageResponse;
import com.cgdn.cinema.modules.movie.dto.request.MovieFilterRequest;
import com.cgdn.cinema.modules.movie.dto.response.GenreResponse;
import com.cgdn.cinema.modules.movie.dto.response.MovieResponse;
import com.cgdn.cinema.modules.movie.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieService movieService;

    // API 1: Xem danh sách phim và Tìm kiếm phim đa điều kiện
    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<MovieResponse>>> getMovies(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "q", required = false) String q,
            @RequestParam(value = "status", required = false, defaultValue = "ALL") String status,
            @RequestParam(value = "genreId", required = false) Long genreId,
            @RequestParam(value = "genreName", required = false) String genreName,
            @RequestParam(value = "sortBy", required = false, defaultValue = "recommended") String sortBy,
            @RequestParam(value = "page", required = false, defaultValue = "0") int page,
            @RequestParam(value = "size", required = false, defaultValue = "12") int size
    ) {
        // Cho phép nhận cả param 'q' lẫn 'keyword' để tương thích tốt nhất với frontend
        String searchKeyword = (keyword != null && !keyword.trim().isEmpty()) ? keyword : q;

        MovieFilterRequest request = MovieFilterRequest.builder()
                .keyword(searchKeyword)
                .status(status)
                .genreId(genreId)
                .genreName(genreName)
                .sortBy(sortBy)
                .page(page)
                .size(size)
                .build();

        PageResponse<MovieResponse> result = movieService.getMovies(request);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phim thành công", result));
    }

    // API 2: Lấy danh sách toàn bộ phim đang chiếu
    @GetMapping("/now-showing")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getNowShowingMovies() {
        List<MovieResponse> result = movieService.getNowShowingMovies();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phim đang chiếu thành công", result));
    }

    // API 3: Lấy danh sách toàn bộ phim sắp chiếu
    @GetMapping("/coming-soon")
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getComingSoonMovies() {
        List<MovieResponse> result = movieService.getComingSoonMovies();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phim sắp chiếu thành công", result));
    }

    // API 4: Lấy chi tiết phim theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable("id") Long id) {
        MovieResponse result = movieService.getMovieById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin chi tiết phim thành công", result));
    }

    // API 5: Lấy danh sách các thể loại phim
    @GetMapping("/genres")
    public ResponseEntity<ApiResponse<List<GenreResponse>>> getGenres() {
        List<GenreResponse> result = movieService.getAllGenres();
        return ResponseEntity.ok(ApiResponse.success("Lấy danh mục thể loại thành công", result));
    }
}
