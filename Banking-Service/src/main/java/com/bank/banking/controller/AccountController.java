package com.bank.banking.controller;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
 
import com.bank.banking.dto.AccountDTO;
import com.bank.banking.service.AccountService;
 
import java.util.List;
 
@RestController
@Tag(name = "Account API", description = "Bank account management endpoints")
@RequestMapping("/accounts")
public class AccountController {
 
    private final AccountService accountService;
 
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }
 
    // Create Account
    @PostMapping
    public ResponseEntity<AccountDTO> createAccount(
            @Valid @RequestBody AccountDTO accountDTO) {
 
        return ResponseEntity.ok(
                accountService.createAccount(accountDTO)
        );
    }
 
    // Get Account by ID
    @GetMapping("/{id}")
    public ResponseEntity<AccountDTO> getAccountById(
            @PathVariable Long id) {
 
        return ResponseEntity.ok(
                accountService.getAccountById(id)
        );
    }
 
    // Get All Accounts
    @GetMapping
    public ResponseEntity<List<AccountDTO>> getAllAccounts() {
 
        return ResponseEntity.ok(
                accountService.getAllAccounts()
        );
    }
 
    // Update Account
    @PutMapping("/{id}")
    public ResponseEntity<AccountDTO> updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody AccountDTO accountDTO) {
 
        return ResponseEntity.ok(
                accountService.updateAccount(id, accountDTO)
        );
    }
 
    // Delete Account
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAccount(
            @PathVariable Long id) {
 
        accountService.deleteAccount(id);
 
        return ResponseEntity.ok("Account deleted successfully");
    }
}