import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import KPICard from '@/components/scada/KPICard';

// ── Types ───────────────────────────────────────────────────────────────────
type GateStatus = 'Pass' | 'Fail' | 'Pending' | 'Bypassed';

interface QualityGate {
  id: number;
  name: string;
  status: GateStatus;
  passRate: number;
  inspector: string;
  timestamp: string;
}

interface BatchGateResult {
  batchId: string;
  product: string;
  gate1: GateStatus;
  gate2: GateStatus;
  gate3: GateStatus;
  gate4: GateStatus;
  gate5: GateStatus;
  overallStatus: 'Pass' | 'Fail' | 'In Progress';
}

// ── Current Batch Gates (pipeline) ──────────────────────────────────────────
const currentBatchId = 'B-2026-015';
const currentGateIndex = 2; // Gate 3 is current (0-indexed)

const qualityGates: QualityGate[] = [
  { id: 1, name: 'Raw Material Inspection', status: 'Pass', passRate: 99.2, inspector: 'M. Thompson', timestamp: '2026-03-12 06:15' },
  { id: 2, name: 'In-Process Check', status: 'Pass', passRate: 97.8, inspector: 'S. Chen', timestamp: '2026-03-12 08:42' },
  { id: 3, name: 'Pre-Final Testing', status: 'Pending', passRate: 95.4, inspector: 'K. Nakamura', timestamp: '—' },
  { id: 4, name: 'Final Quality Assurance', status: 'Pending', passRate: 96.1, inspector: '—', timestamp: '—' },
  { id: 5, name: 'Release Approval', status: 'Pending', passRate: 98.5, inspector: '—', timestamp: '—' },
];

