
import { useState } from "react";
import api from "../api/axiosConfig";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/employees/login", {
                email: email,
                password: password
            });

            const employee = response.data;

            sessionStorage.setItem(
                "loggedInEmployee",
                JSON.stringify(employee)
            );

            if (employee.role === "ADMIN") {
                window.location.href = "/admin";
            } else if (employee.role === "EMPLOYEE") {
                window.location.href = "/employee";
            } else {
                sessionStorage.removeItem("loggedInEmployee");
                setError("Invalid user role");
            }

        } catch (error) {
            setError(
                error.response?.data || "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Task Management System</h2>
                <h3>Login</h3>

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {error && <p className="error-message">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ marginTop: "20px", fontSize: "14px" }}>
                    Don't have an account?{" "}
                    <a href="/register" style={{ color: "#2563eb" }}>
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}

export default Login;
