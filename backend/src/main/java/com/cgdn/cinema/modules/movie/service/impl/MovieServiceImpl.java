package com.cgdn.cinema.modules.movie.service.impl;

import com.cgdn.cinema.common.response.PageResponse;
import com.cgdn.cinema.exception.BusinessException;
import com.cgdn.cinema.modules.movie.dto.request.MovieFilterRequest;
import com.cgdn.cinema.modules.movie.dto.response.GenreResponse;
import com.cgdn.cinema.modules.movie.dto.response.MovieResponse;
import com.cgdn.cinema.modules.movie.entity.Genre;
import com.cgdn.cinema.modules.movie.entity.Movie;
import com.cgdn.cinema.modules.movie.mapper.MovieMapper;
import com.cgdn.cinema.modules.movie.repository.GenreRepository;
import com.cgdn.cinema.modules.movie.repository.MovieRepository;
import com.cgdn.cinema.modules.movie.service.MovieService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final MovieMapper movieMapper;

    @Override
    public PageResponse<MovieResponse> getMovies(MovieFilterRequest request) {
        LocalDate today = LocalDate.now();

        Specification<Movie> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("trangThai"), 1));

            if (StringUtils.hasText(request.getKeyword())) {
                String kw = "%" + request.getKeyword().trim().toLowerCase() + "%";
                Predicate titlePredicate = cb.like(cb.lower(root.get("tenPhim")), kw);
                Predicate directorPredicate = cb.like(cb.lower(root.get("daoDien")), kw);
                Predicate actorPredicate = cb.like(cb.lower(root.get("dienVien")), kw);
                predicates.add(cb.or(titlePredicate, directorPredicate, actorPredicate));
            }

            if (StringUtils.hasText(request.getStatus())) {
                String status = request.getStatus().trim().toUpperCase();
                if ("NOW_SHOWING".equals(status)) {
                    Predicate startPredicate = cb.lessThanOrEqualTo(root.get("ngayKhoiChieu"), today);
                    Predicate endPredicate = cb.or(
                            cb.isNull(root.get("ngayKetThuc")),
                            cb.greaterThanOrEqualTo(root.get("ngayKetThuc"), today)
                    );
                    predicates.add(cb.and(startPredicate, endPredicate));
                } else if ("COMING_SOON".equals(status)) {
                    predicates.add(cb.greaterThan(root.get("ngayKhoiChieu"), today));
                }
            }

            if (request.getGenreId() != null) {
                Join<Movie, Genre> genreJoin = root.join("theLoai");
                predicates.add(cb.equal(genreJoin.get("id"), request.getGenreId()));
            } else if (StringUtils.hasText(request.getGenreName()) && !"Tất cả thể loại".equalsIgnoreCase(request.getGenreName().trim())) {
                Join<Movie, Genre> genreJoin = root.join("theLoai");
                predicates.add(cb.equal(cb.lower(genreJoin.get("ten")), request.getGenreName().trim().toLowerCase()));
            }

            if (query != null) {
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sort = Sort.by(Sort.Direction.DESC, "ngayKhoiChieu");
        if (StringUtils.hasText(request.getSortBy())) {
            switch (request.getSortBy().toLowerCase()) {
                case "release_desc":
                    sort = Sort.by(Sort.Direction.DESC, "ngayKhoiChieu");
                    break;
                case "release_asc":
                    sort = Sort.by(Sort.Direction.ASC, "ngayKhoiChieu");
                    break;
                case "duration_desc":
                    sort = Sort.by(Sort.Direction.DESC, "thoiLuong");
                    break;
                case "duration_asc":
                    sort = Sort.by(Sort.Direction.ASC, "thoiLuong");
                    break;
                case "title_asc":
                    sort = Sort.by(Sort.Direction.ASC, "tenPhim");
                    break;
                default:
                    sort = Sort.by(Sort.Direction.DESC, "ngayKhoiChieu");
                    break;
            }
        }

        int page = Math.max(0, request.getPage());
        int size = request.getSize() > 0 ? request.getSize() : 12;
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Movie> moviePage = movieRepository.findAll(spec, pageable);

        List<MovieResponse> items = moviePage.getContent().stream()
                .map(movieMapper::toMovieResponse)
                .collect(Collectors.toList());

        return PageResponse.<MovieResponse>builder()
                .items(items)
                .page(moviePage.getNumber())
                .size(moviePage.getSize())
                .totalElements(moviePage.getTotalElements())
                .totalPages(moviePage.getTotalPages())
                .isFirst(moviePage.isFirst())
                .isLast(moviePage.isLast())
                .build();
    }

    @Override
    public List<MovieResponse> getNowShowingMovies() {
        return movieRepository.findNowShowingMovies(LocalDate.now()).stream()
                .map(movieMapper::toMovieResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<MovieResponse> getComingSoonMovies() {
        return movieRepository.findComingSoonMovies(LocalDate.now()).stream()
                .map(movieMapper::toMovieResponse)
                .collect(Collectors.toList());
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .filter(m -> m.getTrangThai() != null && m.getTrangThai() == 1)
                .orElseThrow(() -> new BusinessException(404, "Không tìm thấy bộ phim có mã ID: " + id));
        return movieMapper.toMovieResponse(movie);
    }

    @Override
    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAllByOrderByTenAsc().stream()
                .map(movieMapper::toGenreResponse)
                .collect(Collectors.toList());
    }
}
