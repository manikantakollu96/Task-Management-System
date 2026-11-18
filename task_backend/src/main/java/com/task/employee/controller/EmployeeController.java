
package com.task.employee.controller;

import com.task.employee.dto.LoginRequest;
import com.task.employee.entity.Employee;
import com.task.employee.service.EmployeeService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = {
	    "http://localhost:5173",
	    "https://manikanta-taskmanager.vercel.app"
	})
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // Create a new employee (Admin functionality)
    @PostMapping
    public Employee createEmployee(@Valid @RequestBody Employee employee) {
        return employeeService.createEmployee(employee);
    }

    // Register a new employee (Self-registration)
    @PostMapping("/register")
    public ResponseEntity<?> registerEmployee(
            @Valid @RequestBody Employee employee) {

        try {
            Employee registeredEmployee =
                    employeeService.registerEmployee(employee);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(registeredEmployee);

        } catch (RuntimeException exception) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(exception.getMessage());
        }
    }

    // Retrieve all employees
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // Retrieve employee using ID
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    // Update employee details
    @PutMapping("/{id}")
    public Employee updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody Employee employee) {

        return employeeService.updateEmployee(id, employee);
    }

    // Delete employee
    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return "Employee deleted successfully";
    }

    // Count employees
    @GetMapping("/count")
    public long getTotalEmployeeCount() {
        return employeeService.getTotalEmployeeCount();
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        Optional<Employee> employee = employeeService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (employee.isPresent()) {
            return ResponseEntity.ok(employee.get());
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid email or password");
    }
}
