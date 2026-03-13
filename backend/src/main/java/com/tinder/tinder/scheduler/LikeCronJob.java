package com.tinder.tinder.scheduler;

import com.tinder.tinder.service.cronjobservice.LikeCleanUpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LikeCronJob {
    private final LikeCleanUpService likeCleanUpService;
    // *10 là 10s 1 lần
    //0 là mooix phút
    //0 *5 là mỗi phút /5
    @Scheduled(cron = "0 0 2 * * *")
    public void cleanOldLikes() {
        log.info("Cleaning old likes");
        likeCleanUpService.deleteOldLikes();
    }
}
