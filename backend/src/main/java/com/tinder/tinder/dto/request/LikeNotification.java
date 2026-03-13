package com.tinder.tinder.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LikeNotification {
    private Long fromUserId;
    private String fromUsername;
    private String type = "LIKE";
}