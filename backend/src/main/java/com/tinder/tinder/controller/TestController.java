package com.tinder.tinder.controller;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.logging.Logger;

@RestController
@Slf4j
public class TestController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    // Endpoint để test ép gửi tin nhắn
    @GetMapping("/test-ws/{userId}")
    public String testWebSocket(@PathVariable String userId) {
        String messagePayload = "{\"type\":\"TEST\", \"content\":\"Đây là tin nhắn test lúc " + System.currentTimeMillis() + "\"}";

        log.info(" ĐANG TEST ÉP GỬI TIN NHẮN TỚI USER: {}", userId);

        messagingTemplate.convertAndSend("/topic/like/" + userId, messagePayload);

        log.info("--- ĐÃ GỬI TEST MESSAGE ---");
        return "Đã gửi test message cho user: " + userId;
    }
}
