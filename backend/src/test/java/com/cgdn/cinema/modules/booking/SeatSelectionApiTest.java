package com.cgdn.cinema.modules.booking;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.lang.reflect.Type;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import com.cgdn.cinema.IntegrationTest;
import com.cgdn.cinema.common.enums.SeatStatus;
import com.cgdn.cinema.modules.booking.controller.SeatController;
import com.cgdn.cinema.modules.booking.entity.SeatHold;
import com.cgdn.cinema.modules.booking.repository.SeatHoldRepository;
import com.cgdn.cinema.modules.booking.scheduler.SeatHoldReleaseJob;
import com.cgdn.cinema.modules.booking.service.SeatStatusBroadcaster;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;

/**
 * SRS 6.2.2 trên dữ liệu mẫu: mọi suất có ghế đã bán A01, A02, D05, D07, F08, F09.
 * Giữ ghế đi qua RabbitMQ (broker nhúng) và commit thật, nên mỗi test tự xóa ghế đã giữ.
 */
@IntegrationTest
class SeatSelectionApiTest {

    private static final String ME = "phien-cua-toi";
    private static final String OTHER = "phien-khac";

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Autowired
    private SeatHoldRepository seatHoldRepository;

    @Autowired
    private SeatHoldReleaseJob seatHoldReleaseJob;

    @LocalServerPort
    private int port;

    private long showtimeId;
    private final Map<String, Long> seatIds = new HashMap<>();

    @BeforeEach
    void pickFirstShowtime() throws Exception {
        showtimeId = data(mvc.perform(get("/api/v1/movies/1/showtimes"))).get(0).get("id").asLong();
        for (JsonNode row : seatMap(ME).get("rows")) {
            for (JsonNode seat : row.get("seats")) {
                seatIds.put(seat.get("label").asText(), seat.get("id").asLong());
            }
        }
    }

    @AfterEach
    void releaseTestHolds() {
        seatHoldRepository.deleteAllInBatch(seatHoldRepository.findAll().stream()
                .filter(h -> List.of(ME, OTHER).contains(h.getSessionId())).toList());
    }

    @Test
    void holdAndExpiryArePushedOverWebSocket() throws Exception {
        BlockingQueue<JsonNode> events = subscribe(SeatStatusBroadcaster.topic(showtimeId));

        hold(ME, "B04", "B05").andExpect(status().isOk());
        JsonNode taken = events.poll(5, TimeUnit.SECONDS);
        assertThat(taken).isNotNull();
        assertThat(taken.get("seats").findValuesAsText("status")).containsOnly("TAKEN");
        assertThat(taken.get("seats").findValues("seatId").stream().map(JsonNode::asLong))
                .containsExactlyInAnyOrder(seatIds.get("B04"), seatIds.get("B05"));

        // một ghế giữ đã quá hạn: job nhả ghế và báo AVAILABLE
        SeatHold expired = new SeatHold();
        expired.setShowtimeId(showtimeId);
        expired.setSeatId(seatIds.get("H12"));
        expired.setSessionId(OTHER);
        expired.setStatus(SeatStatus.DANG_GIU);
        expired.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        seatHoldRepository.save(expired);
        seatHoldReleaseJob.releaseExpiredHolds();

        JsonNode released = events.poll(5, TimeUnit.SECONDS);
        assertThat(released).isNotNull();
        assertThat(released.get("seats").get(0).get("seatId").asLong()).isEqualTo(seatIds.get("H12"));
        assertThat(released.get("seats").get(0).get("status").asText()).isEqualTo("AVAILABLE");
        assertThat(seatHoldRepository.findById(expired.getId())).isEmpty();
    }

    @Test
    void clientsCannotPublishSeatEvents() throws Exception {
        String topic = SeatStatusBroadcaster.topic(showtimeId);
        BlockingQueue<JsonNode> events = subscribe(topic);

        connect().send(topic, Map.of("showtimeId", showtimeId,
                "seats", List.of(Map.of("seatId", seatIds.get("B01"), "status", "TAKEN"))));

        assertThat(events.poll(1, TimeUnit.SECONDS)).isNull();
    }

    private StompSession connect() throws Exception {
        WebSocketStompClient client = new WebSocketStompClient(new StandardWebSocketClient());
        MappingJackson2MessageConverter converter = new MappingJackson2MessageConverter();
        converter.setObjectMapper(json);
        client.setMessageConverter(converter);
        return client.connectAsync("ws://localhost:" + port + "/ws", new StompSessionHandlerAdapter() {
        }).get(5, TimeUnit.SECONDS);
    }

