package com.cgdn.cinema.common.health;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class HealthControllerTest {
    private final JdbcTemplate jdbc = mock(JdbcTemplate.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new HealthController(jdbc)).build();

    @Test
    void returnsOkWhenMySqlResponds() throws Exception {
        when(jdbc.queryForObject("SELECT 1", Integer.class)).thenReturn(1);

        mvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.backend").value("UP"))
                .andExpect(jsonPath("$.mysql").value("UP"));
    }

    @Test
    void returnsServiceUnavailableWhenMySqlCannotBeReached() throws Exception {
        when(jdbc.queryForObject("SELECT 1", Integer.class))
                .thenThrow(new CannotGetJdbcConnectionException("Connection failed"));

        mvc.perform(get("/api/health"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.backend").value("UP"))
                .andExpect(jsonPath("$.mysql").value("DOWN"));
    }
}
