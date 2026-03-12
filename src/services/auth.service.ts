import type { AuthResponse, LoginRequest, RegisterRequest, TokenPair, User } from '@/types/auth';
import { Role } from '@/types/auth';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function createMockUser(email: string, role: Role, firstName: string, lastName: string): User {
  const now = new Date().toISOString();
  return {
    id: `user-${role}-${Date.now()}`,
    email,
    firstName,
    lastName,
    role,
    department: role === Role.Admin ? 'IT Administration' : 'Operations',
    isActive: true,
    lastLogin: now,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: now,
  };
}

function createMockTokens(): TokenPair {
  return {
    accessToken: `mock-access-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    refreshToken: `mock-refresh-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    expiresIn: 3600,
  };
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  await delay(350);

  const emailRoleMap: Record<string, Role> = {
    'admin@nexaproc.com': Role.Admin,
    'engineer@nexaproc.com': Role.Engineer,
    'supervisor@nexaproc.com': Role.Supervisor,
    'operator@nexaproc.com': Role.Operator,
  };

  const role = emailRoleMap[request.email.toLowerCase()] ?? Role.Viewer;

  const nameMap: Record<Role, { first: string; last: string }> = {
    [Role.Admin]: { first: 'Admin', last: 'User' },
    [Role.Engineer]: { first: 'Sarah', last: 'Chen' },
    [Role.Supervisor]: { first: 'James', last: 'Miller' },
    [Role.Operator]: { first: 'Carlos', last: 'Rivera' },
    [Role.Viewer]: { first: 'Demo', last: 'Viewer' },
  };

  const name = nameMap[role];
  const user = createMockUser(request.email, role, name.first, name.last);
  const tokens = createMockTokens();

  return { user, tokens };
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  await delay(500);

  const user = createMockUser(request.email, Role.Viewer, request.firstName, request.lastName);
  const tokens = createMockTokens();

  return { user, tokens };
}

export async function refreshToken(currentRefreshToken: string): Promise<TokenPair> {
  await delay(200);

  if (!currentRefreshToken || !currentRefreshToken.startsWith('mock-refresh-')) {
    throw new Error('Invalid refresh token');
  }

  return createMockTokens();
}

export async function getCurrentUser(): Promise<User> {
  await delay(250);

  return createMockUser('admin@nexaproc.com', Role.Admin, 'Admin', 'User');
}

export async function updateProfile(updates: Partial<User>): Promise<User> {
  await delay(300);

  const now = new Date().toISOString();
  return {
    id: updates.id ?? 'user-admin-001',
    email: updates.email ?? 'admin@nexaproc.com',
    firstName: updates.firstName ?? 'Admin',
    lastName: updates.lastName ?? 'User',
    role: updates.role ?? Role.Admin,
    department: updates.department ?? 'IT Administration',
    isActive: true,
    lastLogin: now,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: now,
  };
}

export async function changePassword(_currentPassword: string, _newPassword: string): Promise<void> {
  await delay(300);
  // Mock: always succeeds
}
