package com.tinder.tinder.service;

import com.tinder.tinder.dto.response.MatchResponse;
import com.tinder.tinder.model.Matches;
import com.tinder.tinder.model.MessageEntity;
import com.tinder.tinder.model.Users;
import com.tinder.tinder.repository.MatchRepository;
import com.tinder.tinder.repository.MessageRepository;
import com.tinder.tinder.service.impl.IMatchService;
import com.tinder.tinder.utils.UtilsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MatchService implements IMatchService {
    private final MatchRepository matchesRepository;
    private final MessageRepository messageRepository;
    private final UtilsService utilsService;
    @Override
    public List<MatchResponse> getUserMatches() {
        Long currentUserId = utilsService.getUserIdFromToken();

        // Lấy tất cả match của user hiện tại
        List<Matches> matches = matchesRepository.findAllByUserId(currentUserId);
        List<MatchResponse> responses = new ArrayList<>();

        for (Matches match : matches) {
            // Xác định user còn lại trong match
            Users otherUser = match.getUser1().getId().equals(currentUserId)
                    ? match.getUser2()
                    : match.getUser1();

            //  Lấy tin nhắn cuối cùng bằng native query
            Optional<MessageEntity> lastMsgOpt = messageRepository.findLastMessageByMatchId(match.getId());
            List<MessageEntity> msgE = messageRepository.findAllByMatchIdAndSenderAndIsRead(match.getId(), otherUser, false);
            String lastMessage = lastMsgOpt.map(MessageEntity::getContent).orElse("Chưa có tin nhắn");
            LocalDateTime lastMessageTime = lastMsgOpt.map(MessageEntity::getSentAt).orElse(null);

            // Có thể thêm người gửi cuối cùng
            Long lastSenderId = lastMsgOpt.map(msg -> msg.getSender().getId()).orElse(null);
            String prefix = "";
            if (lastSenderId != null) {
                prefix = lastSenderId.equals(currentUserId) ? "Bạn: " : otherUser.getFullName().split(" ")[0] + ": ";
            }
            responses.add(new MatchResponse(
                    match.getId(),
                    otherUser.getId(),
                    otherUser.getFullName(),
                    otherUser.getImages().get(0).getUrl(),
                    prefix + lastMessage,
                    lastMessageTime,
                    msgE.size(),
                    msgE.size() > 0
            ));
        }

        return responses;
    }

    @Override
    public Integer countMatchDontRead() {
        Long currentUserId = utilsService.getUserIdFromToken();
        List<Matches> matches = matchesRepository.findAllByUserId(currentUserId);
        Integer count = 0;
        for (Matches match : matches) {
            Users otherUser = match.getUser1().getId().equals(currentUserId)
                    ? match.getUser2()
                    : match.getUser1();
            List<MessageEntity> msgE = messageRepository.findAllByMatchIdAndSenderAndIsRead(match.getId(), otherUser, false);
            if (msgE.size() > 0) {
                count++;
            }
        }
        return count;
    }
}
