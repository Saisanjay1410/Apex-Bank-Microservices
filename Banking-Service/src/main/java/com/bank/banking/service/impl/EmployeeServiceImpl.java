package com.bank.banking.service.impl;
 
import java.util.List;
import java.util.stream.Collectors;
 
import org.springframework.stereotype.Service;
 
import com.bank.banking.dto.EmployeeDTO;
import com.bank.banking.entity.Employee;
import com.bank.banking.repository.EmployeeRepository;
import com.bank.banking.exception.ResourceNotFoundException;
import com.bank.banking.service.EmployeeService;
 
@Service
public class EmployeeServiceImpl implements EmployeeService {
 
    private final EmployeeRepository employeeRepository;
 
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }
 
    @Override
    public EmployeeDTO createEmployee(EmployeeDTO employeeDTO) {
 
        Employee employee = new Employee();
 
        employee.setEmployeeId(employeeDTO.getEmployeeId());
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setDesignation(employeeDTO.getDesignation());
        employee.setSalary(employeeDTO.getSalary());
        employee.setPhone(employeeDTO.getPhone());
        employee.setAddress(employeeDTO.getAddress());
 
        Employee savedEmployee = employeeRepository.save(employee);
 
        return convertToDTO(savedEmployee);
    }
 
    @Override
    public List<EmployeeDTO> getAllEmployees() {
 
        return employeeRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
 
    @Override
    public EmployeeDTO getEmployeeById(Long id) {
 
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id: " + id));
 
        return convertToDTO(employee);
    }
 
    @Override
    public EmployeeDTO updateEmployee(Long id, EmployeeDTO employeeDTO) {
 
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Employee not found with id: " + id));
 
        employee.setEmployeeId(employeeDTO.getEmployeeId());
        employee.setFirstName(employeeDTO.getFirstName());
        employee.setLastName(employeeDTO.getLastName());
        employee.setDepartment(employeeDTO.getDepartment());
        employee.setDesignation(employeeDTO.getDesignation());
        employee.setSalary(employeeDTO.getSalary());
        employee.setPhone(employeeDTO.getPhone());
        employee.setAddress(employeeDTO.getAddress());
 
        Employee updatedEmployee = employeeRepository.save(employee);
 
        return convertToDTO(updatedEmployee);
    }
 
    @Override
    public void deleteEmployee(Long id) {
 
        if (!employeeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Employee not found with id: " + id);
        }
 
        employeeRepository.deleteById(id);
    }
 
    private EmployeeDTO convertToDTO(Employee employee) {
 
        EmployeeDTO dto = new EmployeeDTO();
 
        dto.setId(employee.getId());
        dto.setEmployeeId(employee.getEmployeeId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setDepartment(employee.getDepartment());
        dto.setDesignation(employee.getDesignation());
        dto.setSalary(employee.getSalary());
        dto.setPhone(employee.getPhone());
        dto.setAddress(employee.getAddress());
 
        return dto;
    }
}