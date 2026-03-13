package com.tinder.tinder.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchNotification {
    private Long user1Id;
    private String user1Username;
    private Long user2Id;
    private String user2Username;
    private String type = "MATCH";
}