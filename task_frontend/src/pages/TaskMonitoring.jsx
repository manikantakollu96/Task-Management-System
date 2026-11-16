
import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./TaskMonitoring.css";

function TaskMonitoring() {

    const [tasks, setTasks] = useState([]);
    const [summary, setSummary] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0
    });

    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load tasks based on the selected status
    const fetchTasks = async () => {
        try {
            setLoading(true);
            setError("");

            let response;

            if (selectedStatus === "ALL") {
                response = await api.get("/tasks");
            } else {
                response = await api.get(`/tasks/status/${selectedStatus}`);
            }

            setTasks(response.data);

        } catch (error) {
            console.error("Task monitoring error:", error);
            setError("Unable to load tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Load overall task counts
    const fetchSummary = async () => {
        try {
            const response = await api.get("/tasks/status-summary");
            setSummary(response.data);
        } catch (error) {
            console.error("Task summary error:", error);
            setError("Unable to load task summary.");
        }
    };

    // Load data when the page opens or the filter changes
    useEffect(() => {
        fetchTasks();
        fetchSummary();
    }, [selectedStatus]);

    // Refresh both the task list and summary
    const handleRefresh = () => {
        fetchTasks();
        fetchSummary();
    };

    return (
        <div className="task-monitoring">

            <div className="monitoring-heading">
                <div>
                    <h2>Task Monitoring</h2>
                    <p>Monitor tasks and track employee progress.</p>
                </div>

                <button
                    className="monitoring-refresh-button"
                    onClick={handleRefresh}
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Refresh"}
                </button>
            </div>

            {/* Overall task statistics */}
            <div className="monitoring-statistics">

                <div className="monitor-card total-monitor-card">
                    <h3>Total Tasks</h3>
                    <p>{summary.totalTasks}</p>
                </div>

                <div className="monitor-card pending-monitor-card">
                    <h3>Pending</h3>
                    <p>{summary.pendingTasks}</p>
                </div>

                <div className="monitor-card progress-monitor-card">
                    <h3>In Progress</h3>
                    <p>{summary.inProgressTasks}</p>
                </div>

                <div className="monitor-card completed-monitor-card">
                    <h3>Completed</h3>
                    <p>{summary.completedTasks}</p>
                </div>

            </div>

            {/* Status filter */}
            <div className="monitoring-filter">

                <label htmlFor="taskStatusFilter">
                    Filter tasks by status:
                </label>

                <select
                    id="taskStatusFilter"
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                >
                    <option value="ALL">All Tasks</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                </select>

            </div>

            {error && (
                <p className="monitoring-error">{error}</p>
            )}

            {/* Task monitoring table */}
            <div className="monitoring-table-container">

                <h3>
                    {selectedStatus === "ALL"
                        ? "All Tasks"
                        : `${selectedStatus.replace("_", " ")} Tasks`}
                </h3>

                {loading ? (
                    <p>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p>No tasks found for this status.</p>
                ) : (

                    <div className="monitoring-table-responsive">

                        <table className="monitoring-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Due Date</th>
                                    <th>Assigned Employee</th>
                                </tr>
                            </thead>

                            <tbody>

                                {tasks.map((task) => (

                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.title}</td>
                                        <td>{task.description}</td>
                                        <td>{task.priority}</td>

                                        <td>
                                            <span className={`monitor-status ${task.status?.toLowerCase()}`}>
                                                {task.status?.replace("_", " ")}
                                            </span>
                                        </td>

                                        <td>{task.dueDate}</td>

                                        <td>
                                            {task.employee?.name || "Not assigned"}
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

export default TaskMonitoring;
