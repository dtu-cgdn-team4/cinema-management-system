package com.cgdn.cinema.modules.movie.repository;

import com.cgdn.cinema.modules.movie.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {
    Optional<Genre> findByTen(String ten);
    List<Genre> findAllByOrderByTenAsc();
}
