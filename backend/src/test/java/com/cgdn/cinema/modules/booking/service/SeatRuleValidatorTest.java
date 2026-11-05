package com.cgdn.cinema.modules.booking.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import com.cgdn.cinema.modules.room.entity.Seat;
import org.junit.jupiter.api.Test;

/** Một hàng 12 ghế, lối đi sau ghế 03 và 09: dãy 01–03, 04–09, 10–12. Id ghế = số ghế. */
class SeatRuleValidatorTest {

    private static final List<Seat> ROW = row();

    private static boolean gap(Set<Long> taken, Set<Long> selected) {
        return SeatRuleValidator.leavesSingleSeatGap(ROW, taken, selected);
    }

    @Test
    void businessRulesExample() {
        // dãy 04–09, ghế 04 và 09 đã có người
        assertThat(gap(Set.of(4L, 9L), Set.of(5L, 6L))).isFalse();
        assertThat(gap(Set.of(4L, 9L), Set.of(6L, 7L))).isTrue();
    }

    @Test
    void emptyThreeSeatBlockDoesNotTakeAPair() {
        assertThat(gap(Set.of(), Set.of(1L, 2L))).isTrue();
        assertThat(gap(Set.of(), Set.of(2L, 3L))).isTrue();
        assertThat(gap(Set.of(), Set.of(1L, 2L, 3L))).isFalse();
        assertThat(gap(Set.of(), Set.of(1L))).isFalse();
        assertThat(gap(Set.of(), Set.of(2L))).isTrue();
    }

    @Test
    void existingSingleSeatDoesNotBlockAndCanBeChosen() {
        Set<Long> taken = Set.of(5L, 7L); // 06 đã là ghế lẻ từ trước
        assertThat(gap(taken, Set.of(6L))).isFalse();
        assertThat(gap(taken, Set.of(8L, 9L))).isFalse();
        assertThat(gap(taken, Set.of(8L))).isTrue(); // 09 thành ghế lẻ sát ghế vừa chọn
    }

    @Test
    void aisleIsABlockBoundary() {
        assertThat(gap(Set.of(), Set.of(4L))).isFalse(); // ghế 03 bên kia lối đi không tính
        assertThat(gap(Set.of(), Set.of(10L))).isFalse();
        assertThat(gap(Set.of(), Set.of(11L))).isTrue();
        assertThat(gap(Set.of(), Set.of(3L, 4L))).isFalse();
    }

    private static List<Seat> row() {
        List<Seat> seats = new ArrayList<>();
        for (int n = 1; n <= 12; n++) {
            Seat seat = new Seat();
            seat.setId((long) n);
            seat.setRowName("A");
            seat.setNumber(n);
            seat.setGridColumn(n <= 3 ? n : n <= 9 ? n + 1 : n + 2);
            seats.add(seat);
        }
        return seats;
    }
}
