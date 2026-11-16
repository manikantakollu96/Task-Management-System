
package com.task.employee.service;

import com.task.employee.entity.Task;

import java.util.List;
import java.util.Optional;
import java.util.Map;

public interface TaskService {

    Task createTask(Task task);

    List<Task> getAllTasks();

    Optional<Task> getTaskById(Long id);

    Task updateTask(Long id, Task task);

    void deleteTask(Long id);

    Task assignTaskToEmployee(Long taskId, Long employeeId);

    List<Task> getTasksByEmployeeId(Long employeeId);

    Task updateTaskStatus(Long taskId, String status);

    List<Task> getTasksByStatus(String status);

    Map<String, Long> getEmployeeTaskSummary(Long employeeId);

    long getTotalTaskCount();

    // Get task counts for the Admin dashboard
    Map<String, Long> getTaskStatusSummary();
}
