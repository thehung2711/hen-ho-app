package com.tinder.tinder.config;

import com.tinder.tinder.jwt.JwtUtil; // <-- IMPORT CLASS CỦA BẠN
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class AuthChannelInterceptor implements ChannelInterceptor {


    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // Chỉ kiểm tra khi client gửi lệnh CONNECT
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {

            // Lấy header 'Authorization' từ client (FE đã gửi)
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            log.info("Client WebSocket đang kết nối, Auth header: {}", authHeader);

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String jwt = authHeader.substring(7);

                try {
                    // Sử dụng JwtUtil của bạn để xác thực
                    if (jwtUtil.validateToken(jwt)) {

                        // 1. Trích xuất thông tin từ token
                        Claims claims = jwtUtil.extractClaims(jwt);
                        String username = claims.getSubject();
                        String role = claims.get("role", String.class);
                        Long userId = jwtUtil.getUserIdFromToken(jwt); // Lấy userId

                        // 2. Tạo đối tượng UserDetails (giống như trong JwtFilter)
                        UserDetails userDetails = User.withUsername(username)
                                .password("") // Không cần password
                                .roles(role.replace("ROLE_", ""))
                                .build();

                        // 3. DÒNG QUAN TRỌNG NHẤT:
                        // Tạo đối tượng Authentication
                        // Chúng ta đặt "name" của Principal là userId (dưới dạng String)
                        // vì bạn gửi message bằng user.getId().toString() ("2", "3", ...)
                        Authentication auth = new UsernamePasswordAuthenticationToken(
                                userId.toString(), // <-- Tên Principal PHẢI là "2", "3", ...
                                null,
                                userDetails.getAuthorities()
                        );

                        // 4. Đặt user đã xác thực vào session
                        accessor.setUser(auth);
                        log.info("User WebSocket đã xác thực. Tên Principal (ID): {}", auth.getName());
                    }

                } catch (Exception e) {
                    log.error("Lỗi xác thực WebSocket: {}", e.getMessage());
                    // Bạn có thể ném lỗi ở đây để từ chối kết nối
                }
            } else {
                log.warn("Client kết nối không có 'Authorization' header. Sẽ là anonymous.");
            }
        }
        return message;
    }
}
