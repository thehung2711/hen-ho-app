package com.tinder.tinder.service.cronjobservice;

import com.tinder.tinder.repository.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class LikeCleanUpService {
    private final LikeRepository likeRepository;

    public void deleteOldLikes() {
        LocalDateTime threshold = LocalDateTime.now().minusDays(5);
        int deletedCount = likeRepository.deleteOldLikes(threshold);
        log.info(" Đã xóa " + deletedCount + " like cũ hơn 5 ngày (" + threshold + ")");
    }
}
