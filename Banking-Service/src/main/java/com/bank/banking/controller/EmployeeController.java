package com.bank.banking.controller;
 
import java.util.List;
 
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
 
import com.bank.banking.dto.EmployeeDTO;
import com.bank.banking.service.EmployeeService;
 
@RestController
@Tag(name = "Employee API", description = "Employee management endpoints")
@RequestMapping("/employees")
public class EmployeeController {
 
    private final EmployeeService employeeService;
 
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }
 
    // Create Employee
    @PostMapping
    public ResponseEntity<EmployeeDTO> createEmployee(
            @Valid @RequestBody EmployeeDTO employeeDTO) {
 
        return ResponseEntity.ok(
                employeeService.createEmployee(employeeDTO));
    }
 
    // Get All Employees
    @GetMapping
    public ResponseEntity<List<EmployeeDTO>> getAllEmployees() {
 
        return ResponseEntity.ok(
                employeeService.getAllEmployees());
    }
 
    // Get Employee By ID
    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDTO> getEmployeeById(
            @PathVariable Long id) {
 
        return ResponseEntity.ok(
                employeeService.getEmployeeById(id));
    }
 
    // Update Employee
    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDTO> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody EmployeeDTO employeeDTO) {
 
        return ResponseEntity.ok(
                employeeService.updateEmployee(id, employeeDTO));
    }
 
    // Delete Employee
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long id) {
 
        employeeService.deleteEmployee(id);
 
        return ResponseEntity.ok(
                "Employee deleted successfully");
    }
}