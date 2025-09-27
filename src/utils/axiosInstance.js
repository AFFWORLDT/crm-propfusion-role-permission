import axios from "axios";
import Cookies from "universal-cookie";
import { getApiUrl } from "./getApiUrl";

const cookies = new Cookies();
const API_URL = getApiUrl();

const axiosInstance = axios.create({
    baseURL: API_URL,

    timeout: 30000,
    transport: {
        forceSafeSite: true,
    },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = cookies.get("USER")?.access_token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // Ensure we always return an object even if response is empty
        return {
            ...response,
            data: response.data || {},
        };
    },
    (error) => {
        console.error("API Error:", error);
        if (error.code === "ERR_QUIC_PROTOCOL_ERROR") {
            const retryConfig = {
                ...error.config,
                transport: {
                    forceSafeSite: true,
                },
            };
            return axiosInstance(retryConfig);
        }
        if (error.response?.status === 401) {
            // Clear both cookies and localStorage
            cookies.remove("USER", { path: "/" });

            // Clear all localStorage items
            localStorage.clear();

            // Redirect to login page
            window.location.href = "/login";

            // Return a rejected promise with a clear message
            return Promise.reject(
                new Error("Authentication failed. Please log in again.")
            );
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
