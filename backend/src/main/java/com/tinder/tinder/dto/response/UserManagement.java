package com.tinder.tinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagement {
    private String username;

    private String fullName;

    private String email;

    private Integer gender;

    private LocalDate birthday;

    private String location;
}
