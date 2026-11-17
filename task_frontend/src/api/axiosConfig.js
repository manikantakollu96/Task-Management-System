import axios from "axios";

// Common configuration for connecting React to Spring Boot
const api = axios.create({
    baseURL: "https://task-management-backend-42ow.onrender.com",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
