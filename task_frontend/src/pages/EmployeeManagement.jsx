
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./EmployeeManagement.css";

function EmployeeManagement() {

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Form fields
    const [employeeId, setEmployeeId] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("EMPLOYEE");

    const [isEditing, setIsEditing] = useState(false);

    // Get all employees
    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/employees");
            setEmployees(response.data);

        } catch (error) {
            console.error("Employee loading error:", error);
            setError("Unable to load employees.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // Clear the form
    const resetForm = () => {
        setEmployeeId(null);
        setName("");
        setEmail("");
        setPassword("");
        setRole("EMPLOYEE");
        setIsEditing(false);
    };

    // Create or update employee
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const employeeData = {
            name,
            email,
            password,
            role
        };

        try {
            if (isEditing) {
                await api.put(
                    `/employees/${employeeId}`,
                    employeeData
                );

                setSuccess("Employee updated successfully!");
            } else {
                await api.post("/employees", employeeData);

                setSuccess("Employee created successfully!");
            }

            resetForm();
            await fetchEmployees();

        } catch (error) {
            console.error("Employee save error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to save employee. Please check the entered details."
            );
        }
    };

    // Load employee details into the form
    const handleEdit = (employee) => {
        setEmployeeId(employee.id);
        setName(employee.name);
        setEmail(employee.email);

        // Password is write-only and is not returned by the API.
        // Enter a new password when updating an employee.
        setPassword("");

        setRole(employee.role);
        setIsEditing(true);

        setError("");
        setSuccess("");
    };

    // Delete employee
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/employees/${id}`);

            setSuccess("Employee deleted successfully!");
            await fetchEmployees();

        } catch (error) {
            console.error("Employee delete error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to delete employee. They may have assigned tasks."
            );
        }
    };

    return (
        <div className="employee-management">

            <div className="employee-heading">
                <h2>Employee Management</h2>
                <p>Create, view, update and delete employees.</p>
            </div>

            {/* Employee form */}
            <div className="employee-form-container">

                <h3>
                    {isEditing ? "Update Employee" : "Add New Employee"}
                </h3>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Employee Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Employee Email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder={
                            isEditing
                                ? "Enter New Password"
                                : "Employee Password"
                        }
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        minLength={8}
                        required
                    />

                    <select
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        required
                    >
                        <option value="EMPLOYEE">EMPLOYEE</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <div className="employee-form-buttons">

                        <button type="submit" className="save-button">
                            {isEditing ? "Update Employee" : "Create Employee"}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>
            </div>

            {/* Success and error messages */}
            {success && (
                <p className="employee-success">{success}</p>
            )}

            {error && (
                <p className="employee-error">{error}</p>
            )}

            {/* Employee table */}
            <div className="employee-table-container">

                <h3>All Employees</h3>

                {loading ? (
                    <p>Loading employees...</p>
                ) : employees.length === 0 ? (
                    <p>No employees found.</p>
                ) : (

                    <div className="table-responsive">

                        <table className="employee-table">

                            <thead>
                                <tr>
                                    <th>Employee Code</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {employees.map((employee) => (

                                    <tr key={employee.id}>

                                        <td>{employee.employeeCode}</td>
                                        <td>{employee.name}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.role}</td>

                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(employee)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(employee.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}

export default EmployeeManagement;
