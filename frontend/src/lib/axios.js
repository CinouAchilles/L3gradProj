import axios from "axios";

const instance = axios.create({
    baseURL: import.meta.env.DEV ? "http://localhost:5000/api" : "/api",
    withCredentials: true, // Include cookies in requests

});

export default instance;