package com.bank.banking.service;
 
import com.bank.banking.dto.CreateHrRequest;
import com.bank.banking.dto.LoginRequest;
import com.bank.banking.dto.LoginResponse;
import com.bank.banking.dto.RegisterRequest;
 
public interface AuthService {
 
    String register(RegisterRequest request);
 
    LoginResponse login(LoginRequest request);
    
    String createHr(CreateHrRequest request);
}