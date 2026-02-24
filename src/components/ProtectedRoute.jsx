import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        const destination =
            user.role === 'translator'
                ? '/translator/tasks'
                : user.role === 'linguist' || user.role === 'expert'
                    ? '/linguist/tasks'
                : user.role === 'admin'
                    ? '/admin/dashboard'
                    : '/dashboard';
        return <Navigate to={destination} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
