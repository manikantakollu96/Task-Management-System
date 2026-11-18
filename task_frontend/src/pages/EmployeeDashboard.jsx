import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import "./EmployeeDashboard.css";

const employeeNavigation = [
    { id: "tasks", label: "My Tasks", icon: "▤" },
    { id: "update", label: "Update Task Status", icon: "↻" },
    { id: "summary", label: "My Summary", icon: "▥" }
];

function EmployeeDashboard({ employee }) {

    const [tasks, setTasks] = useState([]);

    const [summary, setSummary] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0
    });

    const [selectedStatuses, setSelectedStatuses] = useState({});
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [activeSection, setActiveSection] = useState("tasks");

    const [sidebarOpen, setSidebarOpen] = useState(
        () => window.innerWidth > 760
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Notification states
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    // Responsive sidebar
    useEffect(() => {

        let wasMobile = window.innerWidth <= 760;

        const handleViewportChange = () => {

            const isMobile = window.innerWidth <= 760;

            if (isMobile !== wasMobile) {
                setSidebarOpen(!isMobile);
                wasMobile = isMobile;
            }
        };

        window.addEventListener("resize", handleViewportChange);

        return () => {
            window.removeEventListener("resize", handleViewportChange);
        };

    }, []);

    // Fetch employee tasks
    const fetchMyTasks = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/tasks/employee/${employee.id}`
            );

            setTasks(response.data);

            const statusValues = {};

            response.data.forEach((task) => {
                statusValues[task.id] = task.status;
            });

            setSelectedStatuses(statusValues);

        } catch (error) {

            console.error("My tasks loading error:", error);

            setError("Unable to load your assigned tasks.");

        } finally {

            setLoading(false);
        }
    };

    // Fetch employee summary
    const fetchMySummary = async () => {

        try {

            const response = await api.get(
                `/tasks/employee/${employee.id}/summary`
            );

            setSummary(response.data);

        } catch (error) {

            console.error("Task summary loading error:", error);

            setError("Unable to load your task summary.");
        }
    };

    // Fetch employee notifications and unread count
    const fetchMyNotifications = async () => {

        try {

            const [notificationResponse, countResponse] =
                await Promise.all([

                    api.get(
                        `/notifications/employee/${employee.id}`
                    ),

                    api.get(
                        `/notifications/employee/${employee.id}/unread-count`
                    )

                ]);

            setNotifications(notificationResponse.data);
            setUnreadCount(countResponse.data);

        } catch (error) {

            console.error(
                "Notifications loading error:",
                error
            );
        }
    };

    // Load dashboard data when employee dashboard opens
    useEffect(() => {

        if (employee?.id) {

            fetchMyTasks();
            fetchMySummary();
            fetchMyNotifications();

        }

    }, [employee?.id]);

    // Refresh all dashboard data
    const handleRefresh = async () => {

        setSuccess("");

        await Promise.all([
            fetchMyTasks(),
            fetchMySummary(),
            fetchMyNotifications()
        ]);
    };

    // Select task status
    const handleStatusSelection = (taskId, newStatus) => {

        setSelectedStatuses((previous) => ({
            ...previous,
            [taskId]: newStatus
        }));
    };

    // Update task status
    const handleUpdateStatus = async (taskId) => {

        const newStatus = selectedStatuses[taskId];

        if (!newStatus) {

            setError("Please select a task status.");

            return;
        }

        try {

            setError("");
            setSuccess("");

            await api.put(
                `/tasks/${taskId}/status`,
                null,
                {
                    params: {
                        status: newStatus
                    }
                }
            );

            setSuccess("Task status updated successfully!");

            await Promise.all([
                fetchMyTasks(),
                fetchMySummary()
            ]);

        } catch (error) {

            console.error("Task status update error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to update task status."
            );
        }
    };

    // Expand or collapse task details
    const handleToggleDetails = (taskId) => {

        setExpandedTaskId((currentId) =>
            currentId === taskId ? null : taskId
        );
    };

    // Mark notification as read
    const handleMarkAsRead = async (notificationId) => {

        try {

            await api.put(
                `/notifications/${notificationId}/read`
            );

            await fetchMyNotifications();

        } catch (error) {

            console.error(
                "Mark notification as read error:",
                error
            );
        }
    };

    // Logout
    const handleLogout = () => {

        sessionStorage.removeItem("loggedInEmployee");

        window.location.href = "/";
    };

    const employeeName = employee?.name || "Employee";

    const activeLabel =
        employeeNavigation.find(
            (item) => item.id === activeSection
        )?.label || "My Tasks";

    return (

        <div className={`employee-app-shell ${
            sidebarOpen ? "employee-sidebar-open" : ""
        }`}>

            {/* Sidebar */}
            <aside
                id="employee-sidebar"
                className="employee-sidebar"
            >

                <div className="employee-profile">

                    <div className="employee-profile-avatar">
                        {employeeName.charAt(0).toUpperCase()}
                    </div>

                    <div className="employee-profile-copy">

                        <strong>{employeeName}</strong>

                        <span><i /> Employee</span>

                        <small>
                            {employee?.email || "Employee account"}
                        </small>

                    </div>

                </div>

                <div className="employee-sidebar-label">
                    WORKSPACE
                </div>

                <nav
                    className="employee-sidebar-nav"
                    aria-label="Employee navigation"
                >

                    {employeeNavigation.map((item) => (

                        <button
                            key={item.id}
                            className={`employee-nav-item ${
                                activeSection === item.id ? "active" : ""
                            }`}
                            onClick={() => {

                                setActiveSection(item.id);

                                if (window.innerWidth <= 760) {
                                    setSidebarOpen(false);
                                }

                            }}
                        >

                            <span>{item.icon}</span>

                            {item.label}

                        </button>

                    ))}

                </nav>

                <div className="employee-sidebar-footer">
                    TASK MANAGEMENT SYSTEM
                </div>

            </aside>

            {sidebarOpen && (

                <button
                    className="employee-sidebar-backdrop"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                />

            )}

            {/* Main Dashboard */}
            <div className="employee-app-main">

                {/* Top Header */}
                <header className="employee-topbar">

                    <button
                        type="button"
                        className="employee-sidebar-toggle"
                        aria-label={
                            sidebarOpen
                                ? "Close navigation"
                                : "Open navigation"
                        }
                        aria-expanded={sidebarOpen}
                        aria-controls="employee-sidebar"
                        onClick={() => setSidebarOpen((open) => !open)}
                    >
                        ☰
                    </button>

                    <div className="employee-topbar-title">
                        EMPLOYEE TASK MANAGEMENT SYSTEM
                    </div>

                    {/* Notification Bell (dark navy header, outside the orange profile section) */}
                    <button
                        type="button"
                        className="employee-notification-button"
                        onClick={() =>
                            setShowNotifications((previous) => !previous)
                        }
                        aria-label={`Notifications, ${unreadCount} unread`}
                        aria-expanded={showNotifications}
                    >
                        <svg
                            className="employee-notification-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                            <path d="M10 21h4" />
                        </svg>

                        {unreadCount > 0 && (
                            <span className="employee-notification-count">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </button>

                    <div className="employee-topbar-user">

                        <span className="employee-topbar-avatar">
                            {employeeName.charAt(0).toUpperCase()}
                        </span>

                        <span>{employeeName}</span>

                        <button
                            type="button"
                            className="employee-logout-button"
                            onClick={handleLogout}
                            aria-label="Log out"
                        >
                            Logout ↗
                        </button>

                    </div>

                </header>

                {/* Notification Panel */}
                {showNotifications && (

                    <div className="employee-notification-panel">

                        <div className="employee-notification-heading">

                            <h3>Notifications</h3>

                            <span>
                                {unreadCount} Unread
                            </span>

                        </div>

                        {notifications.length === 0 ? (

                            <p className="employee-notification-empty">
                                No notifications available.
                            </p>

                        ) : (

                            <div className="employee-notification-list">

                                {notifications.map((notification) => (

                                    <div
                                        key={notification.id}
                                        className={`employee-notification-item ${
                                            !notification.read
                                                ? "unread"
                                                : ""
                                        }`}
                                    >

                                        <div className="employee-notification-message">

                                            <p>
                                                {notification.message}
                                            </p>

                                            <small>
                                                {notification.createdAt
                                                    ? new Date(
                                                        notification.createdAt
                                                    ).toLocaleString()
                                                    : ""}
                                            </small>

                                        </div>

                                        {!notification.read && (

                                            <button
                                                type="button"
                                                className="employee-mark-read-button"
                                                onClick={() =>
                                                    handleMarkAsRead(
                                                        notification.id
                                                    )
                                                }
                                            >
                                                Mark as Read
                                            </button>

                                        )}

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                )}

                {/* Page Title */}
                <div className="employee-page-titlebar">

                    <span>Employee Workspace</span>

                    <strong>{activeLabel}</strong>

                </div>

                <main className="employee-dashboard-content">

                    {/* Welcome Section */}
                    <div className="employee-welcome">

                        <div>

                            <p className="employee-eyebrow">
                                YOUR WORKSPACE
                            </p>

                            <h1>
                                Welcome, {employeeName}!
                            </h1>

                            <p>
                                Here is an overview of your assigned work and progress.
                            </p>

                        </div>

                        <button
                            className="employee-refresh-button"
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            {loading ? "Refreshing..." : "↻ Refresh"}
                        </button>

                    </div>

                    {/* Quick Statistics */}
                    <div className="employee-quick-stats">

                        <article className="employee-quick-stat quick-pink">
                            <span>▤</span>
                            <strong>{summary.pendingTasks}</strong>
                            <small>Pending Tasks</small>
                        </article>

                        <article className="employee-quick-stat quick-orange">
                            <span>◷</span>
                            <strong>{summary.inProgressTasks}</strong>
                            <small>In Progress</small>
                        </article>

                        <article className="employee-quick-stat quick-teal">
                            <span>✓</span>
                            <strong>{summary.completedTasks}</strong>
                            <small>Completed Tasks</small>
                        </article>

                        <article className="employee-quick-stat quick-blue">
                            <span>▣</span>
                            <strong>{summary.totalTasks}</strong>
                            <small>All Tasks</small>
                        </article>

                    </div>

                    {/* Success and Error Messages */}
                    {(success || error) && (

                        <div className={
                            success
                                ? "employee-alert employee-alert-success"
                                : "employee-alert employee-alert-error"
                        }>
                            {success || error}
                        </div>

                    )}

                    {/* My Tasks Section */}
                    {activeSection === "tasks" && (

                        <section className="employee-section">

                            <div className="employee-section-heading">

                                <div>
                                    <h2>My Assigned Tasks</h2>
                                    <p>Review the tasks assigned to you.</p>
                                </div>

                            </div>

                            {loading ? (

                                <p className="employee-empty-state">
                                    Loading your tasks...
                                </p>

                            ) : tasks.length === 0 ? (

                                <p className="employee-empty-state">
                                    No tasks are currently assigned to you.
                                </p>

                            ) : (

                                <div className="employee-task-list">

                                    {tasks.map((task) => (

                                        <article
                                            className="employee-task-card"
                                            key={task.id}
                                        >

                                            <div className="employee-task-card-heading">

                                                <div>
                                                    <span className="employee-task-id">
                                                        TASK #{task.id}
                                                    </span>

                                                    <h3>{task.title}</h3>
                                                </div>

                                                <span className={`employee-status-badge ${
                                                    task.status?.toLowerCase()
                                                }`}>
                                                    {task.status?.replace("_", " ")}
                                                </span>

                                            </div>

                                            <div className="employee-task-meta">

                                                <span>
                                                    <b>Priority</b>
                                                    {task.priority}
                                                </span>

                                                <span>
                                                    <b>Due date</b>
                                                    {task.dueDate}
                                                </span>

                                            </div>

                                            <button
                                                className="employee-secondary-button"
                                                onClick={() =>
                                                    handleToggleDetails(task.id)
                                                }
                                            >
                                                {expandedTaskId === task.id
                                                    ? "Hide Details −"
                                                    : "View Details +"}
                                            </button>

                                            {expandedTaskId === task.id && (

                                                <div className="employee-task-details">

                                                    <h4>Task Details</h4>

                                                    <p>
                                                        <strong>Task ID:</strong> {task.id}
                                                    </p>

                                                    <p>
                                                        <strong>Title:</strong> {task.title}
                                                    </p>

                                                    <p>
                                                        <strong>Description:</strong> {task.description}
                                                    </p>

                                                    <p>
                                                        <strong>Priority:</strong> {task.priority}
                                                    </p>

                                                    <p>
                                                        <strong>Status:</strong> {task.status}
                                                    </p>

                                                    <p>
                                                        <strong>Due Date:</strong> {task.dueDate}
                                                    </p>

                                                </div>

                                            )}

                                        </article>

                                    ))}

                                </div>

                            )}

                        </section>

                    )}

                    {/* Update Task Status Section */}
                    {activeSection === "update" && (

                        <section className="employee-section">

                            <div className="employee-section-heading">

                                <div>
                                    <h2>Update Task Status</h2>
                                    <p>Select a new status for one of your assigned tasks.</p>
                                </div>

                            </div>

                            {loading ? (

                                <p className="employee-empty-state">
                                    Loading your tasks...
                                </p>

                            ) : tasks.length === 0 ? (

                                <p className="employee-empty-state">
                                    No assigned tasks available to update.
                                </p>

                            ) : (

                                <div className="employee-task-list">

                                    {tasks.map((task) => (

                                        <article
                                            className="employee-update-card"
                                            key={task.id}
                                        >

                                            <div className="employee-update-info">

                                                <span className="employee-task-id">
                                                    TASK #{task.id}
                                                </span>

                                                <h3>{task.title}</h3>

                                                <p>
                                                    Current status: <strong>{task.status}</strong>
                                                </p>

                                            </div>

                                            <div className="employee-status-controls">

                                                <select
                                                    value={
                                                        selectedStatuses[task.id] ||
                                                        task.status
                                                    }
                                                    onChange={(event) =>
                                                        handleStatusSelection(
                                                            task.id,
                                                            event.target.value
                                                        )
                                                    }
                                                    aria-label={`New status for ${task.title}`}
                                                >

                                                    <option value="PENDING">
                                                        PENDING
                                                    </option>

                                                    <option value="IN_PROGRESS">
                                                        IN_PROGRESS
                                                    </option>

                                                    <option value="COMPLETED">
                                                        COMPLETED
                                                    </option>

                                                </select>

                                                <button
                                                    className="employee-update-button"
                                                    onClick={() =>
                                                        handleUpdateStatus(task.id)
                                                    }
                                                    disabled={
                                                        selectedStatuses[task.id] ===
                                                        task.status
                                                    }
                                                >
                                                    Save Status
                                                </button>

                                            </div>

                                        </article>

                                    ))}

                                </div>

                            )}

                        </section>

                    )}

                    {/* Summary Section */}
                    {activeSection === "summary" && (

                        <section className="employee-section">

                            <div className="employee-section-heading">

                                <div>
                                    <h2>My Task Summary</h2>
                                    <p>Track your overall task progress.</p>
                                </div>

                            </div>

                            <div className="employee-summary-grid">

                                <article className="employee-summary-card summary-blue">
                                    <span>▣</span>
                                    <strong>{summary.totalTasks}</strong>
                                    <small>Total Tasks</small>
                                </article>

                                <article className="employee-summary-card summary-pink">
                                    <span>▤</span>
                                    <strong>{summary.pendingTasks}</strong>
                                    <small>Pending Tasks</small>
                                </article>

                                <article className="employee-summary-card summary-orange">
                                    <span>◷</span>
                                    <strong>{summary.inProgressTasks}</strong>
                                    <small>In Progress Tasks</small>
                                </article>

                                <article className="employee-summary-card summary-teal">
                                    <span>✓</span>
                                    <strong>{summary.completedTasks}</strong>
                                    <small>Completed Tasks</small>
                                </article>

                            </div>

                        </section>

                    )}

                </main>

                <footer className="employee-app-footer">
                    Employee Task Management System · Employee Workspace
                </footer>

            </div>

        </div>
    );
}

export default EmployeeDashboard;
