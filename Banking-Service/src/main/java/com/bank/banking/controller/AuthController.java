package com.bank.banking.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import com.bank.banking.dto.CreateHrRequest;
import com.bank.banking.dto.LoginRequest;
import com.bank.banking.dto.LoginResponse;
import com.bank.banking.dto.RegisterRequest;
import com.bank.banking.service.AuthService;

@RestController
@Tag(
    name = "Auth API",
    description = "Authentication and user registration endpoints"
)
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ==========================================
    // REGISTER
    // ==========================================

    @Operation(
        summary = "Register user",
        description = "Creates a new employee user account. Public endpoint."
    )
    @SecurityRequirements
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request) {

        String response = authService.register(request);

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @Operation(
        summary = "Login",
        description = "Authenticates a user and returns a JWT. Public endpoint."
    )
    @SecurityRequirements
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    // ==========================================
    // CREATE HR USER
    // ==========================================

    @Operation(
        summary = "Create HR user",
        description = "Creates a new HR user. ADMIN access required."
    )
    @PostMapping("/create-hr")
    public ResponseEntity<String> createHr(
            @Valid @RequestBody CreateHrRequest request) {

        String response = authService.createHr(request);

        return ResponseEntity.ok(response);
    }
}