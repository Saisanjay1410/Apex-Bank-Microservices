package com.bank.banking.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bank.banking.dto.AccountDTO;
import com.bank.banking.entity.BankAccount;
import com.bank.banking.entity.Employee;
import com.bank.banking.exception.ResourceNotFoundException;
import com.bank.banking.repository.BankAccountRepository;
import com.bank.banking.repository.EmployeeRepository;
import com.bank.banking.repository.TransactionRepository;
import com.bank.banking.service.AccountService;

@Service
public class AccountServiceImpl implements AccountService {

    private final BankAccountRepository bankAccountRepository;
    private final EmployeeRepository employeeRepository;
    private final TransactionRepository transactionRepository;

    public AccountServiceImpl(BankAccountRepository bankAccountRepository,
                              EmployeeRepository employeeRepository,
                              TransactionRepository transactionRepository) {
        this.bankAccountRepository = bankAccountRepository;
        this.employeeRepository = employeeRepository;
        this.transactionRepository = transactionRepository;
    }

    @Override
    @Transactional
    public AccountDTO createAccount(AccountDTO dto) {
        String accountNumber = dto.getAccountNumber().trim();
        if (bankAccountRepository.existsByAccountNumber(accountNumber)) {
            throw new IllegalArgumentException("Account number already exists");
        }

        BankAccount account = new BankAccount();
        account.setAccountNumber(accountNumber);
        account.setAccountType(dto.getAccountType().trim());
        BigDecimal openingBalance = dto.getBalance() == null ? BigDecimal.ZERO : dto.getBalance();
        if (openingBalance.signum() < 0) {
            throw new IllegalArgumentException("Opening balance cannot be negative");
        }
        account.setBalance(openingBalance);
        account.setEmployee(findAvailableEmployee(dto.getEmployeeId(), null));

        return convertToDTO(bankAccountRepository.save(account));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AccountDTO> getAllAccounts() {
        return bankAccountRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public AccountDTO getAccountById(Long id) {
        return convertToDTO(findAccount(id));
    }

    @Override
    @Transactional
    public AccountDTO updateAccount(Long id, AccountDTO dto) {
        BankAccount account = findAccount(id);
        String newNumber = dto.getAccountNumber().trim();

        if (!newNumber.equals(account.getAccountNumber())
                && bankAccountRepository.existsByAccountNumber(newNumber)) {
            throw new IllegalArgumentException("Account number already exists");
        }

        account.setAccountNumber(newNumber);
        account.setAccountType(dto.getAccountType().trim());

        // Balance is intentionally NOT taken from the request.
        // Deposits/withdrawals must go through the transaction API.
        if (dto.getEmployeeId() != null) {
            account.setEmployee(findAvailableEmployee(dto.getEmployeeId(), account));
        }

        return convertToDTO(bankAccountRepository.save(account));
    }

    @Override
    @Transactional
    public void deleteAccount(Long id) {
        BankAccount account = findAccount(id);

        if (transactionRepository.existsByAccount(account)) {
            throw new IllegalStateException(
                    "Cannot delete an account that has transactions");
        }

        bankAccountRepository.delete(account);
    }

    private BankAccount findAccount(Long id) {
        return bankAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Account not found with id: " + id));
    }

    private Employee findAvailableEmployee(Long employeeId, BankAccount currentAccount) {
        if (employeeId == null) {
            return null;
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found with id: " + employeeId));

        bankAccountRepository.findByEmployee(employee).ifPresent(existing -> {
            if (currentAccount == null || !existing.getId().equals(currentAccount.getId())) {
                throw new IllegalArgumentException("Employee is already linked to another account");
            }
        });

        return employee;
    }

    private AccountDTO convertToDTO(BankAccount account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setAccountNumber(account.getAccountNumber());
        dto.setAccountType(account.getAccountType());
        dto.setBalance(account.getBalance());
        dto.setEmployeeId(account.getEmployee() == null ? null : account.getEmployee().getId());
        return dto;
    }
}
