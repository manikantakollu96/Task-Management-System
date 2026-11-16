import axios from "axios";

// Common configuration for connecting React to Spring Boot
const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
