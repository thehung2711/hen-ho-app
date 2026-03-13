package com.tinder.tinder.dto.request;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserUpdate {
    @NotBlank
    private String fullName;
    @NotBlank
    private String email;
    @Min(value = 0, message = "Chiều cao phải lớn hơn 0")
    private Double tall;
    private String school;
    private String company;
    private String bio;
}
