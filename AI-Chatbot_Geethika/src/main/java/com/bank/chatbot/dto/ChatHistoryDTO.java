package com.bank.chatbot.dto;
 
import java.time.LocalDateTime;
 
public class ChatHistoryDTO {
 
    private String userId;
    private String question;
    private String answer;
    private LocalDateTime timestamp;
 
    public ChatHistoryDTO() {
    }
 
    public ChatHistoryDTO(String userId, String question, String answer, LocalDateTime timestamp) {
        this.userId = userId;
        this.question = question;
        this.answer = answer;
        this.timestamp = timestamp;
    }
 
    public String getUserId() {
        return userId;
    }
 
    public void setUserId(String userId) {
        this.userId = userId;
    }
 
    public String getQuestion() {
        return question;
    }
 
    public void setQuestion(String question) {
        this.question = question;
    }
 
    public String getAnswer() {
        return answer;
    }
 
    public void setAnswer(String answer) {
        this.answer = answer;
    }
 
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
 
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}