package com.tinder.tinder.controller;

import com.tinder.tinder.dto.request.InterestCreate;
import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.model.Interests;
import com.tinder.tinder.service.InterestService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/interest")
public class InterestsController {

    private final InterestService interestService;

    public InterestsController(InterestService interestService) {
        this.interestService = interestService;
    }

    @PostMapping
    public ApiResponse<String> insertInterset(@RequestBody InterestCreate request) {
        ApiResponse response = new ApiResponse();
        interestService.addInterest(request);
        response.setMessage("Successfully added interest");
        response.setCode(200);
        return response;
    }


    @PutMapping("/{id}")
    public ApiResponse<String> updateInterset(@PathVariable Long id,  @RequestBody InterestCreate request) {
        ApiResponse response = new ApiResponse();
        interestService.updateInterest(id, request);
        response.setMessage("Successfully update interest");
        response.setCode(HttpStatus.ACCEPTED.value());
        return response;
    }

    @GetMapping
    public ApiResponse<Interests> getInterests() {
        ApiResponse response = new ApiResponse();
        List<Interests> interests = interestService.getAllInterests();
        response.setCode(200);
        response.setMessage("Successfully retrieved interests");
        response.setResult(interests);
        return response;
    }
}
