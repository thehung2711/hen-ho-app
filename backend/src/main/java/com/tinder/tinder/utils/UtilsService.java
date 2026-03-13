package com.tinder.tinder.utils;

import com.tinder.tinder.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class UtilsService {
    private final HttpServletRequest request;
    private final JwtUtil jwtUtil;
    public UtilsService(HttpServletRequest request,JwtUtil jwtUtil) {
        this.request = request;
        this.jwtUtil = jwtUtil;
    }
    public Long getUserIdFromToken() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            // Nếu Principal là ID (từ WebSocket) hoặc đối tượng chứa ID
            Object principal = authentication.getPrincipal();
            if (principal instanceof String) {
                try {
                    return Long.parseLong((String) principal);
                } catch (NumberFormatException e) {
                    // Xử lý nếu principal là username thay vì ID
                }
            }
            
            // Cách fallback: lấy từ header nếu là HTTP request (để tương thích ngược)
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                return jwtUtil.getUserIdFromToken(token);
            }
        }
        return 0L;
    }
}
