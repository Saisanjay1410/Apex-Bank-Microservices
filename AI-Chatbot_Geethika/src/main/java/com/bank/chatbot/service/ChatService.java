package com.bank.chatbot.service;
 
import com.bank.chatbot.dto.ChatRequest;
import com.bank.chatbot.dto.ChatResponse;
 
public interface ChatService {
 
    ChatResponse getChatResponse(ChatRequest request);
 
}