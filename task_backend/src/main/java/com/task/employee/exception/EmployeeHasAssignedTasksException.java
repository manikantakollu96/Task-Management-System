package com.task.employee.exception;

// Thrown when an employee cannot be deleted because tasks are assigned to them.
public class EmployeeHasAssignedTasksException extends RuntimeException {

    public EmployeeHasAssignedTasksException(String message) {
        super(message);
    }
}
