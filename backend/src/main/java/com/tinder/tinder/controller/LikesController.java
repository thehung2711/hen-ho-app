package com.tinder.tinder.controller;


import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.service.LikeService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/like")
public class LikesController {
    private final LikeService likeService;
    public LikesController(LikeService likeService) {
        this.likeService = likeService;
    }
    @PostMapping
    public ApiResponse<String> likeAnotherPeople(@RequestParam Long userToId, @RequestParam Integer status) {
        ApiResponse apiResponse = new ApiResponse();
        likeService.likeAnotherPeople(userToId, status);
        apiResponse.setMessage("Like another people");
        apiResponse.setCode(200);
        apiResponse.setResult("");
        return apiResponse;
    }
}
