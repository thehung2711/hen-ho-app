package com.tinder.tinder.repository;

import com.tinder.tinder.model.Matches;
import com.tinder.tinder.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Matches, Long> {
    List<Matches> findAllByUser1OrUser2(Users user1, Users user2);
    @Query("""
        SELECT m FROM matches m
        WHERE m.user1.id = :userId OR m.user2.id = :userId
    """)
    List<Matches> findAllByUserId(@Param("userId") Long userId);
}
