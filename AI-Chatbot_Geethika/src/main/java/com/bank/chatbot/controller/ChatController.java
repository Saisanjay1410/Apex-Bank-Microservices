package com.bank.chatbot.controller;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
 
import com.bank.chatbot.dto.ChatRequest;
import com.bank.chatbot.dto.ChatResponse;
import com.bank.chatbot.service.ChatService;
 
@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {
 
    @Autowired
    private ChatService chatService;
 
    @PostMapping
    public ChatResponse chat(@RequestBody ChatRequest request) {
        return chatService.getChatResponse(request);
    }
 
}