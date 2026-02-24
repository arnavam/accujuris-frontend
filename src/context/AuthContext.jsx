import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('access_token');
            const refreshToken = localStorage.getItem('refresh_token');
            if (token) {
                try {
                    const response = await api.get('/api/auth/me');
                    setUser(response.data);
                } catch (error) {
                    if (refreshToken) {
                        try {
                            const refreshResponse = await api.post('/api/auth/refresh', { refresh_token: refreshToken });
                            localStorage.setItem('access_token', refreshResponse.data.access_token);
                            if (refreshResponse.data.refresh_token) {
                                localStorage.setItem('refresh_token', refreshResponse.data.refresh_token);
                            }
                            const response = await api.get('/api/auth/me');
                            setUser(response.data);
                        } catch (refreshError) {
                            console.error("Token refresh failed:", refreshError);
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            setUser(null);
                        }
                    } else {
                        console.error("Token verification failed:", error);
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('refresh_token');
                        setUser(null);
                    }
                }
            }
            setLoading(false);
        };

        verifyToken();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token);
        }
        // Fetch full user details to ensure consistency
        const meResponse = await api.get('/api/auth/me');
        setUser(meResponse.data);
        return meResponse.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/api/auth/register', { name, email, password });
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        if (refresh_token) {
            localStorage.setItem('refresh_token', refresh_token);
        }
        const meResponse = await api.get('/api/auth/me');
        setUser(meResponse.data);
        return meResponse.data;
    };

    const logout = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        try {
            await api.post('/api/auth/logout', { refresh_token: refreshToken });
        } catch (error) {
            // Clear local state even if server-side logout fails.
        }
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
