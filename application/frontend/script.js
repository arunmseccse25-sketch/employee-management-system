
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080/api/employees"
        : "/api/employees";

        //const API_URL = "http://employee.example.com/api/employees";



// ===============================
// Load all employees
// ===============================

async function loadEmployees() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load employees");
        }

        const employees = await response.json();

        displayEmployees(employees);

    } catch (error) {

        showMessage(error.message, true);

    }
}


// ===============================
// Display employees
// ===============================

function displayEmployees(employees) {

    const tableBody =
        document.getElementById("employeeTableBody");

    tableBody.innerHTML = "";

    if (employees.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8">
                    No employees found
                </td>
            </tr>
        `;

        return;
    }

    employees.forEach(employee => {

        const row = document.createElement("tr");

        row.innerHTML = `

            <td>${employee.id}</td>

            <td>${employee.name}</td>

            <td>${employee.email}</td>

            <td>${employee.phone || ""}</td>

            <td>${employee.department || ""}</td>

            <td>${employee.designation || ""}</td>

            <td>${employee.joiningDate || ""}</td>

            <td>

                <button
                    class="edit-button"
                    onclick='editEmployee(${JSON.stringify(employee)})'
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteEmployee(${employee.id})"
                >
                    Delete
                </button>

            </td>
        `;

        tableBody.appendChild(row);

    });
}


// ===============================
// Add / Update employee
// ===============================

document
    .getElementById("employeeForm")
    .addEventListener("submit", async function(event) {

        event.preventDefault();

        const employeeId =
            document.getElementById("employeeId").value;

        const employee = {

            name: document.getElementById("name").value,

            email: document.getElementById("email").value,

            phone: document.getElementById("phone").value,

            department:
                document.getElementById("department").value,

            designation:
                document.getElementById("designation").value,

            joiningDate:
                document.getElementById("joiningDate").value
        };


        try {

            let response;

            // UPDATE
            if (employeeId) {

                response = await fetch(
                    `${API_URL}/${employeeId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(employee)
                    }
                );

            }

            // ADD
            else {

                response = await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(employee)
                    }
                );
            }


            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    errorData.error ||
                    "Operation failed"
                );
            }


            const result = await response.json();


            if (employeeId) {

                showMessage(
                    "Employee updated successfully"
                );

            } else {

                showMessage(
                    "Employee added successfully"
                );
            }


            resetForm();

            loadEmployees();


        } catch (error) {

            showMessage(error.message, true);

        }

    });


// ===============================
// Edit employee
// ===============================

function editEmployee(employee) {

    document.getElementById("employeeId").value =
        employee.id;

    document.getElementById("name").value =
        employee.name;

    document.getElementById("email").value =
        employee.email;

    document.getElementById("phone").value =
        employee.phone || "";

    document.getElementById("department").value =
        employee.department || "";

    document.getElementById("designation").value =
        employee.designation || "";

    document.getElementById("joiningDate").value =
        employee.joiningDate || "";


    document.getElementById("formTitle").textContent =
        "Update Employee";

    document.getElementById("saveButton").textContent =
        "Update Employee";

    document.getElementById("cancelButton").style.display =
        "inline-block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// Cancel edit
// ===============================

function cancelEdit() {

    resetForm();

}


// ===============================
// Reset form
// ===============================

function resetForm() {

    document.getElementById("employeeForm").reset();

    document.getElementById("employeeId").value = "";

    document.getElementById("formTitle").textContent =
        "Add Employee";

    document.getElementById("saveButton").textContent =
        "Add Employee";

    document.getElementById("cancelButton").style.display =
        "none";
}


// ===============================
// Delete employee
// ===============================

async function deleteEmployee(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this employee?"
        );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.error ||
                "Failed to delete employee"
            );
        }


        showMessage(
            "Employee deleted successfully"
        );

        loadEmployees();


    } catch (error) {

        showMessage(error.message, true);

    }
}


// ===============================
// Search employees
// ===============================

async function searchEmployees() {

    const name =
        document.getElementById("searchInput").value.trim();


    if (!name) {

        loadEmployees();

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/search?name=${encodeURIComponent(name)}`
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            throw new Error(
                errorData.error ||
                "Search failed"
            );
        }


        const employees =
            await response.json();

        displayEmployees(employees);


    } catch (error) {

        showMessage(error.message, true);

    }
}


// ===============================
// Show message
// ===============================

function showMessage(message, isError = false) {

    const messageElement =
        document.getElementById("message");

    messageElement.textContent = message;

    if (isError) {
        messageElement.style.color = "red";
    } else {
        messageElement.style.color = "green";
    }


    setTimeout(() => {

        messageElement.textContent = "";

    }, 3000);
}


// ===============================
// Load employees when page opens
// ===============================

loadEmployees();