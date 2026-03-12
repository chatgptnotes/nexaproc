import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { Role, Permission, ROLE_PERMISSIONS } from '@/types/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;

  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
}

function createMockUser(email: string, role: Role): User {
  const now = new Date().toISOString();
  const names: Record<Role, { first: string; last: string; dept: string }> = {
    [Role.Admin]: { first: 'Admin', last: 'User', dept: 'IT Administration' },
    [Role.Engineer]: { first: 'Sarah', last: 'Chen', dept: 'Process Engineering' },
    [Role.Supervisor]: { first: 'James', last: 'Miller', dept: 'Production' },
    [Role.Operator]: { first: 'Carlos', last: 'Rivera', dept: 'Operations' },
    [Role.Viewer]: { first: 'Demo', last: 'Viewer', dept: 'General' },
  };
  const info = names[role];
  return {
    id: `user-${role}-001`,
    email,
    firstName: info.first,
    lastName: info.last,
    role,
    department: info.dept,
    isActive: true,
    lastLogin: now,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: now,
  };
}

function resolveRole(email: string, password: string): Role | null {
  const map: Record<string, { password: string; role: Role }> = {
    'admin@nexaproc.com': { password: 'admin', role: Role.Admin },
    'engineer@nexaproc.com': { password: 'engineer', role: Role.Engineer },
    'supervisor@nexaproc.com': { password: 'supervisor', role: Role.Supervisor },
    'operator@nexaproc.com': { password: 'operator', role: Role.Operator },
  };
  const entry = map[email.toLowerCase()];
  if (entry && entry.password === password) {
    return entry.role;
  }
  // Any other valid-looking credentials get viewer role
  if (email.includes('@') && password.length >= 1) {
    return Role.Viewer;
  }
  return null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,

      isAuthenticated: () => {
        return get().user !== null && get().token !== null;
      },

      login: async (email: string, password: string) => {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 300));

        const role = resolveRole(email, password);
        if (!role) {
          throw new Error('Invalid email or password');
        }

        const user = createMockUser(email, role);
        const token = `mock-jwt-${role}-${Date.now()}`;
        const refresh = `mock-refresh-${role}-${Date.now()}`;

        set({ user, token, refreshToken: refresh });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setTokens: (accessToken: string, refreshToken: string) => {
        set({ token: accessToken, refreshToken });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null });
      },

      hasPermission: (permission: Permission) => {
        const { user } = get();
        if (!user) return false;
        const permissions = ROLE_PERMISSIONS[user.role];
        return permissions.includes(permission);
      },

      hasRole: (role: Role) => {
        const { user } = get();
        if (!user) return false;
        const hierarchy: Role[] = [Role.Admin, Role.Engineer, Role.Supervisor, Role.Operator, Role.Viewer];
        const userLevel = hierarchy.indexOf(user.role);
        const requiredLevel = hierarchy.indexOf(role);
        return userLevel <= requiredLevel;
      },
    }),
    {
      name: 'nexaproc-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
