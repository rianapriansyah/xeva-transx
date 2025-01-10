import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission } from '../services/authUtils';
import { RootState } from '../services/store';

interface ProtectedComponentProps {
    permission: string;
    children: React.ReactNode;
}

const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ permission, children }) => {
    const role = useSelector((state: RootState) => state.user.role);

    if (!hasPermission(role, permission)) {
        return null; // Hide the component if permission is not granted
    }

    return <>{children}</>;
};

export default ProtectedComponent;
