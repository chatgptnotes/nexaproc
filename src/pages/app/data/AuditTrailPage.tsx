import React, { useState, useMemo } from 'react';
import { format, subDays, subMinutes } from 'date-fns';
import { ShieldCheck, Printer, Download, AlertTriangle } from 'lucide-react';
import { Card, Button, Input, Badge, Table } from '@/components/ui';

type ActionType =
  | 'Create'
  | 'Modify'
  | 'Delete'
  | 'Approve'
  | 'Reject'
  | 'Login'
  | 'Logout'
  | 'Acknowledge';

interface AuditEntry {
  id: number;
  timestamp: Date;
  user: string;
  action: ActionType;
  resource: string;
  oldValue: string;
  newValue: string;
  reason: string;
  electronicSig: string;
  rowHash: string;
}

const ACTION_BADGE: Record<
  ActionType,
  'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'critical' | 'high' | 'medium'
> = {
  Create: 'success',
  Modify: 'warning',
  Delete: 'danger',
  Approve: 'success',
  Reject: 'critical',
  Login: 'info',
  Logout: 'neutral',
  Acknowledge: 'medium',
};

function mockHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 12; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function generateAuditEntries(): AuditEntry[] {
  const now = new Date();
  const entries: {
    user: string;
    action: ActionType;
    resource: string;
    oldValue: string;
    newValue: string;
    reason: string;
  }[] = [
    { user: 'admin', action: 'Login', resource: 'SCADA-HMI', oldValue: '', newValue: 'Session 4a2f', reason: 'Shift start' },
    { user: 'operator1', action: 'Login', resource: 'SCADA-HMI', oldValue: '', newValue: 'Session 8b1c', reason: 'Shift start' },
    { user: 'operator1', action: 'Modify', resource: 'SP-101 (Reactor Temp SP)', oldValue: '75.0 \u00b0C', newValue: '80.0 \u00b0C', reason: 'Process optimization per SOP-042' },
    { user: 'operator1', action: 'Acknowledge', resource: 'Alarm TT-101 HiHi', oldValue: 'Unacknowledged', newValue: 'Acknowledged', reason: 'Investigated - within control' },
    { user: 'supervisor', action: 'Approve', resource: 'Batch Recipe RCP-001 v3', oldValue: 'Draft', newValue: 'Approved', reason: 'QA review completed' },
    { user: 'engineer', action: 'Modify', resource: 'PID Loop LC-401 Gain', oldValue: '1.2', newValue: '1.5', reason: 'Tuning adjustment per MO-2026-003' },
    { user: 'admin', action: 'Create', resource: 'User account: tech1', oldValue: '', newValue: 'Role: Technician', reason: 'New hire onboarding' },
    { user: 'supervisor', action: 'Reject', resource: 'Batch Recipe RCP-003 v1', oldValue: 'Pending', newValue: 'Rejected', reason: 'Missing temperature ramp specification' },
    { user: 'operator2', action: 'Modify', resource: 'Valve XV-201 Mode', oldValue: 'AUTO', newValue: 'MANUAL', reason: 'Maintenance override per WO-5521' },
    { user: 'engineer', action: 'Modify', resource: 'Alarm TT-101 HiHi Limit', oldValue: '95.0 \u00b0C', newValue: '92.0 \u00b0C', reason: 'Safety review recommendation SR-112' },
    { user: 'operator1', action: 'Modify', resource: 'Pump P-301 Speed SP', oldValue: '60%', newValue: '75%', reason: 'Increased throughput per shift lead' },
    { user: 'admin', action: 'Delete', resource: 'User account: temp_contractor', oldValue: 'Role: Viewer', newValue: '', reason: 'Contract ended' },
    { user: 'supervisor', action: 'Approve', resource: 'Deviation DEV-2026-015', oldValue: 'Under Review', newValue: 'Approved', reason: 'CAPA assigned: CAPA-089' },
    { user: 'operator2', action: 'Login', resource: 'SCADA-HMI', oldValue: '', newValue: 'Session c7d9', reason: 'Shift start' },
    { user: 'operator1', action: 'Logout', resource: 'SCADA-HMI', oldValue: 'Session 8b1c', newValue: '', reason: 'Shift end' },
    { user: 'engineer', action: 'Create', resource: 'Report RPT-Daily-20260312', oldValue: '', newValue: 'Generated', reason: 'Scheduled daily report' },
    { user: 'admin', action: 'Modify', resource: 'System Config: Historian Retention', oldValue: '90 days', newValue: '365 days', reason: 'Compliance requirement update' },
    { user: 'supervisor', action: 'Acknowledge', resource: 'Alarm COMM-01 PLC Failure', oldValue: 'Unacknowledged', newValue: 'Acknowledged', reason: 'IT notified, investigating' },
    { user: 'operator2', action: 'Modify', resource: 'Tank LT-401 Hi Alarm SP', oldValue: '80%', newValue: '85%', reason: 'Approved by supervisor for campaign run' },
    { user: 'engineer', action: 'Approve', resource: 'Calibration Cal-TT101-2026', oldValue: 'Pending', newValue: 'Approved', reason: 'Within tolerance per SOP-015' },
    { user: 'admin', action: 'Modify', resource: 'Role: Operator Permissions', oldValue: 'Read/Write Process', newValue: 'Read/Write Process + Batch', reason: 'Access expansion per mgmt approval' },
    { user: 'operator1', action: 'Login', resource: 'SCADA-HMI', oldValue: '', newValue: 'Session f3a2', reason: 'Shift start' },
    { user: 'supervisor', action: 'Reject', resource: 'Change Request CR-2026-044', oldValue: 'Submitted', newValue: 'Rejected', reason: 'Insufficient impact analysis' },
    { user: 'engineer', action: 'Modify', resource: 'PLC-02 Firmware', oldValue: 'v2.1.0', newValue: 'v2.2.1', reason: 'Security patch per advisory SA-2026-08' },
    { user: 'admin', action: 'Logout', resource: 'SCADA-HMI', oldValue: 'Session 4a2f', newValue: '', reason: 'Shift end' },
  ];

  return entries.map((e, i) => ({
    id: i + 1,
    timestamp: subMinutes(now, (entries.length - i) * 18 + Math.floor(Math.random() * 10)),
    user: e.user,
    action: e.action,
    resource: e.resource,
    oldValue: e.oldValue,
    newValue: e.newValue,
    reason: e.reason,
    electronicSig:
      e.action === 'Login' || e.action === 'Logout'
        ? '\u2014'
        : `${e.user}:${mockHash().slice(0, 8)}`,
    rowHash: mockHash(),
  }));
}

