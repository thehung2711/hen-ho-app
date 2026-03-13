package com.tinder.tinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InforDashBoard {
    private Integer totalUserCount;
    private Integer totalMatchesCount;
    private Integer totalMessageCount;
}
