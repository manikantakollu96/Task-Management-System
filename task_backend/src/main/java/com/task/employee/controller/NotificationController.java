
package com.task.employee.controller;

import com.task.employee.entity.Notification;
import com.task.employee.service.NotificationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    // Get all notifications for an employee
    @GetMapping("/employee/{employeeId}")
    public List<Notification> getNotifications(
            @PathVariable Long employeeId) {

        return notificationService.getNotifications(employeeId);
    }

    // Get unread notification count
    @GetMapping("/employee/{employeeId}/unread-count")
    public long getUnreadCount(
            @PathVariable Long employeeId) {

        return notificationService.getUnreadCount(employeeId);
    }

    // Mark notification as read
    @PutMapping("/{notificationId}/read")
    public Notification markAsRead(
            @PathVariable Long notificationId) {

        return notificationService.markAsRead(notificationId);
    }
}
