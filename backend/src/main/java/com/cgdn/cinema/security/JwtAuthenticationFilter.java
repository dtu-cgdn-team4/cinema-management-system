package com.cgdn.cinema.security;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Đọc "Authorization: Bearer <JWT>": sub là id người dùng, role là vai trò (Role).
 * Token sai hoặc hết hạn thì coi như chưa đăng nhập: trang công khai vẫn xem được, đường dẫn cần đăng nhập trả 401.
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER = "Bearer ";

    private final JwtDecoder jwtDecoder;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith(BEARER)) {
            authenticate(header.substring(BEARER.length()));
        }
        chain.doFilter(request, response);
    }

    private void authenticate(String token) {
        try {
            Jwt jwt = jwtDecoder.decode(token);
            Long userId = Long.valueOf(jwt.getSubject());
            String role = jwt.getClaimAsString("role");
            if (role != null) {
                SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                        userId, null, List.of(new SimpleGrantedAuthority("ROLE_" + role))));
            }
        } catch (JwtException | NumberFormatException e) {
            SecurityContextHolder.clearContext();
        }
    }
}
