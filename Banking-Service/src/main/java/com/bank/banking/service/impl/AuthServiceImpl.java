package com.bank.banking.service.impl;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bank.banking.dto.CreateHrRequest;
import com.bank.banking.dto.LoginRequest;
import com.bank.banking.dto.LoginResponse;
import com.bank.banking.dto.RegisterRequest;
import com.bank.banking.entity.Role;
import com.bank.banking.entity.User;
import com.bank.banking.repository.RoleRepository;
import com.bank.banking.repository.UserRepository;
import com.bank.banking.service.AuthService;
import com.bank.banking.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ==========================================
    // PUBLIC REGISTRATION
    // ==========================================

    @Override
    public String register(RegisterRequest request) {

        if (userRepository
                .findByUsername(request.getUsername())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Username already exists");
        }

        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Email already exists");
        }

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        // Public registration ALWAYS creates
        // a normal employee.
        Role role = roleRepository
                .findByName("ROLE_EMPLOYEE")
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Default employee role not found"));

        user.setRole(role);
        user.setActive(true);

        userRepository.save(user);

        return "User registered successfully";
    }

    // ==========================================
    // LOGIN
    // ==========================================

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Invalid email or password"));

        if (!user.isActive()) {
            throw new IllegalStateException(
                    "User account is inactive");
        }

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new IllegalArgumentException(
                    "Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getUsername(),
                user.getRole().getName());

        LoginResponse response = new LoginResponse();

        response.setToken(token);

        return response;
    }

    // ==========================================
    // CREATE HR USER
    // ==========================================

    @Override
    public String createHr(CreateHrRequest request) {

        // Check username
        if (userRepository
                .findByUsername(request.getUsername())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Username already exists");
        }

        // Check email
        if (userRepository
                .findByEmail(request.getEmail())
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Email already exists");
        }

        // Find HR role
        Role hrRole = roleRepository
                .findByName("ROLE_HR")
                .orElseThrow(() ->
                        new IllegalStateException(
                                "ROLE_HR not found"));

        // Create user
        User hr = new User();

        hr.setUsername(request.getUsername());
        hr.setEmail(request.getEmail());

        // Encrypt password
        hr.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        hr.setActive(true);

        // IMPORTANT:
        // Role is assigned by backend,
        // not by the client.
        hr.setRole(hrRole);

        userRepository.save(hr);

        return "HR user created successfully";
    }
}