package com.bank.banking.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.banking.dto.TransactionDTO;
import com.bank.banking.entity.BankAccount;
import com.bank.banking.entity.Transaction;
import com.bank.banking.exception.ResourceNotFoundException;
import com.bank.banking.repository.BankAccountRepository;
import com.bank.banking.repository.TransactionRepository;
import com.bank.banking.service.TransactionService;

@Service
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepository;
    private final BankAccountRepository bankAccountRepository;

    public TransactionServiceImpl(
            TransactionRepository transactionRepository,
            BankAccountRepository bankAccountRepository) {
        this.transactionRepository = transactionRepository;
        this.bankAccountRepository = bankAccountRepository;
    }

    @Override
    @Transactional
    public TransactionDTO createTransaction(TransactionDTO dto) {
        BankAccount account = findAccount(dto.getAccountId());

        String type = normalizeType(dto.getTransactionType());
        validateAmount(dto.getAmount());

        applyTransaction(account, type, dto.getAmount());

        Transaction transaction = new Transaction();
        transaction.setAccount(account);
        transaction.setTransactionType(type);
        transaction.setAmount(dto.getAmount());
        transaction.setRemarks(dto.getRemarks());
        transaction.setTransactionDate(LocalDateTime.now());

        return convertToDTO(transactionRepository.save(transaction));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionDTO> getAllTransactions() {
        return transactionRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionDTO getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Transaction not found with id: " + id));

        return convertToDTO(transaction);
    }

    @Override
    @Transactional
    public TransactionDTO updateTransaction(Long id, TransactionDTO dto) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Transaction not found with id: " + id));

        validateAmount(dto.getAmount());

        // Reverse the original transaction first.
        reverseTransaction(transaction);

        BankAccount newAccount = findAccount(dto.getAccountId());
        String newType = normalizeType(dto.getTransactionType());

        // Apply the replacement transaction.
        applyTransaction(newAccount, newType, dto.getAmount());

        transaction.setAccount(newAccount);
        transaction.setTransactionType(newType);
        transaction.setAmount(dto.getAmount());
        transaction.setRemarks(dto.getRemarks());

        return convertToDTO(transactionRepository.save(transaction));
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Transaction not found with id: " + id));

        reverseTransaction(transaction);
        transactionRepository.delete(transaction);
    }

    private BankAccount findAccount(Long accountId) {
        if (accountId == null) {
            throw new IllegalArgumentException("Account id is required");
        }

        return bankAccountRepository.findByIdForUpdate(accountId)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Account not found with id: " + accountId));
    }

    private void validateAmount(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
    }

    private String normalizeType(String type) {
        if (type == null) {
            throw new IllegalArgumentException("Transaction type is required");
        }

        String normalized = type.trim().toUpperCase(Locale.ROOT);

        if (!normalized.equals("DEPOSIT") && !normalized.equals("WITHDRAW")) {
            throw new IllegalArgumentException(
                "Transaction type must be DEPOSIT or WITHDRAW");
        }

        return normalized;
    }

    private void applyTransaction(
            BankAccount account,
            String type,
            BigDecimal amount) {

        BigDecimal balance = account.getBalance() == null
                ? BigDecimal.ZERO
                : account.getBalance();

        if ("DEPOSIT".equals(type)) {
            account.setBalance(balance.add(amount));
        } else {
            if (balance.compareTo(amount) < 0) {
                throw new IllegalArgumentException("Insufficient account balance");
            }
            account.setBalance(balance.subtract(amount));
        }

        bankAccountRepository.save(account);
    }

    private void reverseTransaction(Transaction transaction) {
        BankAccount account = transaction.getAccount();

        if (account == null) {
            throw new IllegalStateException(
                "Transaction is not linked to a bank account");
        }

        BigDecimal balance = account.getBalance() == null
                ? BigDecimal.ZERO
                : account.getBalance();

        if ("DEPOSIT".equalsIgnoreCase(transaction.getTransactionType())) {
            if (balance.compareTo(transaction.getAmount()) < 0) {
                throw new IllegalStateException(
                    "Cannot reverse transaction: insufficient current balance");
            }
            account.setBalance(balance.subtract(transaction.getAmount()));
        } else {
            account.setBalance(balance.add(transaction.getAmount()));
        }

        bankAccountRepository.save(account);
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(transaction.getId());
        dto.setAccountId(
            transaction.getAccount() == null
                ? null
                : transaction.getAccount().getId());
        dto.setTransactionType(transaction.getTransactionType());
        dto.setAmount(transaction.getAmount());
        dto.setRemarks(transaction.getRemarks());
        return dto;
    }
}
