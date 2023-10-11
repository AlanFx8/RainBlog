import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
    withCredentials: true
});

export default axiosInstance;