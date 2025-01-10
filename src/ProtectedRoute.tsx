import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { hasPermission } from './services/authUtils';
import { RootState } from './services/store';

interface ProtectedRouteProps {
    permission: string;
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ permission, children }) => {
    const role = useSelector((state: RootState) => state.user.role);

    if (!hasPermission(role, permission)) {
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
