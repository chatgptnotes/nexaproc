import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  UserX,
  UserCheck,
  Shield,
  Mail,
} from 'lucide-react';

import { Card, Badge, Button, Modal, Input, Select } from '@/components/ui';

/* ---------- Mock Data ---------- */

type Role = 'admin' | 'engineer' | 'supervisor' | 'operator' | 'viewer';

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const roleConfig: Record<Role, { label: string; variant: 'danger' | 'info' | 'warning' | 'success' | 'neutral' }> = {
  admin: { label: 'Admin', variant: 'danger' },
  engineer: { label: 'Engineer', variant: 'info' },
  supervisor: { label: 'Supervisor', variant: 'warning' },
  operator: { label: 'Operator', variant: 'success' },
  viewer: { label: 'Viewer', variant: 'neutral' },
};

const initialUsers: User[] = [
  { id: 'U1', name: 'Rajesh Kumar', email: 'rajesh.kumar@nexaproc.com', role: 'admin', department: 'IT', status: 'Active', lastLogin: '12 Mar 08:15' },
  { id: 'U2', name: 'Priya Singh', email: 'priya.singh@nexaproc.com', role: 'engineer', department: 'Engineering', status: 'Active', lastLogin: '12 Mar 07:45' },
  { id: 'U3', name: 'John Smith', email: 'john.smith@nexaproc.com', role: 'supervisor', department: 'Operations', status: 'Active', lastLogin: '12 Mar 06:02' },
  { id: 'U4', name: 'Amit Patel', email: 'amit.patel@nexaproc.com', role: 'operator', department: 'Operations', status: 'Active', lastLogin: '12 Mar 06:00' },
  { id: 'U5', name: 'Sneha Reddy', email: 'sneha.reddy@nexaproc.com', role: 'engineer', department: 'Engineering', status: 'Active', lastLogin: '11 Mar 16:30' },
  { id: 'U6', name: 'Vikram Joshi', email: 'vikram.joshi@nexaproc.com', role: 'operator', department: 'Operations', status: 'Active', lastLogin: '12 Mar 05:55' },
  { id: 'U7', name: 'Anita Sharma', email: 'anita.sharma@nexaproc.com', role: 'viewer', department: 'Management', status: 'Active', lastLogin: '11 Mar 14:20' },
  { id: 'U8', name: 'Mohammed Ali', email: 'mohammed.ali@nexaproc.com', role: 'supervisor', department: 'Quality', status: 'Active', lastLogin: '12 Mar 07:00' },
  { id: 'U9', name: 'Kavita Nair', email: 'kavita.nair@nexaproc.com', role: 'viewer', department: 'Management', status: 'Inactive', lastLogin: '28 Feb 10:15' },
  { id: 'U10', name: 'Suresh Menon', email: 'suresh.menon@nexaproc.com', role: 'operator', department: 'Maintenance', status: 'Inactive', lastLogin: '01 Mar 08:00' },
];

/* ---------- Component ---------- */

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<string>('operator');
  const [formDept, setFormDept] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, filterRole, filterStatus]);

  const roleCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    users.forEach((u) => {
      counts[u.role] = (counts[u.role] || 0) + 1;
    });
    return counts;
  }, [users]);

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">User Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage user accounts, roles, and access
            </p>
          </div>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setAddModalOpen(true)}>
          Add User
        </Button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {(Object.keys(roleConfig) as Role[]).map((role) => {
          const config = roleConfig[role];
          return (
            <div
              key={role}
              className="rounded-lg border border-scada-border bg-scada-panel/75 p-4 flex items-center gap-3 hover:border-scada-border transition-colors cursor-pointer"
              onClick={() => setFilterRole(filterRole === role ? 'all' : role)}
            >
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-lg font-bold text-white">{roleCounts[role] || 0}</p>
                <p className="text-xs text-gray-500">{config.label}s</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] max-w-xs">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'admin', label: 'Admin' },
            { value: 'engineer', label: 'Engineer' },
            { value: 'supervisor', label: 'Supervisor' },
            { value: 'operator', label: 'Operator' },
            { value: 'viewer', label: 'Viewer' },
          ]}
          value={filterRole}
          onChange={setFilterRole}
          className="w-40"
        />
        <Select
          options={[
            { value: 'all', label: 'All Status' },
            { value: 'Active', label: 'Active' },
            { value: 'Inactive', label: 'Inactive' },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
          className="w-40"
        />
        <span className="text-xs text-gray-500">{filteredUsers.length} users found</span>
      </div>

      {/* Users Table */}
      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border bg-scada-dark/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Last Login</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const rc = roleConfig[user.role];
                return (
                  <tr
                    key={user.id}
                    className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-nexaproc-amber/10 flex items-center justify-center text-xs font-bold text-nexaproc-amber">
                          {user.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-white/80 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={rc.variant}>{rc.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{user.department}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={user.status === 'Active' ? 'success' : 'neutral'}
                        dot
                        pulse={user.status === 'Active'}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{user.lastLogin}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Edit user"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'Active' ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add User Modal */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New User"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setAddModalOpen(false)}>Create User</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Enter full name"
          />
          <Input
            label="Email Address"
            type="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="user@nexaproc.com"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'engineer', label: 'Engineer' },
                { value: 'supervisor', label: 'Supervisor' },
                { value: 'operator', label: 'Operator' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              value={formRole}
              onChange={setFormRole}
            />
            <Input
              label="Department"
              value={formDept}
              onChange={(e) => setFormDept(e.target.value)}
              placeholder="e.g. Operations"
            />
          </div>
          <Input
            label="Password"
            type="password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
            placeholder="Minimum 8 characters"
          />
        </div>
      </Modal>
    </div>
  );
}
