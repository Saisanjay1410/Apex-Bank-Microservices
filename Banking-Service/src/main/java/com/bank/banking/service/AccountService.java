package com.bank.banking.service;
 
import java.util.List;
 
import com.bank.banking.dto.AccountDTO;
 
public interface AccountService {
 
    AccountDTO createAccount(AccountDTO accountDTO);
 
    List<AccountDTO> getAllAccounts();
 
    AccountDTO getAccountById(Long id);
 
    AccountDTO updateAccount(Long id, AccountDTO accountDTO);
 
    void deleteAccount(Long id);
}