    private BlockingQueue<JsonNode> subscribe(String destination) throws Exception {
        StompSession session = connect();
        BlockingQueue<JsonNode> events = new LinkedBlockingQueue<>();
        session.subscribe(destination, new StompFrameHandler() {
            @Override
            public Type getPayloadType(StompHeaders headers) {
                return JsonNode.class;
            }

            @Override
            public void handleFrame(StompHeaders headers, Object payload) {
                events.add((JsonNode) payload);
            }
        });
        Thread.sleep(300); // SUBSCRIBE xử lý bất đồng bộ phía server
        return events;
    }

    @Test
    void seatMapShowsRoomLayoutAndSoldSeats() throws Exception {
        JsonNode map = seatMap(ME);

        assertThat(map.get("rows").size()).isEqualTo(8);
        assertThat(seatIds).hasSize(96);
        assertThat(seatStatus(map, "A01")).isEqualTo("TAKEN");
        assertThat(seatStatus(map, "B01")).isEqualTo("AVAILABLE");
        assertThat(map.get("maxSeats").asInt()).isEqualTo(8);
        assertThat(map.get("holdSecondsLeft").isNull()).isTrue();
        assertThat(map.get("movie").get("id").asLong()).isEqualTo(1L);
    }

    @Test
    void holdMarksSeatsMineForMeAndTakenForOthers() throws Exception {
        JsonNode hold = data(hold(ME, "B04", "B05").andExpect(status().isOk()));
        assertThat(hold.get("seats").size()).isEqualTo(2);
        assertThat(hold.get("holdSecondsLeft").asInt()).isBetween(590, 600);
        assertThat(hold.get("total").asLong()).isEqualTo(hold.get("seats").get(0).get("price").asLong() * 2);

        JsonNode mine = seatMap(ME);
        assertThat(seatStatus(mine, "B04")).isEqualTo("MINE");
        assertThat(mine.get("holdSecondsLeft").asInt()).isPositive();
        assertThat(seatStatus(seatMap(OTHER), "B04")).isEqualTo("TAKEN");
        assertThat(seatMap(OTHER).get("showtime").get("availableSeats").asInt()).isEqualTo(96 - 6 - 2);
    }

    @Test
    void newHoldReplacesMyPreviousHold() throws Exception {
        hold(ME, "B04", "B05").andExpect(status().isOk());
        hold(ME, "C04").andExpect(status().isOk());

        JsonNode map = seatMap(ME);
        assertThat(seatStatus(map, "B04")).isEqualTo("AVAILABLE");
        assertThat(seatStatus(map, "C04")).isEqualTo("MINE");
    }

    @Test
    void cannotHoldTakenSeat() throws Exception {
        hold(ME, "A01").andExpect(status().isConflict())
                .andExpect(jsonPath("$.errorCode").value("SEAT_ALREADY_TAKEN"));
        hold(OTHER, "B04").andExpect(status().isOk());
        hold(ME, "B04").andExpect(status().isConflict());
    }

    @Test
    void rejectsSingleSeatGapButAllowsExistingOne() throws Exception {
        hold(ME, "C05").andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("SINGLE_SEAT_GAP"));
        hold(ME, "D06").andExpect(status().isOk()); // D06 đã là ghế lẻ giữa D05 và D07
    }

    @Test
    void rejectsWrongSeatCount() throws Exception {
        hold(ME).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errorCode").value("SEAT_COUNT_INVALID"));
        hold(ME, "B04", "B05", "B06", "B07", "B08", "B09", "C01", "C02", "C03")
                .andExpect(jsonPath("$.errorCode").value("SEAT_COUNT_INVALID"));
    }

    @Test
    void rejectsMissingSessionAndUnknownShowtime() throws Exception {
        mvc.perform(post("/api/v1/showtimes/" + showtimeId + "/seats/hold")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"seatIds\":[1]}"))
                .andExpect(status().isBadRequest());
        mvc.perform(get("/api/v1/showtimes/999999/seats"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.errorCode").value("SHOWTIME_NOT_FOUND"));
    }

    private ResultActions hold(String session, String... labels) throws Exception {
        List<Long> ids = List.of(labels).stream().map(seatIds::get).toList();
        return mvc.perform(post("/api/v1/showtimes/" + showtimeId + "/seats/hold")
                .header(SeatController.SESSION_HEADER, session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json.writeValueAsString(Map.of("seatIds", ids))));
    }

    private JsonNode seatMap(String session) throws Exception {
        return data(mvc.perform(get("/api/v1/showtimes/" + showtimeId + "/seats")
                .header(SeatController.SESSION_HEADER, session)).andExpect(status().isOk()));
    }

    private static String seatStatus(JsonNode map, String label) {
        for (JsonNode row : map.get("rows")) {
            for (JsonNode seat : row.get("seats")) {
                if (seat.get("label").asText().equals(label)) {
                    return seat.get("status").asText();
                }
            }
        }
        throw new AssertionError("Không có ghế " + label);
    }

    private JsonNode data(ResultActions result) throws Exception {
        return json.readTree(result.andReturn().getResponse().getContentAsString()).get("data");
    }
}
