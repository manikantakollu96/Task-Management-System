
package com.task.employee.repository;

import com.task.employee.entity.Employee;
import com.task.employee.entity.Notification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    // Retrieve employee notifications, newest first
    List<Notification> findByEmployeeOrderByCreatedAtDesc(Employee employee);

    // Count unread notifications for an employee
    long countByEmployeeAndIsReadFalse(Employee employee);
}
