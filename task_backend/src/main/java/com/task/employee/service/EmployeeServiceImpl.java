
package com.task.employee.service;

import com.task.employee.entity.Employee;
import com.task.employee.exception.EmployeeHasAssignedTasksException;
import com.task.employee.repository.EmployeeRepository;
import com.task.employee.repository.TaskRepository;

import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;

    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            TaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
    }

    // Generate the next employee code
    private String generateNextEmployeeCode() {

        List<Employee> employees = employeeRepository.findAllByOrderByIdAsc();

        Pattern pattern = Pattern.compile("^EMP(\\d+)$");

        int highestCodeNumber = 0;

        for (Employee existingEmployee : employees) {

            String code = existingEmployee.getEmployeeCode();

            if (code != null) {

                Matcher matcher = pattern.matcher(code);

                if (matcher.matches()) {

                    int number = Integer.parseInt(matcher.group(1));

                    highestCodeNumber = Math.max(highestCodeNumber, number);
                }
            }
        }

        int nextCodeNumber = highestCodeNumber + 1;

        return String.format(Locale.ROOT, "EMP%03d", nextCodeNumber);
    }

    // Create a new employee (Admin functionality)
    @Override
    @Transactional
    public Employee createEmployee(Employee employee) {

        employee.setEmployeeCode(generateNextEmployeeCode());

        return employeeRepository.save(employee);
    }

    // Register a new employee (Self-registration)
    @Override
    @Transactional
    public Employee registerEmployee(Employee employee) {

        Employee existingEmployee =
                employeeRepository.findByEmail(employee.getEmail());

        if (existingEmployee != null) {
            throw new RuntimeException("This email is already registered");
        }

        // Automatically assign EMPLOYEE role
        employee.setRole("EMPLOYEE");

        // Automatically generate employee code
        employee.setEmployeeCode(generateNextEmployeeCode());

        return employeeRepository.save(employee);
    }

    // Retrieve all employees
    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllByOrderByIdAsc();
    }

    // Retrieve employee using ID
    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    // Update employee details
    @Override
    public Employee updateEmployee(Long id, Employee employee) {

        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        existingEmployee.setName(employee.getName());
        existingEmployee.setEmail(employee.getEmail());
        existingEmployee.setPassword(employee.getPassword());
        existingEmployee.setRole(employee.getRole());

        return employeeRepository.save(existingEmployee);
    }

    // Delete employee
    @Override
    @Transactional
    public void deleteEmployee(Long id) {

        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        long assignedTaskCount = taskRepository.countByEmployee(employee);

        if (assignedTaskCount > 0) {

            throw new EmployeeHasAssignedTasksException(
                    "Cannot delete this employee because " + assignedTaskCount
                    + " task's are assigned to them. Reassign or delete those tasks first.");
        }

        employeeRepository.delete(employee);
    }

    // Count employees
    @Override
    public long getTotalEmployeeCount() {
        return employeeRepository.count();
    }

    // Login using email and password
    @Override
    public Optional<Employee> login(String email, String password) {

        Employee employee = employeeRepository.findByEmail(email);

        if (employee != null && employee.getPassword().equals(password)) {
            return Optional.of(employee);
        }

        return Optional.empty();
    }
}
