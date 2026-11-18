
package com.task.employee.service;

import com.task.employee.entity.Notification;
import com.task.employee.entity.Task;
import com.task.employee.entity.Employee;
import com.task.employee.entity.TaskIdCounter;

import com.task.employee.repository.TaskRepository;
import com.task.employee.repository.EmployeeRepository;
import com.task.employee.repository.NotificationRepository;
import com.task.employee.repository.TaskIdCounterRepository;

import jakarta.persistence.EntityManager;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Locale;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationRepository notificationRepository;
    private final TaskIdCounterRepository taskIdCounterRepository;
    private final EntityManager entityManager;

    public TaskServiceImpl(
            TaskRepository taskRepository,
            EmployeeRepository employeeRepository,
            NotificationRepository notificationRepository,
            TaskIdCounterRepository taskIdCounterRepository,
            EntityManager entityManager) {

        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.notificationRepository = notificationRepository;
        this.taskIdCounterRepository = taskIdCounterRepository;
        this.entityManager = entityManager;
    }

    // Create a task with a sequential ID
    @Override
    @Transactional
    public Task createTask(Task task) {

        TaskIdCounter counter = taskIdCounterRepository
                .findByIdForUpdate(1L)
                .orElseThrow(() ->
                        new RuntimeException("Task ID counter not found"));

        Long nextId = counter.getLastId() + 1;

        counter.setLastId(nextId);

        task.setId(nextId);

        entityManager.persist(task);

        return task;
    }

    // Retrieve all tasks
    @Override
    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByIdAsc();
    }

    // Retrieve a task using its ID
    @Override
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Update existing task details
    @Override
    public Task updateTask(Long id, Task task) {

        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        existingTask.setTitle(task.getTitle());
        existingTask.setDescription(task.getDescription());
        existingTask.setStatus(task.getStatus());
        existingTask.setPriority(task.getPriority());
        existingTask.setDueDate(task.getDueDate());

        return taskRepository.save(existingTask);
    }

    // Delete a task using its ID
    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // Assign a task to an employee
    @Override
    @Transactional
    public Task assignTaskToEmployee(Long taskId, Long employeeId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        Employee previousEmployee = task.getEmployee();

        if (previousEmployee == null ||
                !previousEmployee.getId().equals(employee.getId())) {

            task.setEmployee(employee);

            Notification notification = new Notification();

            notification.setMessage(
                    "Admin assigned you a new task: " + task.getTitle()
            );

            notification.setEmployee(employee);
            notification.setTask(task);

            notificationRepository.save(notification);
        }

        return taskRepository.save(task);
    }

    // Retrieve tasks assigned to an employee
    @Override
    public List<Task> getTasksByEmployeeId(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return taskRepository.findByEmployeeOrderByIdAsc(employee);
    }

    // Update task status
    @Override
    public Task updateTaskStatus(Long taskId, String status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        if (status == null ||
                !(status.trim().equalsIgnoreCase("PENDING") ||
                  status.trim().equalsIgnoreCase("IN_PROGRESS") ||
                  status.trim().equalsIgnoreCase("COMPLETED"))) {

            throw new IllegalArgumentException(
                    "Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED");
        }

        task.setStatus(status.trim().toUpperCase(Locale.ROOT));

        return taskRepository.save(task);
    }

    // Retrieve tasks by status
    @Override
    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatusOrderByIdAsc(status);
    }

    // Employee task summary
    @Override
    public Map<String, Long> getEmployeeTaskSummary(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        long totalTasks = taskRepository.countByEmployee(employee);
        long pendingTasks =
                taskRepository.countByEmployeeAndStatus(employee, "PENDING");
        long inProgressTasks =
                taskRepository.countByEmployeeAndStatus(employee, "IN_PROGRESS");
        long completedTasks =
                taskRepository.countByEmployeeAndStatus(employee, "COMPLETED");

        Map<String, Long> summary = new LinkedHashMap<>();

        summary.put("totalTasks", totalTasks);
        summary.put("pendingTasks", pendingTasks);
        summary.put("inProgressTasks", inProgressTasks);
        summary.put("completedTasks", completedTasks);

        return summary;
    }

    // Count all tasks
    @Override
    public long getTotalTaskCount() {
        return taskRepository.count();
    }

    // Admin task status summary
    @Override
    public Map<String, Long> getTaskStatusSummary() {

        long totalTasks = taskRepository.count();
        long pendingTasks = taskRepository.countByStatus("PENDING");
        long inProgressTasks = taskRepository.countByStatus("IN_PROGRESS");
        long completedTasks = taskRepository.countByStatus("COMPLETED");

        Map<String, Long> summary = new LinkedHashMap<>();

        summary.put("totalTasks", totalTasks);
        summary.put("pendingTasks", pendingTasks);
        summary.put("inProgressTasks", inProgressTasks);
        summary.put("completedTasks", completedTasks);

        return summary;
    }
}
