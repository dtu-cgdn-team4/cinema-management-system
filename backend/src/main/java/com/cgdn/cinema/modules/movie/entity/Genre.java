package com.cgdn.cinema.modules.movie.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "the_loai")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten", nullable = false, unique = true, length = 255)
    private String ten;

    @JsonIgnore
    @ManyToMany(mappedBy = "theLoai", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Movie> danhSachPhim = new HashSet<>();
}
