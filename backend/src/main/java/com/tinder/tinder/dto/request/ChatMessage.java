package com.tinder.tinder.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    private Long matchId;
    private Long senderId;
    private String senderName;
    private String content;
    private boolean isRead;
    private LocalDateTime sentAt;
}
