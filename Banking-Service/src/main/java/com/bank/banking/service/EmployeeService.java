package com.bank.banking.service;
 
import java.util.List;
 
import com.bank.banking.dto.EmployeeDTO;
 
public interface EmployeeService {
 
    EmployeeDTO createEmployee(EmployeeDTO employeeDTO);
 
    List<EmployeeDTO> getAllEmployees();
 
    EmployeeDTO getEmployeeById(Long id);
 
    EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO);
 
    void deleteEmployee(Long id);
}