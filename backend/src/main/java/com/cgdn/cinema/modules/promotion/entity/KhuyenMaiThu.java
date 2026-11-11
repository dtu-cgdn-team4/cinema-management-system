package com.cgdn.cinema.modules.promotion.entity;

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
@Table(name = "khuyen_mai_thu")
public class KhuyenMaiThu {
    @EmbeddedId
    private Key id;

    @MapsId("khuyenMaiId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "khuyen_mai_id", nullable = false)
    private KhuyenMai khuyenMai;

    public Key getId() {
        return id;
    }

    public KhuyenMai getKhuyenMai() {
        return khuyenMai;
    }

    @Embeddable
    public static class Key implements Serializable {
        @Column(name = "khuyen_mai_id", nullable = false)
        private Long khuyenMaiId;

        @Column(name = "thu_trong_tuan", nullable = false)
        private Byte thuTrongTuan;

        protected Key() {
        }

        public Key(Long khuyenMaiId, Byte thuTrongTuan) {
            this.khuyenMaiId = khuyenMaiId;
            this.thuTrongTuan = thuTrongTuan;
        }

        public Long getKhuyenMaiId() {
            return khuyenMaiId;
        }

        public Byte getThuTrongTuan() {
            return thuTrongTuan;
        }

        @Override
        public boolean equals(Object other) {
            return other instanceof Key key
                    && Objects.equals(khuyenMaiId, key.khuyenMaiId)
                    && Objects.equals(thuTrongTuan, key.thuTrongTuan);
        }

        @Override
        public int hashCode() {
            return Objects.hash(khuyenMaiId, thuTrongTuan);
        }
    }
}
