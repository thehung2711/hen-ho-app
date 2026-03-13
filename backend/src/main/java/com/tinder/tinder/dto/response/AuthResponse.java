package com.tinder.tinder.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


public class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
