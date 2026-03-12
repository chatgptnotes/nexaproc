import React, { useState } from 'react';
import {
  KeyRound,
  Check,
  X,
  Save,
  Shield,
} from 'lucide-react';

import { Card, Badge, Button } from '@/components/ui';

/* ---------- Mock Data ---------- */

type Role = 'Admin' | 'Engineer' | 'Supervisor' | 'Operator' | 'Viewer';

const roles: Role[] = ['Admin', 'Engineer', 'Supervisor', 'Operator', 'Viewer'];

const roleBadgeVariant: Record<Role, 'danger' | 'info' | 'warning' | 'success' | 'neutral'> = {
  Admin: 'danger',
  Engineer: 'info',
  Supervisor: 'warning',
  Operator: 'success',
  Viewer: 'neutral',
};

interface Permission {
  id: string;
  name: string;
  category: string;
}

const permissions: Permission[] = [
  { id: 'view_dashboard', name: 'View Dashboard', category: 'Dashboard' },
  { id: 'view_tags', name: 'View Tags', category: 'Tags' },
  { id: 'edit_tags', name: 'Edit Tags', category: 'Tags' },
  { id: 'view_alarms', name: 'View Alarms', category: 'Alarms' },
  { id: 'ack_alarms', name: 'Acknowledge Alarms', category: 'Alarms' },
  { id: 'configure_alarms', name: 'Configure Alarm Rules', category: 'Alarms' },
  { id: 'view_equipment', name: 'View Equipment', category: 'Equipment' },
  { id: 'configure_equipment', name: 'Configure Equipment', category: 'Equipment' },
  { id: 'view_reports', name: 'View Reports', category: 'Reports' },
  { id: 'create_reports', name: 'Create Reports', category: 'Reports' },
  { id: 'view_trends', name: 'View Trends', category: 'Data' },
  { id: 'export_data', name: 'Export Data', category: 'Data' },
  { id: 'manage_users', name: 'Manage Users', category: 'Admin' },
  { id: 'manage_roles', name: 'Manage Roles', category: 'Admin' },
  { id: 'system_settings', name: 'System Settings', category: 'Admin' },
];

// Default permission matrix
const defaultMatrix: Record<string, Record<Role, boolean>> = {
  view_dashboard: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: true },
  view_tags: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: true },
  edit_tags: { Admin: true, Engineer: true, Supervisor: false, Operator: false, Viewer: false },
  view_alarms: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: true },
  ack_alarms: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: false },
  configure_alarms: { Admin: true, Engineer: true, Supervisor: false, Operator: false, Viewer: false },
  view_equipment: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: true },
  configure_equipment: { Admin: true, Engineer: true, Supervisor: true, Operator: false, Viewer: false },
  view_reports: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: true },
  create_reports: { Admin: true, Engineer: true, Supervisor: true, Operator: false, Viewer: false },
  view_trends: { Admin: true, Engineer: true, Supervisor: true, Operator: true, Viewer: true },
  export_data: { Admin: true, Engineer: true, Supervisor: true, Operator: false, Viewer: false },
  manage_users: { Admin: true, Engineer: false, Supervisor: false, Operator: false, Viewer: false },
  manage_roles: { Admin: true, Engineer: false, Supervisor: false, Operator: false, Viewer: false },
  system_settings: { Admin: true, Engineer: false, Supervisor: false, Operator: false, Viewer: false },
};

/* ---------- Component ---------- */

export default function RolesPage() {
  const [matrix, setMatrix] = useState(defaultMatrix);
  const [hasChanges, setHasChanges] = useState(false);

  const togglePermission = (permId: string, role: Role) => {
    // Admin always has all permissions
    if (role === 'Admin') return;

    setMatrix((prev) => ({
      ...prev,
      [permId]: {
        ...prev[permId],
        [role]: !prev[permId][role],
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
  };

  // Group permissions by category
  const categories = Array.from(new Set(permissions.map((p) => p.category)));

  // Count permissions per role
  const roleCounts = roles.map((role) => ({
    role,
    count: permissions.filter((p) => matrix[p.id][role]).length,
  }));

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <KeyRound size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Configure role-based access control for all system features
            </p>
          </div>
        </div>
        <Button
          size="sm"
          icon={<Save className="w-4 h-4" />}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {roleCounts.map(({ role, count }) => (
          <div
            key={role}
            className="rounded-lg border border-scada-border bg-scada-panel/75 p-4 flex items-center gap-3"
          >
            <Shield className="w-5 h-5 text-gray-500" />
            <div>
              <Badge variant={roleBadgeVariant[role]}>{role}</Badge>
              <p className="text-xs text-gray-500 mt-1">{count}/{permissions.length} permissions</p>
            </div>
          </div>
        ))}
      </div>

      {/* Permission Matrix */}
      <Card title="Permission Matrix" subtitle="Click cells to toggle permissions" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border bg-scada-dark/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50 min-w-[200px] sticky left-0 bg-scada-dark/90 z-10">
                  Permission
                </th>
                {roles.map((role) => (
                  <th key={role} className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/50 min-w-[100px]">
                    <Badge variant={roleBadgeVariant[role]}>{role}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <React.Fragment key={category}>
                  {/* Category header row */}
                  <tr className="bg-white/3">
                    <td
                      colSpan={roles.length + 1}
                      className="px-4 py-2 text-xs font-bold text-nexaproc-amber uppercase tracking-wider"
                    >
                      {category}
                    </td>
                  </tr>
                  {/* Permission rows */}
                  {permissions
                    .filter((p) => p.category === category)
                    .map((perm) => (
                      <tr
                        key={perm.id}
                        className="border-b border-scada-border/30 hover:bg-nexaproc-green/5 transition-colors"
                      >
                        <td className="px-4 py-2.5 text-white/70 text-xs sticky left-0 bg-scada-panel/90 z-10">
                          {perm.name}
                        </td>
                        {roles.map((role) => {
                          const granted = matrix[perm.id][role];
                          const isAdmin = role === 'Admin';
                          return (
                            <td
                              key={role}
                              className="px-4 py-2.5 text-center"
                            >
                              <button
                                onClick={() => togglePermission(perm.id, role)}
                                disabled={isAdmin}
                                className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                                  granted
                                    ? 'bg-status-running/15 text-status-running hover:bg-status-running/25'
                                    : 'bg-alarm-critical/10 text-alarm-critical/40 hover:bg-alarm-critical/20'
                                } ${isAdmin ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'} mx-auto`}
                              >
                                {granted ? (
                                  <Check className="w-4 h-4" />
                                ) : (
                                  <X className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-6 h-6 rounded bg-status-running/15 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-status-running" />
          </div>
          Granted
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-6 h-6 rounded bg-alarm-critical/10 flex items-center justify-center">
            <X className="w-3.5 h-3.5 text-alarm-critical/40" />
          </div>
          Denied
        </div>
        {hasChanges && (
          <span className="text-xs text-nexaproc-amber">* Unsaved changes</span>
        )}
      </div>
    </div>
  );
}
