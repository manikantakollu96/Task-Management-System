
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import "./pages/Login.css";

function App() {

    // Get the current URL path
    const currentPath = window.location.pathname;

    // Get logged-in employee details
    const savedEmployee = sessionStorage.getItem("loggedInEmployee");

    const employee = savedEmployee
        ? JSON.parse(savedEmployee)
        : null;

    // Display Admin Dashboard
    if (currentPath === "/admin" && employee?.role === "ADMIN") {
        return <AdminDashboard employee={employee} />;
    }

    // Display Employee Dashboard
    if (currentPath === "/employee" && employee?.role === "EMPLOYEE") {
        return <EmployeeDashboard employee={employee} />;
    }

    // Otherwise display Login Page
    return <Login />;
}

export default App;
