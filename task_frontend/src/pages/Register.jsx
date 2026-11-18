
import { useState } from "react";
import api from "../api/axiosConfig";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters");
            return;
        }

        setLoading(true);

        try {

            await api.post("/employees/register", {
                name: name,
                email: email,
                password: password,
                role: "EMPLOYEE"
            });

            setSuccess("Registration successful! You can now login.");

            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");

        } catch (error) {

            setError(
                error.response?.data || "Registration failed. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <form className="login-form" onSubmit={handleRegister}>

                <h2>Task Management System</h2>

                <h3>Employee Registration</h3>

                <input
                    type="text"
                    placeholder="Enter Full Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Create Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength="8"
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    minLength="8"
                    required
                />

                {error && <p className="error-message">{error}</p>}

                {success && (
                    <p style={{ color: "green", fontSize: "14px" }}>
                        {success}
                    </p>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>

                <p style={{ marginTop: "20px", fontSize: "14px" }}>
                    Already have an account?{" "}
                    <a href="/" style={{ color: "#2563eb" }}>
                        Login
                    </a>
                </p>

            </form>

        </div>
    );
}

export default Register;
