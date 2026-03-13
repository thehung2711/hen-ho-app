package com.tinder.tinder.dto.response;


import com.tinder.tinder.model.Images;
import com.tinder.tinder.model.Interests;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMatchResult {
    private Long userId;
    private String fullName;
    private Integer age;
    private String location;
    private Double distanceKm;
    private double finalScore;
    private List<String> imagesList;
    private List<String> interestsList;
    private Double tall;
    private String school;
    private String company;
    private String bio;
}
