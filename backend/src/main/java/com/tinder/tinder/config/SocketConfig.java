package com.tinder.tinder.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class SocketConfig implements WebSocketMessageBrokerConfigurer {
    @Value("${stomp.broker.relay.host}")
    private String relayHost;

    @Value("${stomp.broker.relay.port}")
    private int relayPort;

    @Value("${stomp.broker.relay.login}")
    private String relayLogin;

    @Value("${stomp.broker.relay.passcode}")
    private String relayPasscode;
    @Autowired
    private AuthChannelInterceptor authChannelInterceptor;
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // endpoint kết nối từ client
                .setAllowedOriginPatterns("*") // cho phép mọi domain
                .withSockJS(); // fallback nếu không hỗ trợ WS
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); // prefix client gửi tin
        registry.enableSimpleBroker("/topic", "/queue"); // prefix server gửi tin
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(authChannelInterceptor);
    }
}
