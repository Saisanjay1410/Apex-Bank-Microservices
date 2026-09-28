package com.bank.chatbot.service.impl;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
 
import com.bank.chatbot.dto.ChatRequest;
import com.bank.chatbot.dto.ChatResponse;
import com.bank.chatbot.service.ChatService;
import com.bank.chatbot.util.AIProviderUtil;
 
@Service
public class ChatServiceImpl implements ChatService {
 
    @Autowired
    private AIProviderUtil aiProviderUtil;
 
    @Override
    public ChatResponse getChatResponse(ChatRequest request) {
 
        String answer = aiProviderUtil.getAIResponse(request.getMessage());
 
        ChatResponse response = new ChatResponse();
        response.setResponse(answer);
        response.setStatus("SUCCESS");
 
        return response;
    }
 
}