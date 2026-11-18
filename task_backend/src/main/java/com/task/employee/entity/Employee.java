
package com.task.employee.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "employee_code", length = 20)
    private String employeeCode;
    // Employee name cannot be empty
    @NotBlank(message = "Employee name is required")
    private String name;

    // Email must be valid
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;

    // Password is accepted in requests but hidden in responses
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must contain at least 8 characters")
    private String password;

    // Only ADMIN or EMPLOYEE roles are allowed
    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ADMIN|EMPLOYEE",
             message = "Role must be ADMIN or EMPLOYEE")
    private String role;

    // One employee can have multiple tasks
    @OneToMany(mappedBy = "employee")
    @JsonIgnore
    private List<Task> tasks;

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public String getEmployeeCode() {
        return employeeCode;
    }

    public void setEmployeeCode(String employeeCode) {
        this.employeeCode = employeeCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }
}
