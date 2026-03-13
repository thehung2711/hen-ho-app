package com.tinder.tinder.repository;

import com.tinder.tinder.model.MessageEntity;
import com.tinder.tinder.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findByMatchIdOrderBySentAtAsc(Long matchId);

    @Query(value = """
        SELECT * FROM messages
        WHERE match_id = :matchId
        ORDER BY sent_at DESC
        LIMIT 1
    """, nativeQuery = true)
    Optional<MessageEntity> findLastMessageByMatchId(@Param("matchId") Long matchId);

    List<MessageEntity> findAllByMatchIdAndSenderAndIsRead(Long matchId, Users user, boolean read);

}
