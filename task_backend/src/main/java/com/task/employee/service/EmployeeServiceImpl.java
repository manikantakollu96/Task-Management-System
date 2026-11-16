package com.task.employee.service;

import com.task.employee.entity.Employee;
import com.task.employee.exception.EmployeeHasAssignedTasksException;
import com.task.employee.repository.EmployeeRepository;
import com.task.employee.repository.TaskRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final TaskRepository taskRepository;

    // Constructor injection for employee and task repositories
    public EmployeeServiceImpl(
            EmployeeRepository employeeRepository,
            TaskRepository taskRepository) {
        this.employeeRepository = employeeRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAllByOrderByIdAsc();
    }

    @Override
    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

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

    // Prevent deletion when tasks are still assigned to the employee.
    @Override
    @Transactional
    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        long assignedTaskCount = taskRepository.countByEmployee(employee);

        if (assignedTaskCount > 0) {
            throw new EmployeeHasAssignedTasksException(
                    "Cannot delete this employee because " + assignedTaskCount
                    + " task's are assigned to them. Reassign or delete those tasks first."
            );
        }

        employeeRepository.delete(employee);
    }

    @Override
    public long getTotalEmployeeCount() {
        return employeeRepository.count();
    }

    @Override
    public Optional<Employee> login(String email, String password) {
        Employee employee = employeeRepository.findByEmail(email);

        if (employee != null && employee.getPassword().equals(password)) {
            return Optional.of(employee);
        }

        return Optional.empty();
    }
}
