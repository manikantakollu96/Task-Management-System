import axios from "axios";

const api = axios.create({
    baseURL: "https://task-management-backend-42ow.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
