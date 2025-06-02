import axios from "axios";

const axiosInstance = axios.create({
        baseURL: "http://localhost:8090/api/kyc/",
        timeout: 10000,
        timeoutErrorMessage: "Timeout"
});

export default axiosInstance