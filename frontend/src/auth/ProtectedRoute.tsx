import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { JSX } from 'react';

export const ProtectedRoute = ({
    children,
    role
}: {
    children: JSX.Element;
    role?: 'admin'
}) => {
    const { user, isLoading } = useAuth();

    if (isLoading) return null;

    if (!user) return <Navigate to="/login" />
    
    if (role && user.role !== role) return <Navigate to="/" replace />;

    return children;
}