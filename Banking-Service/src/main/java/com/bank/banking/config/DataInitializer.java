package com.bank.banking.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.bank.banking.entity.Role;
import com.bank.banking.entity.User;
import com.bank.banking.repository.RoleRepository;
import com.bank.banking.repository.UserRepository;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner loadData(
            RoleRepository roleRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // ==========================================
            // CREATE ROLES
            // ==========================================

            Role adminRole = roleRepository
                    .findByName("ROLE_ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ROLE_ADMIN");
                        return roleRepository.save(role);
                    });

            Role hrRole = roleRepository
                    .findByName("ROLE_HR")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ROLE_HR");
                        return roleRepository.save(role);
                    });

            Role employeeRole = roleRepository
                    .findByName("ROLE_EMPLOYEE")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ROLE_EMPLOYEE");
                        return roleRepository.save(role);
                    });


            // ==========================================
            // CREATE DEFAULT ADMIN USER
            // ==========================================

            if (!userRepository.existsByEmail("admin@bank.com")) {

                User admin = new User();

                admin.setUsername("admin");
                admin.setEmail("admin@bank.com");

                // Password is stored encrypted
                admin.setPassword(
                    passwordEncoder.encode("Admin@123")
                );

                admin.setActive(true);
                admin.setRole(adminRole);

                userRepository.save(admin);

                System.out.println(
                    "=========================================="
                );
                System.out.println(
                    "Default ADMIN user created"
                );
                System.out.println(
                    "Email: admin@bank.com"
                );
                System.out.println(
                    "Password: Admin@123"
                );
                System.out.println(
                    "=========================================="
                );
            }


            // ==========================================
            // CREATE DEFAULT HR USER
            // ==========================================

            if (!userRepository.existsByEmail("hr@bank.com")) {

                User hr = new User();

                hr.setUsername("hr");
                hr.setEmail("hr@bank.com");

                hr.setPassword(
                    passwordEncoder.encode("Hr@123456")
                );

                hr.setActive(true);
                hr.setRole(hrRole);

                userRepository.save(hr);

                System.out.println(
                    "Default HR user created"
                );
            }
        };
    }
}