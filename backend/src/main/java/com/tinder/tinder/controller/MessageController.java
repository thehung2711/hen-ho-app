package com.tinder.tinder.controller;

import com.tinder.tinder.dto.request.ChatMessage;
import com.tinder.tinder.dto.response.ApiResponse;
import com.tinder.tinder.repository.MessageRepository;
import com.tinder.tinder.service.MessageEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageEntityService messageService;
    @GetMapping("/{matchId}")
    @ResponseBody
    public ApiResponse<List<ChatMessage>> getMessages(@PathVariable Long matchId) {
        ApiResponse<List<ChatMessage>> response = new ApiResponse<>();
        List<ChatMessage> messages = messageService.getMessages(matchId);
        if (messages.size() == 0) {
            response.setCode(HttpStatus.NO_CONTENT.value());
            response.setMessage("No messages found");
            response.setResult(null);
            return response;
        }
        response.setCode(200);
        response.setMessage("OK");
        response.setResult(messageService.getMessages(matchId));
        return response;
    }
}
