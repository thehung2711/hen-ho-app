package com.tinder.tinder.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class RegisterRequest {
    @Size(min = 4, message = "full name phải ít nhất 4 kí tự")
    private String fullName;
    @Size(min = 8, message = "user name phải ít nhất 8 kí tự")
    private String username;
    private String password;
    private String confirmPassword;
}