export default function AuditTrailPage() {
  const [entries] = useState<AuditEntry[]>(generateAuditEntries);
  const [userFilter, setUserFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const users = useMemo(() => {
    const set = new Set(entries.map((e) => e.user));
    return ['All', ...Array.from(set).sort()];
  }, [entries]);

  const actions: string[] = [
    'All',
    'Create',
    'Modify',
    'Delete',
    'Approve',
    'Reject',
    'Login',
    'Logout',
    'Acknowledge',
  ];

  const filteredEntries = useMemo(() => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return entries.filter((e) => {
      if (userFilter !== 'All' && e.user !== userFilter) return false;
      if (actionFilter !== 'All' && e.action !== actionFilter) return false;
      if (e.timestamp < start || e.timestamp > end) return false;
      return true;
    });
  }, [entries, userFilter, actionFilter, startDate, endDate]);

  const handleExport = () => {
    const headers = [
      'Timestamp',
      'User',
      'Action',
      'Resource',
      'Old Value',
      'New Value',
      'Reason',
      'E-Signature',
      'Hash',
    ];
    const rows = filteredEntries.map((e) => [
      format(e.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      e.user,
      e.action,
      `"${e.resource}"`,
      `"${e.oldValue}"`,
      `"${e.newValue}"`,
      `"${e.reason}"`,
      e.electronicSig,
      e.rowHash,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_trail_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      width: '160px',
      render: (row: AuditEntry) => (
        <span className="font-mono text-xs text-white/70">
          {format(row.timestamp, 'yyyy-MM-dd HH:mm:ss')}
        </span>
      ),
    },
    { key: 'user', header: 'User', sortable: true, width: '100px' },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      width: '110px',
      render: (row: AuditEntry) => (
        <Badge variant={ACTION_BADGE[row.action]} dot>
          {row.action}
        </Badge>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      sortable: true,
      render: (row: AuditEntry) => (
        <span className="text-xs text-white/80">{row.resource}</span>
      ),
    },
    {
      key: 'oldValue',
      header: 'Old Value',
      width: '120px',
      render: (row: AuditEntry) => (
        <span className="font-mono text-xs text-red-400/80">
          {row.oldValue || '\u2014'}
        </span>
      ),
    },
    {
      key: 'newValue',
      header: 'New Value',
      width: '120px',
      render: (row: AuditEntry) => (
        <span className="font-mono text-xs text-green-400/80">
          {row.newValue || '\u2014'}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row: AuditEntry) => (
        <span className="text-xs text-white/60">{row.reason}</span>
      ),
    },
    {
      key: 'electronicSig',
      header: 'E-Signature',
      width: '140px',
      render: (row: AuditEntry) => (
        <span className="font-mono text-xs text-cyan-400/70">
          {row.electronicSig}
        </span>
      ),
    },
    {
      key: 'rowHash',
      header: 'Hash',
      width: '120px',
      render: (row: AuditEntry) => (
        <span
          className="font-mono text-xs text-white/40"
          title={`SHA-256: ${row.rowHash}...`}
        >
          {row.rowHash}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-nexaproc-amber" />
            Audit Trail
          </h1>
          <p className="mt-1 text-sm text-white/50">
            FDA 21 CFR Part 11 compliant records
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            icon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Report
          </Button>
          <Button
            icon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Compliance Warning */}
      <div className="flex items-start gap-3 rounded-lg border border-nexaproc-amber/30 bg-nexaproc-amber/5 px-4 py-3">
        <AlertTriangle className="w-5 h-5 text-nexaproc-amber flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-nexaproc-amber">
            Regulatory Compliance Notice
          </p>
          <p className="text-xs text-white/60 mt-0.5">
            This audit trail is maintained per FDA 21 CFR Part 11 requirements.
            All records are tamper-evident with cryptographic hashes. Electronic
            signatures are captured for all critical actions.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card
        title="Filters"
        headerAction={
          <span className="text-xs text-white/40">
            {filteredEntries.length} records
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* User Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
              User
            </label>
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-scada-border bg-scada-panel px-3 py-2 text-sm text-white outline-none transition-colors hover:border-scada-border-hover focus:border-nexaproc-amber/50"
            >
              {users.map((u) => (
                <option key={u} value={u} className="bg-scada-panel text-white">
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Action Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Action Type
            </label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full appearance-none rounded-lg border border-scada-border bg-scada-panel px-3 py-2 text-sm text-white outline-none transition-colors hover:border-scada-border-hover focus:border-nexaproc-amber/50"
            >
              {actions.map((a) => (
                <option key={a} value={a} className="bg-scada-panel text-white">
                  {a}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </Card>

      {/* Audit Trail Table */}
      <Table<AuditEntry>
        columns={columns}
        data={filteredEntries}
        emptyMessage="No audit entries match the current filters"
      />
    </div>
  );
}
