
package com.task.employee.controller;

import com.task.employee.entity.Task;
import com.task.employee.service.TaskService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Create a task with validation
    @PostMapping
    public Task createTask(@Valid @RequestBody Task task) {
        return taskService.createTask(task);
    }

    // Retrieve all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // Retrieve a task by ID
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskService.getTaskById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    // Update a task with validation
    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @Valid @RequestBody Task task) {
        return taskService.updateTask(id, task);
    }

    // Delete a task
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "Task deleted successfully";
    }

    // Assign a task to an employee
    @PutMapping("/{taskId}/assign/{employeeId}")
    public Task assignTaskToEmployee(
            @PathVariable Long taskId,
            @PathVariable Long employeeId) {
        return taskService.assignTaskToEmployee(taskId, employeeId);
    }

    // Get tasks assigned to an employee
    @GetMapping("/employee/{employeeId}")
    public List<Task> getTasksByEmployeeId(
            @PathVariable Long employeeId) {
        return taskService.getTasksByEmployeeId(employeeId);
    }

    // Update task status
    @PutMapping("/{taskId}/status")
    public Task updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {
        return taskService.updateTaskStatus(taskId, status);
    }

    // Get tasks by status
    @GetMapping("/status/{status}")
    public List<Task> getTasksByStatus(@PathVariable String status) {
        return taskService.getTasksByStatus(status);
    }

    // Get employee task summary
    @GetMapping("/employee/{employeeId}/summary")
    public Map<String, Long> getEmployeeTaskSummary(
            @PathVariable Long employeeId) {
        return taskService.getEmployeeTaskSummary(employeeId);
    }

    // Get total task count
    @GetMapping("/count")
    public long getTotalTaskCount() {
        return taskService.getTotalTaskCount();
    }

    // Get Admin task status summary
    @GetMapping("/status-summary")
    public Map<String, Long> getTaskStatusSummary() {
        return taskService.getTaskStatusSummary();
    }
}
