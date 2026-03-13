package com.tinder.tinder.controller;

import com.tinder.tinder.dto.request.RegisterRequest;
import com.tinder.tinder.dto.request.RequestForgot;
import com.tinder.tinder.dto.request.UserLoginRequest;
import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.dto.response.AuthResponse;
import com.tinder.tinder.exception.ErrorException;
import com.tinder.tinder.jwt.JwtUtil;
import com.tinder.tinder.model.Users;
import com.tinder.tinder.repository.UserRepository;
import com.tinder.tinder.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtils;
    private final UserService userService;
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtils, UserService userService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody UserLoginRequest authRequest) {
        Users user = userRepository.findByUsername(authRequest.getUsername());

        if (user == null || !passwordEncoder.matches(authRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.ok().body(
                    new ApiResponse<>(ErrorException.WRONG_USERNAME_PASSWORD)
            );
        }

        String token = jwtUtils.generateToken(user.getUsername(), user.getRole().name() ,user.getId());
        AuthResponse authResponse = new AuthResponse(token);
        ApiResponse apiResponse = new ApiResponse<>();
        apiResponse.setCode(200);
        apiResponse.setMessage("Login successful");
        apiResponse.setResult(authResponse);
        return ResponseEntity.ok(
                apiResponse
        );
    }
    @PostMapping("/register")
    public ApiResponse<String> register(@RequestBody @Valid RegisterRequest request) {
        userService.createUser(request);
        ApiResponse<String> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("success");
        response.setResult("Create Success");
        return response;
    }

    @PostMapping("/forgot-password")
    public ApiResponse<String> forgotPassword(@RequestBody RequestForgot requestForgot) {
        ApiResponse<String> response = new ApiResponse<>();
        userService.forgotPassword(requestForgot.getEmail());
        response.setCode(200);
        response.setMessage("success");
        response.setResult("Forgot Password Success");
        return response;
    }
}
