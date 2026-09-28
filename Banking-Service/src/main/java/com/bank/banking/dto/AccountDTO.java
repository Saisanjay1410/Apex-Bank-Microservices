package com.bank.banking.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AccountDTO {

    private Long id;

    @NotBlank(message = "Account number is required")
    private String accountNumber;

    @NotBlank(message = "Account type is required")
    private String accountType;

    @DecimalMin(value = "0.00", message = "Balance cannot be negative")
    private BigDecimal balance;

    private Long employeeId;
}
