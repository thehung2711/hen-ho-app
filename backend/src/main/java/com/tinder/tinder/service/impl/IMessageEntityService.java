package com.tinder.tinder.service.impl;

import com.tinder.tinder.dto.request.ChatMessage;
import com.tinder.tinder.dto.request.ChatMessageDTO;

import java.util.List;

public interface IMessageEntityService {
    ChatMessage sendMessage(Long matchId, Long receiverId ,String content);
    List<ChatMessage> getMessages(Long matchId);
}
