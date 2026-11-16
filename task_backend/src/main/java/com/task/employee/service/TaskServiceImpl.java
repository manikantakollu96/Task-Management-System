
package com.task.employee.service;

import com.task.employee.entity.Task;
import com.task.employee.entity.Employee;

import com.task.employee.repository.TaskRepository;
import com.task.employee.repository.EmployeeRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.Locale;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    // Constructor injection
    public TaskServiceImpl(
            TaskRepository taskRepository,
            EmployeeRepository employeeRepository) {

        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    // Create a new task
    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
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
    public Task assignTaskToEmployee(Long taskId, Long employeeId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        task.setEmployee(employee);

        return taskRepository.save(task);
    }

    // Retrieve all tasks assigned to an employee
    @Override
    public List<Task> getTasksByEmployeeId(Long employeeId) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        return taskRepository.findByEmployeeOrderByIdAsc(employee);
    }

    // Update task status with validation
    @Override
    public Task updateTaskStatus(Long taskId, String status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // Check whether the supplied status is valid
        if (status == null ||
                !(status.trim().equalsIgnoreCase("PENDING") ||
                  status.trim().equalsIgnoreCase("IN_PROGRESS") ||
                  status.trim().equalsIgnoreCase("COMPLETED"))) {

            throw new IllegalArgumentException(
                    "Invalid status. Allowed values: PENDING, IN_PROGRESS, COMPLETED");
        }

        // Save the status in uppercase
        task.setStatus(status.trim().toUpperCase(Locale.ROOT));

        return taskRepository.save(task);
    }

    // Retrieve all tasks having a particular status
    @Override
    public List<Task> getTasksByStatus(String status) {
        return taskRepository.findByStatusOrderByIdAsc(status);
    }

    // Retrieve the task summary of an employee
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

    // Count the total number of tasks
    @Override
    public long getTotalTaskCount() {
        return taskRepository.count();
    }

    // Get overall task counts for the Admin dashboard
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
