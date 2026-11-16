package com.task.employee.repository;

import com.task.employee.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Find an employee using their email
    Employee findByEmail(String email);

    // Retrieve employees in ascending ID order
    List<Employee> findAllByOrderByIdAsc();

    // Count the total number of employees
    long count();
}
