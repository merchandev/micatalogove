export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  CLIENT: 'client',
};

export const ROLE_LABELS = {
  [ROLES.SUPERADMIN]: 'Superadmin',
  [ROLES.ADMIN]: 'Administrador',
  [ROLES.CLIENT]: 'Cliente',
};

export const STATUS_LABELS = {
  pending: 'Pendiente',
  active: 'Activo',
  suspended: 'Suspendido',
};

export const isSuperAdmin = (user) => user?.role === ROLES.SUPERADMIN;

export const isAdmin = (user) => user?.role === ROLES.ADMIN;

export const isClient = (user) => user?.role === ROLES.CLIENT;

export const isPlatformAdmin = (user) => isSuperAdmin(user) || isAdmin(user);

export const canManageBlog = (user) => isPlatformAdmin(user);

export const canManageUsers = (user) => isPlatformAdmin(user);

export const canAccessDatabase = (user) => isSuperAdmin(user);
