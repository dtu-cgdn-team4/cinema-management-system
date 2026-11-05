package com.cgdn.cinema.modules.booking.service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Stream;
import com.cgdn.cinema.modules.booking.dto.response.SeatMapResponse.Availability;
import com.cgdn.cinema.modules.booking.dto.response.SeatStatusEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/** Đẩy trạng thái ghế mới cho mọi người đang xem cùng suất chiếu (WebSocket STOMP). */
@Component
@RequiredArgsConstructor
public class SeatStatusBroadcaster {

    private final SimpMessagingTemplate messagingTemplate;

    public static String topic(Long showtimeId) {
        return "/topic/showtimes/" + showtimeId + "/seats";
    }

    /** Gọi sau khi transaction đã commit để người xem không thấy trạng thái chưa lưu. */
    public void publish(Long showtimeId, Collection<Long> available, Collection<Long> taken) {
        List<SeatStatusEvent.Change> seats = Stream.concat(
                available.stream().map(id -> new SeatStatusEvent.Change(id, Availability.AVAILABLE)),
                taken.stream().map(id -> new SeatStatusEvent.Change(id, Availability.TAKEN))).toList();
        if (!seats.isEmpty()) {
            messagingTemplate.convertAndSend(topic(showtimeId), new SeatStatusEvent(showtimeId, seats));
        }
    }
}
