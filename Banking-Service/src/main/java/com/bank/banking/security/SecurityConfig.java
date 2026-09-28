package com.bank.banking.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
            // Enable CORS for frontend integration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Disable CSRF for REST API
            .csrf(csrf -> csrf.disable())

            // JWT authentication is stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // ==========================================
                // PUBLIC AUTH ENDPOINTS
                // ==========================================

                .requestMatchers(
                    "/auth/login",
                    "/auth/register"
                ).permitAll()


                // ==========================================
                // SWAGGER
                // ==========================================

                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()


                // ==========================================
                // ADMIN ONLY
                // ==========================================

                .requestMatchers(
                    "/auth/create-hr"
                ).hasRole("ADMIN")


                // ==========================================
                // ADMIN + HR
                // ==========================================

                .requestMatchers(
                    "/employees", "/employees/**"
                ).hasAnyRole("ADMIN", "HR")


                // ==========================================
                // ADMIN + EMPLOYEE
                // ==========================================

                .requestMatchers(
                    "/accounts", "/accounts/**"
                ).hasAnyRole("ADMIN", "EMPLOYEE")


                // ==========================================
                // ADMIN + EMPLOYEE
                // ==========================================

                .requestMatchers(
                    "/transactions", "/transactions/**"
                ).hasAnyRole("ADMIN", "EMPLOYEE")


                // ==========================================
                // EVERYTHING ELSE
                // MUST BE LAST
                // ==========================================

                .anyRequest().authenticated()
            )

            // Add JWT filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOriginPatterns(java.util.List.of("*"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type", "Accept", "X-Requested-With", "Origin"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}