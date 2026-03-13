package com.tinder.tinder.service;

import com.tinder.tinder.dto.request.ChatMessage;
import com.tinder.tinder.dto.request.ChatMessageDTO;
import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.exception.AppException;
import com.tinder.tinder.exception.ErrorException;
import com.tinder.tinder.model.Matches;
import com.tinder.tinder.model.MessageEntity;
import com.tinder.tinder.model.Users;
import com.tinder.tinder.repository.MatchRepository;
import com.tinder.tinder.repository.MessageRepository;
import com.tinder.tinder.repository.UserRepository;
import com.tinder.tinder.service.impl.IMessageEntityService;
import com.tinder.tinder.utils.UtilsService;
import jdk.jshell.execution.Util;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class MessageEntityService implements IMessageEntityService {
    private final MessageRepository messageRepository;
    private final MatchRepository matchesRepository;
    private final UserRepository usersRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UtilsService utilsService;
    @Override
    public ChatMessage sendMessage(Long matchId, Long receiverId ,String content) {
        Long senderId = utilsService.getUserIdFromToken();
        Matches match = matchesRepository.findById(matchId)
                .orElseThrow(() -> new AppException(ErrorException.USER_NOT_EXIST));

        Users sender = usersRepository.findById(senderId)
                .orElseThrow(() -> new AppException(ErrorException.MATCH_NOT_FOUND));

        if (!Objects.equals(match.getUser1().getId(), senderId) &&
                !Objects.equals(match.getUser2().getId(), senderId)) {
            throw new AppException(ErrorException.USER_NOT_OF_MATCH);
        }

        MessageEntity message = new MessageEntity();
        message.setContent(content);
        message.setMatch(match);
        message.setSender(sender);
        message.setSentAt(LocalDateTime.now());
        message.setRead(false);
        messageRepository.save(message);

        // Convert sang DTO để gửi WebSocket
        ChatMessage dto = mapToDTO(message);
        messagingTemplate.convertAndSend("/topic/chat/" + receiverId, dto);

        log.info("ĐÃ GỬI MESSAGE từ user {} đến user {}", senderId, receiverId);
        return mapToDTO(message);
    }

    private ChatMessage mapToDTO(MessageEntity entity) {
        return ChatMessage.builder()
                .matchId(entity.getMatch().getId())
                .senderId(entity.getSender().getId())
                .senderName(entity.getSender().getFullName())
                .content(entity.getContent())
                .isRead(entity.isRead())
                .sentAt(entity.getSentAt())
                .build();
    }

    @Override
    public List<ChatMessage> getMessages(Long matchId) {
        Long currentUserId = utilsService.getUserIdFromToken();
        List<MessageEntity> messages = messageRepository.findByMatchIdOrderBySentAtAsc(matchId);

        List<MessageEntity> unreadMessages = messages.stream()
                .filter(m -> !m.isRead() && !m.getSender().getId().equals(currentUserId))
                .toList();
        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(m -> m.setRead(true));
            messageRepository.saveAll(unreadMessages);

//            for (MessageEntity msg : unreadMessages) {
//                Long senderId = msg.getSender().getId();
//                messagingTemplate.convertAndSend("/topic/read/" + senderId,
//                        Map.of("matchId", matchId, "readerId", currentUserId));
//            }
        }

        return messages.stream()
                .map(this::mapToDTO)
                .toList();
    }
}
