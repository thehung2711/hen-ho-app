package com.tinder.tinder.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private List<ChatMessage> messages;
    private Integer numberOfQuestionDontSend;
}
