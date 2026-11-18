
package com.task.employee.service;

import com.task.employee.entity.Employee;
import com.task.employee.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class EmployeeCodeInitializer implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;

    public EmployeeCodeInitializer(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {

        List<Employee> employees =
                employeeRepository.findAllByOrderByIdAsc();

        Pattern pattern = Pattern.compile("^EMP(\\d+)$");

        int highestCodeNumber = 0;

        // Find the highest employee code already in the database.
        for (Employee employee : employees) {

            String code = employee.getEmployeeCode();

            if (code != null) {
                Matcher matcher = pattern.matcher(code);

                if (matcher.matches()) {
                    int number = Integer.parseInt(matcher.group(1));
                    highestCodeNumber = Math.max(highestCodeNumber, number);
                }
            }
        }

        boolean changed = false;

        // Assign codes only to employees without a code.
        for (Employee employee : employees) {

            if (employee.getEmployeeCode() == null ||
                    employee.getEmployeeCode().isBlank()) {

                highestCodeNumber++;

                String newCode = String.format(
                        Locale.ROOT,
                        "EMP%03d",
                        highestCodeNumber
                );

                employee.setEmployeeCode(newCode);
                changed = true;
            }
        }

        if (changed) {
            employeeRepository.saveAll(employees);
            System.out.println("Employee codes initialized successfully.");
        } else {
            System.out.println("All employees already have employee codes.");
        }
    }
}
