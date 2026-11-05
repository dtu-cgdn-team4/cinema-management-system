package com.cgdn.cinema.modules.booking.service;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;
import com.cgdn.cinema.common.constants.AppConstants;
import com.cgdn.cinema.common.enums.SeatStatus;
import com.cgdn.cinema.common.enums.SeatType;
import com.cgdn.cinema.exception.BusinessException;
import com.cgdn.cinema.exception.ErrorCode;
import com.cgdn.cinema.modules.booking.dto.response.SeatHoldResponse;
import com.cgdn.cinema.modules.booking.dto.response.SeatMapResponse;
import com.cgdn.cinema.modules.booking.dto.response.SeatMapResponse.Availability;
import com.cgdn.cinema.modules.booking.entity.SeatHold;
import com.cgdn.cinema.modules.booking.queue.SeatHoldCommand;
import com.cgdn.cinema.modules.booking.queue.SeatHoldProducer;
import com.cgdn.cinema.modules.booking.repository.SeatHoldRepository;
import com.cgdn.cinema.modules.movie.service.MovieService;
import com.cgdn.cinema.modules.pricing.service.PricingService;
import com.cgdn.cinema.modules.room.entity.Seat;
import com.cgdn.cinema.modules.room.service.RoomService;
import com.cgdn.cinema.modules.showtime.dto.response.ShowtimeResponse;
import com.cgdn.cinema.modules.showtime.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/** Sơ đồ ghế và giữ ghế, theo "Luồng đặt vé online" trong architecture.md. */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SeatHoldService {

    private final SeatHoldRepository seatHoldRepository;
    private final SeatHoldProducer seatHoldProducer;
    private final ShowtimeService showtimeService;
    private final MovieService movieService;
    private final RoomService roomService;
    private final PricingService pricingService;
    private final Clock clock;

    /** Kết quả ghi giữ ghế: released là ghế được nhả (giữ cũ của phiên này, giữ đã quá hạn) để báo AVAILABLE. */
    public record HoldOutcome(SeatHoldResponse response, Set<Long> released) {
    }

    /** Bước 1: sơ đồ ghế kèm trạng thái từng ghế; sessionId có thể null (chưa giữ ghế nào). */
    public SeatMapResponse getSeatMap(Long showtimeId, String sessionId) {
        ShowtimeResponse showtime = showtimeService.getUpcomingShowtime(showtimeId);
        LocalDateTime now = LocalDateTime.now(clock);
        Map<Long, SeatHold> holds = seatHoldRepository.findActive(showtimeId, now).stream()
                .collect(Collectors.toMap(SeatHold::getSeatId, Function.identity()));

        Map<String, List<SeatMapResponse.Cell>> rows = new LinkedHashMap<>();
        for (Seat seat : roomService.getSeats(showtime.room().id())) {
            SeatHold hold = holds.get(seat.getId());
            Availability status = hold == null ? Availability.AVAILABLE
                    : isHeldBy(hold, sessionId) ? Availability.MINE : Availability.TAKEN;
            rows.computeIfAbsent(seat.getRowName(), k -> new ArrayList<>())
                    .add(new SeatMapResponse.Cell(seat.getId(), label(seat), seat.getNumber(), seat.getGridColumn(),
                            seat.getType(), status));
        }
        Integer secondsLeft = holds.values().stream()
                .filter(h -> isHeldBy(h, sessionId))
                .map(SeatHold::getExpiresAt)
                .min(Comparator.naturalOrder())
                .map(t -> secondsBetween(now, t))
                .orElse(null);

        return new SeatMapResponse(
                movieService.getMovie(showtime.movieId()),
                showtime,
                pricingService.getPricesForDay(showtime.startTime().getDayOfWeek()),
                AppConstants.MAX_SEATS_PER_BOOKING,
                rows.entrySet().stream().map(e -> new SeatMapResponse.Row(e.getKey(), e.getValue())).toList(),
                secondsLeft);
    }

    /**
     * Bước 2: kiểm tra quy tắc chọn ghế để báo lỗi sớm, rồi đẩy yêu cầu vào queue và chờ consumer trả kết quả.
     * Không mở transaction trong lúc chờ queue.
     */
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public SeatHoldResponse requestHold(Long showtimeId, String sessionId, List<Long> seatIds) {
        check(showtimeId, sessionId, seatIds, LocalDateTime.now(clock));
        return seatHoldProducer.send(new SeatHoldCommand(showtimeId, sessionId, seatIds));
    }

    /**
     * Bước 3, chỉ consumer của queue gọi (xử lý lần lượt): kiểm tra lại trên trạng thái mới nhất, nhả giữ cũ của
     * phiên này và giữ đã quá hạn, rồi ghi DANG_GIU hạn 10 phút trong một transaction.
     * Unique (suat_chieu_id, ghe_id) là lớp chặn cuối chống bán trùng.
     */
    @Transactional
    public HoldOutcome holdSeats(Long showtimeId, String sessionId, List<Long> seatIds) {
        LocalDateTime now = LocalDateTime.now(clock);
        Selection selection = check(showtimeId, sessionId, seatIds, now);

        seatHoldRepository.deleteAllInBatch(selection.toRelease());
        LocalDateTime expiresAt = now.plusMinutes(AppConstants.SEAT_HOLD_MINUTES);
        List<SeatHold> holds = selection.selected().stream().map(seatId -> {
            SeatHold hold = new SeatHold();
            hold.setShowtimeId(showtimeId);
            hold.setSeatId(seatId);
            hold.setSessionId(sessionId);
            hold.setStatus(SeatStatus.DANG_GIU);
            hold.setExpiresAt(expiresAt);
            return hold;
        }).toList();
        try {
            seatHoldRepository.saveAllAndFlush(holds);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException(ErrorCode.SEAT_ALREADY_TAKEN);
        }

        Map<SeatType, Long> prices = pricingService.getPricesForDay(selection.showtime().startTime().getDayOfWeek());
        List<SeatHoldResponse.HeldSeat> held = selection.selected().stream().map(selection.seatById()::get)
                .map(s -> new SeatHoldResponse.HeldSeat(s.getId(), label(s), s.getType(), prices.get(s.getType())))
                .toList();
        long total = held.stream().mapToLong(SeatHoldResponse.HeldSeat::price).sum();

        Set<Long> released = selection.toRelease().stream().map(SeatHold::getSeatId)
                .collect(Collectors.toCollection(HashSet::new));
        released.removeAll(selection.selected());
        return new HoldOutcome(new SeatHoldResponse(showtimeId, held, total, secondsBetween(now, expiresAt)), released);
    }

    /** Bước 7: xóa mọi ghế "đang giữ" đã quá hạn; trả về suất chiếu → ghế được nhả. */
    @Transactional
    public Map<Long, List<Long>> releaseExpiredHolds() {
        List<SeatHold> expired = seatHoldRepository.findByStatusAndExpiresAtLessThanEqual(
                SeatStatus.DANG_GIU, LocalDateTime.now(clock));
        seatHoldRepository.deleteAllInBatch(expired);
        return expired.stream().collect(Collectors.groupingBy(SeatHold::getShowtimeId,
                Collectors.mapping(SeatHold::getSeatId, Collectors.toList())));
    }

    private record Selection(ShowtimeResponse showtime, Map<Long, Seat> seatById, Set<Long> selected,
                             List<SeatHold> toRelease) {
    }

    /** Quy tắc chọn ghế (business-rules.md); ném BusinessException nếu vi phạm. */
    private Selection check(Long showtimeId, String sessionId, List<Long> seatIds, LocalDateTime now) {
        if (sessionId == null || sessionId.isBlank() || sessionId.length() > 64) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST);
        }
        Set<Long> selected = new LinkedHashSet<>(seatIds);
        if (selected.isEmpty() || selected.size() > AppConstants.MAX_SEATS_PER_BOOKING) {
            throw new BusinessException(ErrorCode.SEAT_COUNT_INVALID);
        }
        ShowtimeResponse showtime = showtimeService.getUpcomingShowtime(showtimeId);
        List<Seat> seats = roomService.getSeats(showtime.room().id());
        Map<Long, Seat> seatById = seats.stream().collect(Collectors.toMap(Seat::getId, Function.identity()));
        if (!seatById.keySet().containsAll(selected)) {
            throw new BusinessException(ErrorCode.SEAT_NOT_FOUND);
        }

        List<SeatHold> toRelease = new ArrayList<>();
        Set<Long> taken = new HashSet<>();
        for (SeatHold hold : seatHoldRepository.findByShowtimeId(showtimeId)) {
            boolean expired = hold.getStatus() == SeatStatus.DANG_GIU && !hold.getExpiresAt().isAfter(now);
            if (expired || isHeldBy(hold, sessionId)) {
                toRelease.add(hold);
            } else {
                taken.add(hold.getSeatId());
            }
        }
        if (selected.stream().anyMatch(taken::contains)) {
            throw new BusinessException(ErrorCode.SEAT_ALREADY_TAKEN);
        }
        if (SeatRuleValidator.leavesSingleSeatGap(seats, taken, selected)) {
            throw new BusinessException(ErrorCode.SINGLE_SEAT_GAP);
        }
        return new Selection(showtime, seatById, selected, toRelease);
    }

    private static boolean isHeldBy(SeatHold hold, String sessionId) {
        return hold.getStatus() == SeatStatus.DANG_GIU && hold.getSessionId().equals(sessionId);
    }

    private static String label(Seat seat) {
        return seat.getRowName() + String.format("%02d", seat.getNumber());
    }

    private static int secondsBetween(LocalDateTime from, LocalDateTime to) {
        return (int) Math.max(0, Duration.between(from, to).toSeconds());
    }
}
