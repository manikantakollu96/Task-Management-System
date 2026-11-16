package com.task.employee.service;

import com.task.employee.entity.Employee;

import java.util.List;
import java.util.Optional;

public interface EmployeeService {

    // Create a new employee
    Employee createEmployee(Employee employee);

    // Retrieve all employees
    List<Employee> getAllEmployees();

    // Retrieve an employee using their ID
    Optional<Employee> getEmployeeById(Long id);

    // Update existing employee details
    Employee updateEmployee(Long id, Employee employee);

    // Delete an employee using their ID
    void deleteEmployee(Long id);

    // Count the total number of employees
    long getTotalEmployeeCount();
    
    // Login using email and password
    Optional<Employee> login(String email, String password);
}
