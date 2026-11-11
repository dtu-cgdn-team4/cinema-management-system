package com.cgdn.cinema.modules.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "the_loai")
public class TheLoai {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "ten", nullable = false, length = 100)
    private String ten;

    protected TheLoai() {
    }

    public TheLoai(String ten) {
        this.ten = ten;
    }

    public Long getId() {
        return id;
    }

    public String getTen() {
        return ten;
    }
}
