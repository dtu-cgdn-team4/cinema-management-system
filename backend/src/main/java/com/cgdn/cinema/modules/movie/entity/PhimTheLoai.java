package com.cgdn.cinema.modules.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "phim_the_loai")
public class PhimTheLoai {
    @EmbeddedId
    private Key id;

    @MapsId("phimId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "phim_id", nullable = false)
    private Phim phim;

    @MapsId("theLoaiId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "the_loai_id", nullable = false)
    private TheLoai theLoai;

    public Key getId() {
        return id;
    }

    public Phim getPhim() {
        return phim;
    }

    public TheLoai getTheLoai() {
        return theLoai;
    }

    @Embeddable
    public static class Key implements Serializable {
        @Column(name = "phim_id", nullable = false)
        private Long phimId;

        @Column(name = "the_loai_id", nullable = false)
        private Long theLoaiId;

        protected Key() {
        }

        public Key(Long phimId, Long theLoaiId) {
            this.phimId = phimId;
            this.theLoaiId = theLoaiId;
        }

        public Long getPhimId() {
            return phimId;
        }

        public Long getTheLoaiId() {
            return theLoaiId;
        }

        @Override
        public boolean equals(Object other) {
            return other instanceof Key key
                    && Objects.equals(phimId, key.phimId)
                    && Objects.equals(theLoaiId, key.theLoaiId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(phimId, theLoaiId);
        }
    }
}
