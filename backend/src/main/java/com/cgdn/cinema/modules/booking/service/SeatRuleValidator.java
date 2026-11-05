package com.cgdn.cinema.modules.booking.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import com.cgdn.cinema.modules.room.entity.Seat;

/**
 * Quy tắc ghế trống lẻ (business-rules.md, Q&A #8, chốt 05/11/2026).
 * Dãy ghế tách theo vi_tri_cot không liên tiếp (lối đi) và đầu hàng. Lựa chọn không hợp lệ khi tạo ra
 * đoạn trống dài đúng 1 ghế nằm sát ghế khách vừa chọn; ghế lẻ có sẵn từ trước không chặn khách.
 */
public final class SeatRuleValidator {

    private SeatRuleValidator() {
    }

    /**
     * @param seats    toàn bộ ghế của phòng
     * @param taken    ghế đã có người (đang giữ, chờ thanh toán, đã thanh toán), không gồm ghế đang chọn
     * @param selected ghế khách đang chọn
     */
    public static boolean leavesSingleSeatGap(List<Seat> seats, Set<Long> taken, Set<Long> selected) {
        Map<String, List<Seat>> rows = seats.stream().collect(Collectors.groupingBy(Seat::getRowName));
        for (List<Seat> row : rows.values()) {
            List<Seat> line = row.stream().sorted(Comparator.comparing(Seat::getGridColumn)).toList();
            for (int i = 0; i < line.size(); i++) {
                Seat seat = line.get(i);
                if (!isEmpty(seat, taken, selected)) {
                    continue;
                }
                Seat left = i > 0 && adjacent(line.get(i - 1), seat) ? line.get(i - 1) : null;
                Seat right = i + 1 < line.size() && adjacent(seat, line.get(i + 1)) ? line.get(i + 1) : null;
                boolean single = (left == null || !isEmpty(left, taken, selected))
                        && (right == null || !isEmpty(right, taken, selected));
                if (single && (isSelected(left, selected) || isSelected(right, selected))) {
                    return true;
                }
            }
        }
        return false;
    }

    private static boolean adjacent(Seat a, Seat b) {
        return b.getGridColumn() - a.getGridColumn() == 1;
    }

    private static boolean isEmpty(Seat seat, Set<Long> taken, Set<Long> selected) {
        return !taken.contains(seat.getId()) && !selected.contains(seat.getId());
    }

    private static boolean isSelected(Seat seat, Set<Long> selected) {
        return seat != null && selected.contains(seat.getId());
    }
}
