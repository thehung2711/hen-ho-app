package com.tinder.tinder.repository;

import com.tinder.tinder.enums.StatusName;
import com.tinder.tinder.model.Likes;
import com.tinder.tinder.model.Users;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Likes, Long> {
    List<Likes> findByCreatedAtBefore(LocalDateTime time);

    @Transactional
    @Modifying
    @Query("DELETE FROM Likes l WHERE l.createdAt < :time")
    int deleteOldLikes(LocalDateTime time);

    Optional<Likes> findByFromUserAndToUser(Users fromUser, Users toUser);

    List<Likes> findAllByFromUser(Users fromUser);
    List<Likes> findAllByToUserAndStatus(Users toUser, StatusName statusName);
}
