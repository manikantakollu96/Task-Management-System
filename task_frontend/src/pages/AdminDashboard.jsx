import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import EmployeeManagement from "./EmployeeManagement";
import TaskManagement from "./TaskManagement";
import TaskMonitoring from "./TaskMonitoring";
import "./Dashboard.css";

const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: "▦" },
    { id: "employees", label: "Employees", icon: "♙" },
    { id: "tasks", label: "Tasks", icon: "▤" },
    { id: "monitoring", label: "Task Monitoring", icon: "◷" }
];

function AdminDashboard({ employee }) {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [pendingTasks, setPendingTasks] = useState(0);
    const [inProgressTasks, setInProgressTasks] = useState(0);
    const [completedTasks, setCompletedTasks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeSection, setActiveSection] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth > 760);
    // Keep the navigation state in sync when the browser crosses the mobile breakpoint.
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
        return () => window.removeEventListener("resize", handleViewportChange);
    }, []);


    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError("");
            const [employeeResponse, taskResponse, statusResponse] = await Promise.all([
                api.get("/employees/count"),
                api.get("/tasks/count"),
                api.get("/tasks/status-summary")
            ]);

            setTotalEmployees(employeeResponse.data);
            setTotalTasks(taskResponse.data);
            setPendingTasks(statusResponse.data.pendingTasks);
            setInProgressTasks(statusResponse.data.inProgressTasks);
            setCompletedTasks(statusResponse.data.completedTasks);
        } catch (error) {
            console.error("Dashboard loading error:", error);
            setError("Unable to load dashboard statistics.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem("loggedInEmployee");
        window.location.href = "/";
    };

    const renderActiveSection = () => {
        if (activeSection === "employees") return <EmployeeManagement />;
        if (activeSection === "tasks") return <TaskManagement />;
        if (activeSection === "monitoring") return <TaskMonitoring />;

        return (
            <section className="admin-overview">
                <div className="page-heading-row">
                    <div>
                        <p className="eyebrow">OVERVIEW</p>
                        <h2>Dashboard Overview</h2>
                        <p className="page-description">A quick look at your employees and task progress.</p>
                    </div>
                    <button className="dashboard-action-button" onClick={fetchDashboardData} disabled={loading}>
                        {loading ? "Refreshing..." : "↻ Refresh"}
                    </button>
                </div>

                {error && <p className="dashboard-error">{error}</p>}

                {loading ? (
                    <div className="dashboard-loading">Loading dashboard statistics...</div>
                ) : (
                    <div className="statistics-grid">
                        <article className="stat-card stat-orange">
                            <div className="stat-icon">♙</div>
                            <div className="stat-value">{totalEmployees}</div>
                            <div className="stat-label">Total Employees</div>
                        </article>
                        <article className="stat-card stat-blue">
                            <div className="stat-icon">▤</div>
                            <div className="stat-value">{totalTasks}</div>
                            <div className="stat-label">Total Tasks</div>
                        </article>
                        <article className="stat-card stat-pink">
                            <div className="stat-icon">▣</div>
                            <div className="stat-value">{pendingTasks}</div>
                            <div className="stat-label">Pending Tasks</div>
                        </article>
                        <article className="stat-card stat-teal">
                            <div className="stat-icon">◷</div>
                            <div className="stat-value">{inProgressTasks}</div>
                            <div className="stat-label">In Progress</div>
                        </article>
                        <article className="stat-card stat-green">
                            <div className="stat-icon">✓</div>
                            <div className="stat-value">{completedTasks}</div>
                            <div className="stat-label">Completed Tasks</div>
                        </article>
                    </div>
                )}
            </section>
        );
    };

    const activeLabel = navigationItems.find((item) => item.id === activeSection)?.label || "Dashboard";
    const adminName = employee?.name || "Admin";

    return (
        <div className={`app-shell ${sidebarOpen ? "sidebar-is-open" : ""}`}>
            <aside id="admin-sidebar" className="app-sidebar">
                <div className="sidebar-profile">
                    <div className="profile-avatar">{adminName.charAt(0).toUpperCase()}</div>
                    <div className="profile-copy">
                        <strong>{adminName}</strong>
                        <span className="profile-role"><i /> Administrator</span>
                        <small>{employee?.email || "Admin account"}</small>
                    </div>
                </div>

                <div className="sidebar-section-label">GENERAL</div>
                <nav className="sidebar-navigation" aria-label="Admin navigation">
                    {navigationItems.map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar-nav-item ${activeSection === item.id ? "active" : ""}`}
                            onClick={() => {
                                setActiveSection(item.id);
                                // Keep the sidebar visible on desktop; close it after selection on mobile.
                                if (window.innerWidth <= 760) setSidebarOpen(false);
                            }}
                        >
                            <span className="sidebar-nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">TASK MANAGEMENT SYSTEM</div>
            </aside>

            {sidebarOpen && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

            <div className="app-main">
                <header className="app-topbar">
                    <button type="button" className="sidebar-toggle" aria-label={sidebarOpen ? "Close navigation" : "Open navigation"} aria-expanded={sidebarOpen} aria-controls="admin-sidebar" onClick={() => setSidebarOpen((open) => !open)}>☰</button>
                    <div className="topbar-title">EMPLOYEE TASK MANAGEMENT SYSTEM</div>
                    <div className="topbar-user">
                        <span className="topbar-avatar">{adminName.charAt(0).toUpperCase()}</span>
                        <span>{adminName}</span>
                        <button type="button" className="topbar-logout" onClick={handleLogout}>Logout ↗</button>
                    </div>
                </header>

                <div className="page-titlebar">
                    <span>Admin Workspace</span>
                    <strong>{activeLabel}</strong>
                </div>

                <main className="dashboard-content">
                    {renderActiveSection()}
                </main>

                <footer className="app-footer">Employee Task Management System · Admin Workspace</footer>
            </div>
        </div>
    );
}

export default AdminDashboard;
