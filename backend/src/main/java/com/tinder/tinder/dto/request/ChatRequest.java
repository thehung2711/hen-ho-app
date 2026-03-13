package com.tinder.tinder.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatRequest {
    private String content;
    private Long matchId;
    private Long receiverId;
}
