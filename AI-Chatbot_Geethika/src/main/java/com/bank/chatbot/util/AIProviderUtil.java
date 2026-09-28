package com.bank.chatbot.util;
 
import org.springframework.stereotype.Component;
 
@Component
public class AIProviderUtil {
 
    public String getAIResponse(String prompt) {
 
        // Dummy AI response
        // Later we'll replace this with Gemini/OpenAI API integration
 
        if (prompt == null || prompt.trim().isEmpty()) {
            return "Please enter a valid question.";
        }
 
        return "AI Response: " + prompt;
    }
 
}