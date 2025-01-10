import { ROLE_PERMISSIONS } from '../constants/permissions';

export const hasPermission = (role: string, permission: string): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};