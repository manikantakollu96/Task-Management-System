
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.DEV
        ? "http://localhost:8080/api"
        : "https://task-management-backend-42ow.onrender.com/api",

    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
