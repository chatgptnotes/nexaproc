import React, { useState } from 'react';
import {
  BadgeCheck,
  Shield,
  Calendar,
  Tag,
  Building2,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

import { Card, Badge, Button } from '@/components/ui';
import { GaugeWidget } from '@/components/scada';

/* ---------- Mock Data ---------- */

interface ModuleLicense {
  name: string;
  licensed: boolean;
  expiry: string;
  status: 'Active' | 'Expired' | 'Not Licensed';
}

const modules: ModuleLicense[] = [
  { name: 'Base SCADA', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'Batch Control', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'OEE', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'SPC', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'Predictive Maintenance', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'Report Builder', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'Mobile Access', licensed: true, expiry: '31 Dec 2027', status: 'Active' },
  { name: 'AI/ML Suite', licensed: true, expiry: '31 Dec 2026', status: 'Active' },
  { name: 'Energy Analytics', licensed: true, expiry: '31 Dec 2026', status: 'Active' },
  { name: 'Audit Trail', licensed: false, expiry: '-', status: 'Not Licensed' },
];

interface LicenseHistory {
  date: string;
  event: string;
  type: 'Activation' | 'Renewal' | 'Upgrade' | 'Module Add';
  details: string;
}

const licenseHistory: LicenseHistory[] = [
  { date: '01 Jan 2026', event: 'License Renewal', type: 'Renewal', details: 'Enterprise license renewed for 2 years' },
  { date: '15 Nov 2025', event: 'Module Added', type: 'Module Add', details: 'AI/ML Suite module activated' },
  { date: '15 Nov 2025', event: 'Module Added', type: 'Module Add', details: 'Energy Analytics module activated' },
  { date: '01 Jul 2025', event: 'Tag Upgrade', type: 'Upgrade', details: 'Tag count upgraded from 5,000 to 10,000' },
  { date: '01 Jan 2025', event: 'Initial Activation', type: 'Activation', details: 'Enterprise license activated with 8 modules' },
];

const historyBadge: Record<string, 'success' | 'info' | 'warning'> = {
  Activation: 'success',
  Renewal: 'info',
  Upgrade: 'warning',
  'Module Add': 'success',
};

/* ---------- Component ---------- */

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BadgeCheck size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">License Management</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              View and manage your NexaProc SCADA licenses
            </p>
          </div>
        </div>
        <Button size="sm" icon={<ArrowUpRight className="w-4 h-4" />}>
          Request License Upgrade
        </Button>
      </div>

      {/* Current License Card + Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* License Details */}
        <div className="lg:col-span-2">
          <Card title="Current License" subtitle="Enterprise Edition">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">License Type</span>
                </div>
                <p className="text-lg font-bold text-white">Enterprise</p>
                <Badge variant="success" dot pulse>Active</Badge>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Expiry Date</span>
                </div>
                <p className="text-lg font-bold text-white">31 Dec 2027</p>
                <span className="text-xs text-gray-500">657 days remaining</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Tags Licensed</span>
                </div>
                <p className="text-lg font-bold text-white">10,000</p>
                <span className="text-xs text-gray-500">2,847 used (28.5%)</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Tags In Use</span>
                </div>
                <p className="text-lg font-bold text-nexaproc-amber">2,847</p>
                <div className="w-full h-1.5 rounded-full bg-white/10 mt-1">
                  <div className="h-1.5 rounded-full bg-nexaproc-amber" style={{ width: '28.5%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Plants Licensed</span>
                </div>
                <p className="text-lg font-bold text-white">5</p>
                <span className="text-xs text-gray-500">3 active</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs uppercase tracking-wider">Plants Active</span>
                </div>
                <p className="text-lg font-bold text-status-running">3</p>
                <div className="w-full h-1.5 rounded-full bg-white/10 mt-1">
                  <div className="h-1.5 rounded-full bg-status-running" style={{ width: '60%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* License Gauge */}
        <div>
          <Card title="Tag Utilization" subtitle="Percentage of licensed tags in use">
            <div className="flex items-center justify-center">
              <GaugeWidget
                value={28.5}
                min={0}
                max={100}
                unit="%"
                label="Tag Utilization"
                thresholds={{ high: 80, hihi: 95 }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Module Licenses Table */}
      <Card title="Module Licenses" subtitle="Licensed feature modules" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border bg-scada-dark/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Module</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Licensed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Expiry</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Status</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) => (
                <tr
                  key={mod.name}
                  className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                >
                  <td className="px-4 py-3 text-white/80 font-medium">{mod.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant={mod.licensed ? 'success' : 'neutral'}>
                      {mod.licensed ? 'Yes' : 'No'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{mod.expiry}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        mod.status === 'Active' ? 'success' :
                        mod.status === 'Expired' ? 'danger' : 'neutral'
                      }
                      dot={mod.status === 'Active'}
                      pulse={mod.status === 'Active'}
                    >
                      {mod.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom: License History + Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* License History */}
        <div className="lg:col-span-2">
          <Card title="License History" subtitle="Activations, renewals, and changes">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-scada-border text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Event</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Type</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {licenseHistory.map((entry, idx) => (
                    <tr key={idx} className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors">
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">{entry.date}</td>
                      <td className="px-4 py-3 text-white/80 font-medium">{entry.event}</td>
                      <td className="px-4 py-3">
                        <Badge variant={historyBadge[entry.type] || 'neutral'}>{entry.type}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{entry.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Support Contact */}
        <div>
          <Card title="Support Contact" subtitle="License and technical support">
            <div className="space-y-4">
              <div className="rounded-lg bg-white/5 p-4 space-y-3">
                <h4 className="text-sm font-bold text-white">NexaProc Support</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Phone className="w-3.5 h-3.5 text-nexaproc-amber" />
                    +91 1800-123-4567
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Mail className="w-3.5 h-3.5 text-nexaproc-amber" />
                    support@nexaproc.com
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <ExternalLink className="w-3.5 h-3.5 text-nexaproc-amber" />
                    portal.nexaproc.com/support
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5 text-nexaproc-amber" />
                    24/7 Enterprise Support
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-white/5 p-4 space-y-2">
                <h4 className="text-sm font-bold text-white">License ID</h4>
                <p className="text-xs text-gray-400 font-mono break-all">
                  NXP-ENT-2025-A4F8-B2C1-D9E3
                </p>
              </div>

              <div className="rounded-lg bg-white/5 p-4 space-y-2">
                <h4 className="text-sm font-bold text-white">Account Manager</h4>
                <p className="text-xs text-gray-400">Deepak Verma</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail className="w-3 h-3 text-nexaproc-amber" />
                  deepak.verma@nexaproc.com
                </div>
              </div>

              <Button variant="secondary" className="w-full" size="sm" icon={<ArrowUpRight className="w-4 h-4" />}>
                Request License Upgrade
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
