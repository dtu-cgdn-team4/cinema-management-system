package com.cgdn.cinema.modules.movie;

import com.cgdn.cinema.common.response.PageResponse;
import com.cgdn.cinema.modules.movie.dto.request.MovieFilterRequest;
import com.cgdn.cinema.modules.movie.dto.response.MovieResponse;
import com.cgdn.cinema.modules.movie.entity.Genre;
import com.cgdn.cinema.modules.movie.entity.Movie;
import com.cgdn.cinema.modules.movie.mapper.MovieMapper;
import com.cgdn.cinema.modules.movie.repository.GenreRepository;
import com.cgdn.cinema.modules.movie.repository.MovieRepository;
import com.cgdn.cinema.modules.movie.service.impl.MovieServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MovieServiceTest {

    @Mock
    private MovieRepository movieRepository;

    @Mock
    private GenreRepository genreRepository;

    @Spy
    private MovieMapper movieMapper;

    @InjectMocks
    private MovieServiceImpl movieService;

    private Movie sampleMovie;
    private Genre actionGenre;

    @BeforeEach
    void setUp() {
        actionGenre = Genre.builder()
                .id(1L)
                .ten("Hành động")
                .build();

        sampleMovie = Movie.builder()
                .id(1L)
                .tenPhim("Dune: Hành Tinh Cát - Phần 2")
                .thoiLuong(166)
                .nhanTuoi("T16")
                .ngayKhoiChieu(LocalDate.now().minusDays(10))
                .ngayKetThuc(LocalDate.now().plusMonths(2))
                .daoDien("Denis Villeneuve")
                .dienVien("Timothée Chalamet, Zendaya")
                .hangSanXuat("Warner Bros.")
                .trangThai(1)
                .theLoai(new HashSet<>(Collections.singletonList(actionGenre)))
                .build();
    }

    @Test
    @DisplayName("Tìm kiếm phim theo từ khóa trả về kết quả thành công")
    void testGetMoviesWithKeyword() {
        Page<Movie> page = new PageImpl<>(Collections.singletonList(sampleMovie));
        when(movieRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);

        MovieFilterRequest request = MovieFilterRequest.builder()
                .keyword("Dune")
                .page(0)
                .size(10)
                .build();

        PageResponse<MovieResponse> result = movieService.getMovies(request);

        assertNotNull(result);
        assertEquals(1, result.getItems().size());
        assertEquals("Dune: Hành Tinh Cát - Phần 2", result.getItems().get(0).getTenPhim());
        assertEquals("NOW_SHOWING", result.getItems().get(0).getStatus());
        verify(movieRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }

    @Test
    @DisplayName("Lấy chi tiết phim theo ID thành công")
    void testGetMovieById() {
        when(movieRepository.findById(1L)).thenReturn(Optional.of(sampleMovie));

        MovieResponse response = movieService.getMovieById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Denis Villeneuve", response.getDaoDien());
        assertTrue(response.getTheLoai().contains("Hành động"));
    }
}
