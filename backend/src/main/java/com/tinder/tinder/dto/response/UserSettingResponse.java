package com.tinder.tinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingResponse {
    private String location;
    private Integer minAge;
    private Integer maxAge;
    private Double distanceRange;
}
