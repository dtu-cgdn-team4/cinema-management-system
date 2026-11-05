package com.cgdn.cinema.modules.booking.repository;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import com.cgdn.cinema.common.enums.SeatStatus;
import com.cgdn.cinema.modules.booking.entity.SeatHold;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SeatHoldRepository extends JpaRepository<SeatHold, Long> {

    /** Ghế đang có người: mọi bản ghi trừ DANG_GIU đã quá hạn. */
    String ACTIVE = "(h.status <> com.cgdn.cinema.common.enums.SeatStatus.DANG_GIU or h.expiresAt > :now)";

    @Query("select h from SeatHold h where h.showtimeId = :showtimeId and " + ACTIVE)
    List<SeatHold> findActive(@Param("showtimeId") Long showtimeId, @Param("now") LocalDateTime now);

    /** Mỗi phần tử: [showtimeId, số ghế đã có người]. */
    @Query("select h.showtimeId, count(h) from SeatHold h where h.showtimeId in :ids and " + ACTIVE
            + " group by h.showtimeId")
    List<Object[]> countActiveByShowtime(@Param("ids") Collection<Long> showtimeIds, @Param("now") LocalDateTime now);

    List<SeatHold> findByShowtimeId(Long showtimeId);

    List<SeatHold> findByStatusAndExpiresAtLessThanEqual(SeatStatus status, LocalDateTime time);
}
