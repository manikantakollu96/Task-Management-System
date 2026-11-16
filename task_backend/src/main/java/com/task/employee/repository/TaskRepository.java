package com.task.employee.repository;

import com.task.employee.entity.Task;
import com.task.employee.entity.Employee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // Retrieve all tasks in ascending ID order
    List<Task> findAllByOrderByIdAsc();

    // Find all tasks assigned to a particular employee, ordered by ID
    List<Task> findByEmployeeOrderByIdAsc(Employee employee);

    // Find all tasks having a particular status, ordered by ID
    List<Task> findByStatusOrderByIdAsc(String status);

    // Existing query methods retained for compatibility
    List<Task> findByEmployee(Employee employee);
    List<Task> findByStatus(String status);

    // Count all tasks assigned to a particular employee
    long countByEmployee(Employee employee);

    // Count tasks assigned to an employee with a particular status
    long countByEmployeeAndStatus(Employee employee, String status);

    // Count tasks having a particular status
    long countByStatus(String status);
}
