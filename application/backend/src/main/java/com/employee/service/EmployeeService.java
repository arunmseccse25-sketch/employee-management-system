package com.employee.service;

import com.employee.entity.Employee;
import com.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    // Add one employee
    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    // Add multiple employees
    public List<Employee> addEmployees(List<Employee> employees) {
        return employeeRepository.saveAll(employees);
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id: " + id
                        ));
    }

    // Search employee by name
    public List<Employee> searchEmployees(String name) {
        return employeeRepository.findByNameContainingIgnoreCase(name);
    }

    // Update employee
    public Employee updateEmployee(Long id, Employee employeeDetails) {

        // 1. Check whether employee exists
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Employee not found with id: " + id
                        ));

        // 2. Check whether email belongs to another employee
        if (employeeRepository.existsByEmailAndIdNot(
                employeeDetails.getEmail(),
                id)) {

            throw new RuntimeException(
                    "Email is already registered"
            );
        }

        // 3. Check whether there are no changes
        boolean noChanges =
                isEqual(employee.getName(), employeeDetails.getName())
                        && isEqual(employee.getEmail(), employeeDetails.getEmail())
                        && isEqual(employee.getPhone(), employeeDetails.getPhone())
                        && isEqual(employee.getDepartment(), employeeDetails.getDepartment())
                        && isEqual(employee.getDesignation(), employeeDetails.getDesignation())
                        && isEqual(employee.getJoiningDate(), employeeDetails.getJoiningDate());

        if (noChanges) {
            throw new RuntimeException(
                    "No changes detected"
            );
        }

        // 4. Update employee fields
        employee.setName(employeeDetails.getName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPhone(employeeDetails.getPhone());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setDesignation(employeeDetails.getDesignation());
        employee.setJoiningDate(employeeDetails.getJoiningDate());

        // 5. Save updated employee
        return employeeRepository.save(employee);
    }

    // Delete employee by ID
    public void deleteEmployee(Long id) {

        if (!employeeRepository.existsById(id)) {
            throw new RuntimeException(
                    "Employee not found with id: " + id
            );
        }

        employeeRepository.deleteById(id);
    }

    // Delete all employees
    public void deleteAllEmployees() {

        if (employeeRepository.count() == 0) {
            throw new RuntimeException(
                    "No employees found"
            );
        }

        employeeRepository.deleteAll();
    }

    // Compare two values safely
    private boolean isEqual(Object first, Object second) {

        if (first == null && second == null) {
            return true;
        }

        if (first == null || second == null) {
            return false;
        }

        return first.equals(second);
    }
}