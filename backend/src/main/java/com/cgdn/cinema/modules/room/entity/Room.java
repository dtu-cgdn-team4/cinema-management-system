package com.cgdn.cinema.modules.room.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "phong_chieu")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_phong")
    private String name;

    @Column(name = "so_hang")
    private Integer rowCount;

    @Column(name = "so_cot")
    private Integer columnCount;

    @Column(name = "trang_thai")
    private Integer status;
}