// ── Recent Batch Gate Results ───────────────────────────────────────────────
const recentBatchResults: BatchGateResult[] = [
  { batchId: 'B-2026-014', product: 'Polyethylene Resin A', gate1: 'Pass', gate2: 'Pass', gate3: 'Pass', gate4: 'Pass', gate5: 'Pass', overallStatus: 'Pass' },
  { batchId: 'B-2026-013', product: 'Catalyst Blend C-12', gate1: 'Pass', gate2: 'Pass', gate3: 'Fail', gate4: 'Pending', gate5: 'Pending', overallStatus: 'Fail' },
  { batchId: 'B-2026-012', product: 'Solvent Recovery D', gate1: 'Pass', gate2: 'Pass', gate3: 'Pass', gate4: 'Pass', gate5: 'Pass', overallStatus: 'Pass' },
  { batchId: 'B-2026-011', product: 'Emulsion Polymer E-1', gate1: 'Pass', gate2: 'Bypassed', gate3: 'Pass', gate4: 'Pass', gate5: 'Pass', overallStatus: 'Pass' },
  { batchId: 'B-2026-010', product: 'Additive Compound F-3', gate1: 'Pass', gate2: 'Pass', gate3: 'Pass', gate4: 'Fail', gate5: 'Pending', overallStatus: 'Fail' },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
const gateStatusConfig: Record<GateStatus, { icon: LucideIcon; color: string; bgColor: string; borderColor: string; badge: 'success' | 'danger' | 'warning' | 'neutral' }> = {
  Pass: { icon: CheckCircle2, color: 'text-status-running', bgColor: 'bg-status-running/15', borderColor: 'border-status-running/40', badge: 'success' },
  Fail: { icon: XCircle, color: 'text-status-fault', bgColor: 'bg-status-fault/15', borderColor: 'border-status-fault/40', badge: 'danger' },
  Pending: { icon: Clock, color: 'text-white/40', bgColor: 'bg-white/5', borderColor: 'border-white/15', badge: 'neutral' },
  Bypassed: { icon: Ban, color: 'text-status-warning', bgColor: 'bg-status-warning/15', borderColor: 'border-status-warning/40', badge: 'warning' },
};

function GateStatusBadge({ status }: { status: GateStatus }) {
  const cfg = gateStatusConfig[status];
  return <Badge variant={cfg.badge} dot>{status}</Badge>;
}

function OverallBadge({ status }: { status: BatchGateResult['overallStatus'] }) {
  const v = status === 'Pass' ? 'success' : status === 'Fail' ? 'danger' : 'warning';
  return <Badge variant={v} dot>{status}</Badge>;
}

// ── Table Columns ───────────────────────────────────────────────────────────
const batchGateColumns = [
  { key: 'batchId', header: 'Batch ID', sortable: true, render: (r: BatchGateResult) => <span className="font-mono text-nexaproc-amber">{r.batchId}</span> },
  { key: 'product', header: 'Product', sortable: true },
  { key: 'gate1', header: 'Gate 1', render: (r: BatchGateResult) => <GateStatusBadge status={r.gate1} /> },
  { key: 'gate2', header: 'Gate 2', render: (r: BatchGateResult) => <GateStatusBadge status={r.gate2} /> },
  { key: 'gate3', header: 'Gate 3', render: (r: BatchGateResult) => <GateStatusBadge status={r.gate3} /> },
  { key: 'gate4', header: 'Gate 4', render: (r: BatchGateResult) => <GateStatusBadge status={r.gate4} /> },
  { key: 'gate5', header: 'Gate 5', render: (r: BatchGateResult) => <GateStatusBadge status={r.gate5} /> },
  { key: 'overallStatus', header: 'Overall', render: (r: BatchGateResult) => <OverallBadge status={r.overallStatus} /> },
];

export default function QualityGatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CheckSquare size={24} className="text-nexaproc-amber" />
        <h1 className="text-2xl font-bold text-white">Quality Gates</h1>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="First Pass Yield"
          value="96.4"
          unit="%"
          trend="up"
          trendValue={1.2}
          icon={<ShieldCheck size={22} />}
          color="#4ade80"
        />
        <KPICard
          title="Rejection Rate"
          value="1.8"
          unit="%"
          trend="down"
          trendValue={0.3}
          icon={<XCircle size={22} />}
          color="#ef4444"
        />
        <KPICard
          title="Deviation Count"
          value="3"
          unit="open"
          trend="down"
          trendValue={2.0}
          icon={<AlertTriangle size={22} />}
          color="#fbbf24"
        />
      </div>

      {/* Quality Gate Pipeline — Current Batch */}
      <Card
        title={`Quality Gate Pipeline — Batch ${currentBatchId}`}
        subtitle="Current batch progress through quality gates"
      >
        {/* Pipeline visual */}
        <div className="flex items-center justify-between relative px-4 py-6">
          {/* Connector line */}
          <div className="absolute top-1/2 left-[60px] right-[60px] h-0.5 bg-scada-border -translate-y-1/2 z-0" />

          {qualityGates.map((gate, i) => {
            const cfg = gateStatusConfig[gate.status];
            const Icon = cfg.icon;
            const isCurrent = i === currentGateIndex;

            return (
              <div key={gate.id} className="relative z-10 flex flex-col items-center" style={{ flex: 1 }}>
                {/* Gate circle */}
                <div
                  className={clsx(
                    'w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all',
                    cfg.bgColor,
                    cfg.borderColor,
                    isCurrent && 'ring-2 ring-nexaproc-amber/50 ring-offset-2 ring-offset-scada-dark',
                  )}
                >
                  <Icon size={24} className={cfg.color} />
                </div>

                {/* Gate info */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p className={clsx('text-[11px] font-bold', isCurrent ? 'text-nexaproc-amber' : 'text-white/70')}>
                    Gate {gate.id}
                  </p>
                  <p className="text-[10px] text-white/40 leading-tight mt-0.5">{gate.name}</p>
                  <p className={clsx('text-[10px] font-mono mt-1', cfg.color)}>
                    {gate.passRate}% pass rate
                  </p>
                </div>

                {/* Inspector + timestamp (below, only for completed/current) */}
                {gate.status !== 'Pending' && (
                  <div className="mt-2 text-center">
                    <p className="text-[10px] text-white/30">{gate.inspector}</p>
                    <p className="text-[9px] text-white/20 font-mono">{gate.timestamp}</p>
                  </div>
                )}

                {/* Current indicator */}
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="text-[9px] font-bold text-nexaproc-amber bg-nexaproc-amber/10 border border-nexaproc-amber/30 rounded-full px-2 py-0.5 whitespace-nowrap">
                      CURRENT
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Gate Detail Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {qualityGates.map((gate) => {
          const cfg = gateStatusConfig[gate.status];
          const Icon = cfg.icon;
          return (
            <div
              key={gate.id}
              className={clsx(
                'rounded-lg border p-4 transition-all',
                cfg.borderColor,
                cfg.bgColor,
              )}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} className={cfg.color} />
                <span className="text-xs font-bold text-white">Gate {gate.id}</span>
              </div>
              <p className="text-[11px] text-white/60 mb-2">{gate.name}</p>
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Status</span>
                  <GateStatusBadge status={gate.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Pass Rate</span>
                  <span className="font-mono text-white/70">{gate.passRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Inspector</span>
                  <span className="text-white/50">{gate.inspector}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Timestamp</span>
                  <span className="font-mono text-white/40">{gate.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Batch Gate Results */}
      <Card title="Recent Batch Gate Results" subtitle="Last 5 batches processed through quality gates">
        <Table columns={batchGateColumns} data={recentBatchResults} />
      </Card>
    </div>
  );
}
