package com.cgdn.cinema;

import com.cgdn.cinema.modules.auth.service.AuthFailure;
import com.cgdn.cinema.modules.auth.service.GoogleIdentity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.Map;
import javax.sql.DataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:auth;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.flyway.enabled=false",
    "app.jwt.secret=test-only-key-with-at-least-thirty-two-bytes",
    "app.frontend-url=http://localhost:3000",
    "debug=false",
    "logging.level.root=INFO",
    "logging.level.org.springframework=INFO"
})
@AutoConfigureMockMvc
class AuthIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired DataSource dataSource;
    @Autowired JdbcTemplate jdbc;
    @MockitoBean GoogleIdentity google;

    @BeforeEach
    void seed() throws Exception {
        try (Connection connection = dataSource.getConnection()) {
            connection.createStatement().execute("DROP ALL OBJECTS");
            String sql = new ClassPathResource("test-schema.sql").getContentAsString(StandardCharsets.UTF_8).replace("\uFEFF", "");
            ScriptUtils.executeSqlScript(connection, new ByteArrayResource(sql.getBytes(StandardCharsets.UTF_8)));
        }
        when(google.clientId()).thenReturn("test-client");
    }

    private ResultActions postJson(String path, Object body) throws Exception {
        return mvc.perform(post("/api/auth/" + path).contentType("application/json").content(json.writeValueAsString(body)));
    }

    private JsonNode login(String email, String password) throws Exception {
        var response = postJson("login", Map.of("email", email, "password", password, "rememberMe", false))
                .andExpect(status().isOk()).andReturn().getResponse();
        return json.readTree(response.getContentAsString());
    }

    @ParameterizedTest
    @CsvSource({
        "admin@example.com,ROLE_ADMIN,admin",
        "nhanvien1@example.com,ROLE_STAFF,staff",
        "khach1@example.com,ROLE_USER,user"
    })
    void loginAndAuthorizeActualJwt(String email, String role, String area) throws Exception {
        var session = login(email, "123456");
        assertThat(session.path("user").path("role").asText()).isEqualTo(role);
        String token = session.path("token").asText();
        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("email").value(email));
        mvc.perform(get("/api/" + area + "/session").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
        if (!role.equals("ROLE_ADMIN")) {
            mvc.perform(get("/api/admin/session").header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());
        }
        if (role.equals("ROLE_USER")) {
            mvc.perform(get("/api/staff/session").header("Authorization", "Bearer " + token))
                    .andExpect(status().isForbidden());
        }
    }

    @Test
    void lockAfterFiveFailuresAndRejectSubsequentLogins() throws Exception {
        for (int i = 0; i < 4; i++) {
            postJson("login", Map.of("email", "khach1@example.com", "password", "wrong"))
                    .andExpect(status().isUnauthorized());
        }
        postJson("login", Map.of("email", "khach1@example.com", "password", "wrong"))
                .andExpect(status().isLocked());
        postJson("login", Map.of("email", "khach1@example.com", "password", "123456"))
                .andExpect(status().isForbidden());
        assertThat(jdbc.queryForObject("SELECT so_lan_dang_nhap_sai FROM nguoi_dung WHERE id=1", Integer.class)).isEqualTo(5);
        assertThat(jdbc.queryForObject("SELECT bi_khoa FROM nguoi_dung WHERE id=1", Boolean.class)).isTrue();

        jdbc.update("UPDATE nguoi_dung SET bi_khoa=FALSE, so_lan_dang_nhap_sai=0 WHERE id=1");
        login("khach1@example.com", "123456");
        assertThat(jdbc.queryForObject("SELECT so_lan_dang_nhap_sai FROM nguoi_dung WHERE id=1", Integer.class)).isZero();
    }

    @Test
    void unknownEmailAndWrongPasswordHaveSameResponse() throws Exception {
        String unknown = postJson("login", Map.of("email", "missing@example.com", "password", "wrong"))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        String wrong = postJson("login", Map.of("email", "khach1@example.com", "password", "wrong"))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        assertThat(unknown).isEqualTo(wrong);
    }

    @Test
    void badTokenAndMissingTokenAreRejected() throws Exception {
        mvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/auth/me").header("Authorization", "Bearer invalid.jwt.value")).andExpect(status().isUnauthorized());
    }

    @Test
    void databaseRoleIsCheckedOnEveryRequest() throws Exception {
        String token = login("admin@example.com", "123456").path("token").asText();
        jdbc.update("UPDATE nguoi_dung SET vai_tro='KHACH_HANG' WHERE id=4");
        mvc.perform(get("/api/admin/session").header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());

        String userToken = login("khach1@example.com", "123456").path("token").asText();
        jdbc.update("UPDATE nguoi_dung SET bi_khoa=TRUE WHERE id=1");
        mvc.perform(get("/api/user/session").header("Authorization", "Bearer " + userToken))
                .andExpect(status().isForbidden());
    }

    @Test
    void googleCreatesUserWithCustomerRole() throws Exception {
        when(google.verify("verified-token"))
                .thenReturn(new GoogleIdentity.Identity("google-sub", "new@gmail.com", "Google User", true));
        postJson("google", Map.of("token", "verified-token", "rememberMe", false))
                .andExpect(status().isOk())
                .andExpect(jsonPath("user.role").value("ROLE_USER"))
                .andExpect(jsonPath("user.email").value("new@gmail.com"));
        assertThat(jdbc.queryForObject("SELECT vai_tro FROM nguoi_dung WHERE google_id='google-sub'", String.class))
                .isEqualTo("KHACH_HANG");
    }

    @Test
    void googleLinksAuthoritativeEmailButNeverEscalatesRole() throws Exception {
        when(google.verify("verified-token"))
                .thenReturn(new GoogleIdentity.Identity("google-sub", "khach1@example.com", "Someone", true));
        postJson("google", Map.of("token", "verified-token", "rememberMe", false))
                .andExpect(status().isOk())
                .andExpect(jsonPath("user.id").value(1))
                .andExpect(jsonPath("user.role").value("ROLE_USER"));
        assertThat(jdbc.queryForObject("SELECT google_id FROM nguoi_dung WHERE id=1", String.class))
                .isEqualTo("google-sub");
    }

    @Test
    void googleCannotBypassLockOrClaimAnUntrustedEmail() throws Exception {
        when(google.verify("untrusted"))
                .thenReturn(new GoogleIdentity.Identity("google-sub", "khach1@example.com", "User", false));
        postJson("google", Map.of("token", "untrusted", "rememberMe", false)).andExpect(status().isConflict());

        jdbc.update("UPDATE nguoi_dung SET bi_khoa=TRUE WHERE id=1");
        when(google.verify("verified-token"))
                .thenReturn(new GoogleIdentity.Identity("google-sub", "khach1@example.com", "User", true));
        postJson("google", Map.of("token", "verified-token", "rememberMe", false)).andExpect(status().isForbidden());
    }

    @Test
    void invalidGoogleCredentialDoesNotCreateAccount() throws Exception {
        when(google.verify("forged")).thenThrow(new AuthFailure(HttpStatus.UNAUTHORIZED, "Invalid Google token"));
        postJson("google", Map.of("token", "forged", "rememberMe", false)).andExpect(status().isUnauthorized());
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM nguoi_dung", Integer.class)).isEqualTo(4);
    }
}
