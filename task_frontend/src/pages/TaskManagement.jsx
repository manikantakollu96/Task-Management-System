
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./TaskManagement.css";

function TaskManagement() {

    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Task form fields
    const [taskId, setTaskId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [priority, setPriority] = useState("MEDIUM");
    const [dueDate, setDueDate] = useState("");
    const [employeeId, setEmployeeId] = useState("");

    const [isEditing, setIsEditing] = useState(false);

    // Load all tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/tasks");
            setTasks(response.data);

        } catch (error) {
            console.error("Task loading error:", error);
            setError("Unable to load tasks.");
        } finally {
            setLoading(false);
        }
    };

    // Load employees for the assignment dropdown
    const fetchEmployees = async () => {
        try {
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (error) {
            console.error("Employee loading error:", error);
            setError("Unable to load employees for task assignment.");
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    // Clear form fields
    const resetForm = () => {
        setTaskId(null);
        setTitle("");
        setDescription("");
        setStatus("PENDING");
        setPriority("MEDIUM");
        setDueDate("");
        setEmployeeId("");
        setIsEditing(false);
    };

    // Create or update a task
    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        const taskData = {
            title,
            description,
            status,
            priority,
            dueDate
        };

        try {
            let savedTask;

            if (isEditing) {
                const response = await api.put(
                    `/tasks/${taskId}`,
                    taskData
                );

                savedTask = response.data;
            } else {
                const response = await api.post("/tasks", taskData);

                savedTask = response.data;
            }

            // Assign the task if an employee was selected
            if (employeeId && savedTask?.id) {
                await api.put(
                    `/tasks/${savedTask.id}/assign/${employeeId}`
                );
            }

            setSuccess(
                isEditing
                    ? "Task updated successfully!"
                    : "Task created successfully!"
            );

            resetForm();
            await fetchTasks();

        } catch (error) {
            console.error("Task save error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to save task. Please check the entered details."
            );
        }
    };

    // Load task details into the form for editing
    const handleEdit = (task) => {
        setTaskId(task.id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate || "");
        setEmployeeId(task.employee?.id?.toString() || "");
        setIsEditing(true);

        setError("");
        setSuccess("");
    };

    // Delete a task
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        setError("");
        setSuccess("");

        try {
            await api.delete(`/tasks/${id}`);

            setSuccess("Task deleted successfully!");
            await fetchTasks();

        } catch (error) {
            console.error("Task delete error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to delete task."
            );
        }
    };

    return (
        <div className="task-management">

            <div className="task-heading">
                <h2>Task Management</h2>
                <p>Create, view, update, delete and assign tasks.</p>
            </div>

            {/* Task creation and update form */}
            <div className="task-form-container">

                <h3>
                    {isEditing ? "Update Task" : "Create New Task"}
                </h3>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Task Title"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        required
                    />

                    <textarea
                        placeholder="Task Description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        required
                    />

                    <select
                        value={priority}
                        onChange={(event) => setPriority(event.target.value)}
                        required
                    >
                        <option value="LOW">LOW Priority</option>
                        <option value="MEDIUM">MEDIUM Priority</option>
                        <option value="HIGH">HIGH Priority</option>
                    </select>

                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        required
                    >
                        <option value="PENDING">PENDING</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                    </select>

                    <div className="task-field">
                        <label htmlFor="taskDueDate">Due Date</label>
                        <input
                            id="taskDueDate"
                            type="date"
                            value={dueDate}
                            onChange={(event) => setDueDate(event.target.value)}
                            required
                        />
                    </div>

                    <div className="task-field">
                        <label htmlFor="taskEmployee">Assign to Employee</label>
                        <select
                            id="taskEmployee"
                            value={employeeId}
                            onChange={(event) => setEmployeeId(event.target.value)}
                        >
                            <option value="">Not assigned</option>

                            {employees
                                .filter((employee) => employee.role === "EMPLOYEE")
                                .map((employee) => (
                                    <option
                                        key={employee.id}
                                        value={employee.id}
                                    >
                                        {employee.name} ({employee.email})
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="task-form-buttons">

                        <button type="submit" className="task-save-button">
                            {isEditing ? "Update Task" : "Create Task"}
                        </button>

                        {isEditing && (
                            <button
                                type="button"
                                className="task-cancel-button"
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
                <p className="task-success">{success}</p>
            )}

            {error && (
                <p className="task-error">{error}</p>
            )}

            {/* All tasks table */}
            <div className="task-table-container">

                <div className="task-table-heading">
                    <h3>All Tasks</h3>

                    <button
                        className="task-refresh-button"
                        onClick={fetchTasks}
                        disabled={loading}
                    >
                        {loading ? "Loading..." : "Refresh"}
                    </button>
                </div>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found.</p>
                ) : (

                    <div className="task-table-responsive">

                        <table className="task-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Assigned Employee</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {tasks.map((task) => (

                                    <tr key={task.id}>

                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.priority}</td>
                                        <td>{task.status}</td>
                                        <td>{task.dueDate}</td>

                                        <td>
                                            {task.employee?.name || "Not assigned"}
                                        </td>

                                        <td>
                                            <button
                                                className="task-edit-button"
                                                onClick={() => handleEdit(task)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="task-delete-button"
                                                onClick={() => handleDelete(task.id)}
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

export default TaskManagement;
