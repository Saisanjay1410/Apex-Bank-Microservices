package com.bank.banking.controller;
 
import java.util.List;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
 
import com.bank.banking.dto.TransactionDTO;
import com.bank.banking.service.TransactionService;
 
@RestController
@Tag(name = "Transaction API", description = "Deposit and withdrawal transaction endpoints")
@RequestMapping("/transactions")
public class TransactionController {
 
    private final TransactionService transactionService;
 
    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }
 
    // Create Transaction
    @PostMapping
    public ResponseEntity<TransactionDTO> createTransaction(
            @Valid @RequestBody TransactionDTO transactionDTO) {
 
        return ResponseEntity.ok(
                transactionService.createTransaction(transactionDTO));
    }
 
    // Get All Transactions
    @GetMapping
    public ResponseEntity<List<TransactionDTO>> getAllTransactions() {
 
        return ResponseEntity.ok(
                transactionService.getAllTransactions());
    }
 
    // Get Transaction By ID
    @GetMapping("/{id}")
    public ResponseEntity<TransactionDTO> getTransactionById(
            @PathVariable Long id) {
 
        return ResponseEntity.ok(
                transactionService.getTransactionById(id));
    }
 
    // Update Transaction
    @PutMapping("/{id}")
    public ResponseEntity<TransactionDTO> updateTransaction(
            @PathVariable Long id,
            @Valid @RequestBody TransactionDTO transactionDTO) {
 
        return ResponseEntity.ok(
                transactionService.updateTransaction(id, transactionDTO));
    }
 
    // Delete Transaction
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTransaction(
            @PathVariable Long id) {
 
        transactionService.deleteTransaction(id);
 
        return ResponseEntity.ok(
                "Transaction deleted successfully");
    }
}