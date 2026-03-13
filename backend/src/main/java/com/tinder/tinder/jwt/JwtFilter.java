package com.tinder.tinder.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtils;
    private final UserDetailsService userDetailsService;
    private final String SECRET_KEY = "y8Vq2M_LmJq5r0sZk3X-NaQv7Hf4t9pR6bS0uYwZ1eFqGx3";
    public JwtFilter(JwtUtil jwtUtils, UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String requestURI = request.getRequestURI();

        // Bỏ qua các endpoint công khai
        if (requestURI.equals("/api/auth/login") || requestURI.equals("/api/auth/register")
                || requestURI.equals("/api/auth/forgot-password") ||
                requestURI.startsWith("/ws") || requestURI.startsWith("/sockjs")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response); // Chuyển sang Spring Security xử lý 403 sau
            return;
        }

        try {
            String token = authHeader.substring(7);
            if (jwtUtils.validateToken(token)) {
                Claims claims = jwtUtils.extractClaims(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                Long userId = jwtUtils.getUserIdFromToken(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = User.withUsername(username)
                            .password("")
                            .roles(role.replace("ROLE_", ""))
                            .build();

                    // Đặt principal là userId dưới dạng String để thống nhất với WebSocket
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userId.toString(), null, userDetails.getAuthorities());

                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Có thể log lỗi ở đây
        }
        chain.doFilter(request, response);
    }
}
