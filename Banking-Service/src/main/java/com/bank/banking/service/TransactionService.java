package com.bank.banking.service;
 
import java.util.List;
 
import com.bank.banking.dto.TransactionDTO;
 
public interface TransactionService {
 
    TransactionDTO createTransaction(TransactionDTO transactionDTO);
 
    List<TransactionDTO> getAllTransactions();
 
    TransactionDTO getTransactionById(Long id);
 
    TransactionDTO updateTransaction(Long id, TransactionDTO transactionDTO);
 
    void deleteTransaction(Long id);
}