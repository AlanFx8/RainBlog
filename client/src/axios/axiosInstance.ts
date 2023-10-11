import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '',
    timeout: 5000,
    headers: {
        'Content-Type': 'multipart/form-data',
    }
});

export default axiosInstance;