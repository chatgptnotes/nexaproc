import { useMemo } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { Role } from '@/types/auth';
import type { Permission } from '@/types/auth';

const ROLE_HIERARCHY: Role[] = [
  Role.Admin,
  Role.Engineer,
  Role.Supervisor,
  Role.Operator,
  Role.Viewer,
];

/**
 * Check if current user has at least the given role level.
 * Returns true if the user's role is equal or higher in the hierarchy.
 */
export function usePermission(requiredRole: Role): boolean {
  const userRole = useAuthStore((s) => s.user?.role);

  return useMemo(() => {
    if (!userRole) return false;
    const userLevel = ROLE_HIERARCHY.indexOf(userRole);
    const requiredLevel = ROLE_HIERARCHY.indexOf(requiredRole);
    if (userLevel === -1 || requiredLevel === -1) return false;
    return userLevel <= requiredLevel;
  }, [userRole, requiredRole]);
}

/**
 * Check if current user has a specific permission.
 */
export function useHasPermission(permission: Permission): boolean {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return useMemo(() => {
    return hasPermission(permission);
  }, [hasPermission, permission]);
}

/**
 * Check if current user has all of the given permissions.
 */
export function useHasAllPermissions(permissions: Permission[]): boolean {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return useMemo(() => {
    return permissions.every((p) => hasPermission(p));
  }, [hasPermission, permissions]);
}

/**
 * Check if current user has any of the given permissions.
 */
export function useHasAnyPermission(permissions: Permission[]): boolean {
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return useMemo(() => {
    return permissions.some((p) => hasPermission(p));
  }, [hasPermission, permissions]);
}
