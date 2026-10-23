package com.employee.controller;

import com.employee.entity.Employee;
import com.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    // Add one employee
    @PostMapping
    public ResponseEntity<Employee> addEmployee(
            @RequestBody Employee employee) {

        return ResponseEntity.ok(
                employeeService.addEmployee(employee)
        );
    }

    // Add multiple employees
    @PostMapping("/bulk")
    public ResponseEntity<List<Employee>> addEmployees(
            @RequestBody List<Employee> employees) {

        return ResponseEntity.ok(
                employeeService.addEmployees(employees)
        );
    }

    // Search employee
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(
            @RequestParam String name) {

        return ResponseEntity.ok(
                employeeService.searchEmployees(name)
        );
    }

    // Get all employees
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {

        return ResponseEntity.ok(
                employeeService.getAllEmployees()
        );
    }

    // Get employee by ID
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                employeeService.getEmployeeById(id)
        );
    }

    // Update employee
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody Employee employee) {

        return ResponseEntity.ok(
                employeeService.updateEmployee(id, employee)
        );
    }

    // Delete one employee
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(
            @PathVariable Long id) {

        employeeService.deleteEmployee(id);

        return ResponseEntity.ok(
                "Employee deleted successfully"
        );
    }

    // Delete all employees
    @DeleteMapping
    public ResponseEntity<String> deleteAllEmployees() {

        employeeService.deleteAllEmployees();

        return ResponseEntity.ok(
                "All employees deleted successfully"
        );
    }
}