export const ROLES = {
	ADMIN: 'admin',
	CASHIER: 'cashier',
};

export const PERMISSIONS = {
	MANAGE_PRODUCTS: 'manage_products',
	VIEW_ORDERS: 'view_orders',
	PROCESS_ORDERS: 'process_orders',
	TRANSACTIONS: 'transactions',
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
	[ROLES.ADMIN]: [PERMISSIONS.MANAGE_PRODUCTS, PERMISSIONS.VIEW_ORDERS, PERMISSIONS.PROCESS_ORDERS, PERMISSIONS.TRANSACTIONS],
	[ROLES.CASHIER]: [PERMISSIONS.TRANSACTIONS]
};
