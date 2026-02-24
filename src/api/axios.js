import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let pendingRequests = [];

const processQueue = (newToken) => {
    pendingRequests.forEach((callback) => callback(newToken));
    pendingRequests = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config || {};
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            localStorage.removeItem('access_token');
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                pendingRequests.push((newToken) => {
                    if (!newToken) {
                        reject(error);
                        return;
                    }
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;
        try {
            const refreshResponse = await axios.post(
                `${API_BASE_URL}/api/auth/refresh`,
                { refresh_token: refreshToken },
                { headers: { 'Content-Type': 'application/json' } }
            );
            const { access_token, refresh_token } = refreshResponse.data;
            localStorage.setItem('access_token', access_token);
            if (refresh_token) {
                localStorage.setItem('refresh_token', refresh_token);
            }
            processQueue(access_token);
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
