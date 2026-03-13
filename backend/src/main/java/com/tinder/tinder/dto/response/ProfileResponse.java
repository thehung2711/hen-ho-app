package com.tinder.tinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private String username;
    private String fullName;
    private String email;
    private Integer gender;
    private LocalDate birthday;
    private String school;
    private Double tall;
    private String company;
    private String bio;
    private List<String> images;
}
