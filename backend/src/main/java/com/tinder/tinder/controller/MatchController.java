package com.tinder.tinder.controller;

import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.dto.response.MatchResponse;
import com.tinder.tinder.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;

    @GetMapping
    public ApiResponse<List<MatchResponse>> getMatches() {
        ApiResponse<List<MatchResponse>> response = new ApiResponse<>();
        response.setResult(matchService.getUserMatches());
        response.setMessage("Thanh Cong");
        response.setCode(200);
        return response;
    }

    @GetMapping("count-match-not-read")
    public ApiResponse<Integer> countMatchNotRead() {
        ApiResponse<Integer> response = new ApiResponse<>();
        response.setResult(matchService.countMatchDontRead());
        response.setMessage("Thanh Cong");
        response.setCode(200);
        return response;
    }
}
