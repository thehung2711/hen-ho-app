package com.tinder.tinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponse {
    private Long matchId;
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private Integer numberOfMessDontSend;
    private Boolean isRead;
}
