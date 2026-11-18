
package com.task.employee.service;

import com.task.employee.entity.Employee;
import com.task.employee.entity.Notification;
import com.task.employee.repository.EmployeeRepository;
import com.task.employee.repository.NotificationRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final EmployeeRepository employeeRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            EmployeeRepository employeeRepository) {

        this.notificationRepository = notificationRepository;
        this.employeeRepository = employeeRepository;
    }

    // Get all notifications for an employee
    public List<Notification> getNotifications(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        return notificationRepository
                .findByEmployeeOrderByCreatedAtDesc(employee);
    }

    // Get unread notification count
    public long getUnreadCount(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new RuntimeException("Employee not found"));

        return notificationRepository
                .countByEmployeeAndIsReadFalse(employee);
    }

    // Mark a notification as read
    @Transactional
    public Notification markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found"));

        notification.setRead(true);

        return notificationRepository.save(notification);
    }
}
