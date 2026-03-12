import React, { useState } from 'react';
import {
  CalendarDays,
  Play,
  Pause,
  Plus,
  Download,
  Mail,
  Clock,
  FileText,
  Edit2,
} from 'lucide-react';

import { Card, Badge, Button, Modal, Input, Select } from '@/components/ui';

/* ---------- Mock Data ---------- */

interface ScheduledReport {
  id: string;
  name: string;
  template: string;
  schedule: string;
  frequency: string;
  recipients: string[];
  lastGenerated: string;
  nextRun: string;
  status: 'Active' | 'Paused';
  format: string;
}

const scheduledReports: ScheduledReport[] = [
  {
    id: 'SR1',
    name: 'Daily Production Summary',
    template: 'Daily Production',
    schedule: 'Every day at 06:00',
    frequency: 'Daily',
    recipients: ['ops@nexaproc.com', 'mgr@nexaproc.com'],
    lastGenerated: '12 Mar 06:00',
    nextRun: '13 Mar 06:00',
    status: 'Active',
    format: 'PDF',
  },
  {
    id: 'SR2',
    name: 'Shift A Handover',
    template: 'Shift Handover',
    schedule: 'Every day at 14:00',
    frequency: 'Daily',
    recipients: ['shift-a@nexaproc.com'],
    lastGenerated: '11 Mar 14:00',
    nextRun: '12 Mar 14:00',
    status: 'Active',
    format: 'PDF',
  },
  {
    id: 'SR3',
    name: 'Weekly Energy Report',
    template: 'Energy Report',
    schedule: 'Every Monday at 08:00',
    frequency: 'Weekly',
    recipients: ['energy@nexaproc.com', 'mgr@nexaproc.com'],
    lastGenerated: '10 Mar 08:00',
    nextRun: '17 Mar 08:00',
    status: 'Active',
    format: 'Excel',
  },
  {
    id: 'SR4',
    name: 'Monthly Maintenance Report',
    template: 'Monthly Maintenance',
    schedule: '1st of month at 09:00',
    frequency: 'Monthly',
    recipients: ['maint@nexaproc.com', 'eng@nexaproc.com'],
    lastGenerated: '01 Mar 09:00',
    nextRun: '01 Apr 09:00',
    status: 'Active',
    format: 'PDF',
  },
  {
    id: 'SR5',
    name: 'Quality Summary',
    template: 'Quality Summary',
    schedule: 'Every Friday at 16:00',
    frequency: 'Weekly',
    recipients: ['qa@nexaproc.com'],
    lastGenerated: '07 Mar 16:00',
    nextRun: '14 Mar 16:00',
    status: 'Active',
    format: 'Word',
  },
  {
    id: 'SR6',
    name: 'Weekend Alarm Report',
    template: 'Daily Production',
    schedule: 'Sat & Sun at 18:00',
    frequency: 'Weekly',
    recipients: ['ops@nexaproc.com'],
    lastGenerated: '09 Mar 18:00',
    nextRun: '15 Mar 18:00',
    status: 'Paused',
    format: 'PDF',
  },
  {
    id: 'SR7',
    name: 'Executive Monthly Dashboard',
    template: 'Daily Production',
    schedule: '1st of month at 10:00',
    frequency: 'Monthly',
    recipients: ['ceo@nexaproc.com', 'coo@nexaproc.com'],
    lastGenerated: '01 Mar 10:00',
    nextRun: '01 Apr 10:00',
    status: 'Active',
    format: 'PDF',
  },
  {
    id: 'SR8',
    name: 'Night Shift Summary',
    template: 'Shift Handover',
    schedule: 'Every day at 06:00',
    frequency: 'Daily',
    recipients: ['shift-c@nexaproc.com'],
    lastGenerated: '12 Mar 06:00',
    nextRun: '13 Mar 06:00',
    status: 'Paused',
    format: 'PDF',
  },
];

interface RunHistory {
  date: string;
  status: 'Success' | 'Failed';
  size: string;
}

const runHistories: Record<string, RunHistory[]> = {
  SR1: [
    { date: '12 Mar 06:00', status: 'Success', size: '2.4 MB' },
    { date: '11 Mar 06:00', status: 'Success', size: '2.3 MB' },
    { date: '10 Mar 06:00', status: 'Success', size: '2.5 MB' },
    { date: '09 Mar 06:00', status: 'Failed', size: '-' },
    { date: '08 Mar 06:00', status: 'Success', size: '2.2 MB' },
  ],
};

/* ---------- Component ---------- */

export default function ScheduledReportsPage() {
  const [reports, setReports] = useState(scheduledReports);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formTemplate, setFormTemplate] = useState('daily-production');
  const [formFrequency, setFormFrequency] = useState('daily');
  const [formFormat, setFormFormat] = useState('pdf');
  const [formRecipients, setFormRecipients] = useState('');

  const toggleStatus = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: r.status === 'Active' ? 'Paused' : 'Active' } : r,
      ),
    );
  };

  const activeCount = reports.filter((r) => r.status === 'Active').length;
  const pausedCount = reports.filter((r) => r.status === 'Paused').length;

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Scheduled Reports</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage automated report generation and distribution
            </p>
          </div>
        </div>
        <Button size="sm" icon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>
          Create Schedule
        </Button>
      </div>

      {/* Summary badges */}
      <div className="flex items-center gap-3">
        <Badge variant="success" dot>{activeCount} Active</Badge>
        <Badge variant="neutral">{pausedCount} Paused</Badge>
        <Badge variant="info">{reports.length} Total</Badge>
      </div>

      {/* Scheduled Reports Table */}
      <Card title="Scheduled Reports" subtitle="Auto-generated report schedules" noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border bg-scada-dark/60">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Report Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Template</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Schedule</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Recipients</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Last Generated</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Next Run</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelectedReport(selectedReport === r.id ? null : r.id)}
                  className={`border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors cursor-pointer ${
                    selectedReport === r.id ? 'bg-nexaproc-green/10' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-nexaproc-amber" />
                      <span className="text-white/80 font-medium">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{r.template}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {r.schedule}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.recipients.map((email) => (
                        <span
                          key={email}
                          className="inline-flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-gray-400"
                        >
                          <Mail className="w-2.5 h-2.5" />
                          {email.split('@')[0]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.lastGenerated}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.nextRun}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={r.status === 'Active' ? 'success' : 'neutral'}
                      dot
                      pulse={r.status === 'Active'}
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleStatus(r.id)}
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title={r.status === 'Active' ? 'Pause' : 'Resume'}
                      >
                        {r.status === 'Active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Run History for Selected Report */}
      {selectedReport && (
        <Card
          title={`Run History \u2014 ${reports.find((r) => r.id === selectedReport)?.name}`}
          subtitle="Last 5 generations"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-scada-border text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Size</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Action</th>
                </tr>
              </thead>
              <tbody>
                {(runHistories[selectedReport] || [
                  { date: '12 Mar 06:00', status: 'Success' as const, size: '1.8 MB' },
                  { date: '11 Mar 06:00', status: 'Success' as const, size: '1.7 MB' },
                  { date: '10 Mar 06:00', status: 'Success' as const, size: '1.9 MB' },
                  { date: '09 Mar 06:00', status: 'Success' as const, size: '1.6 MB' },
                  { date: '08 Mar 06:00', status: 'Success' as const, size: '1.8 MB' },
                ]).map((run, idx) => (
                  <tr key={idx} className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{run.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={run.status === 'Success' ? 'success' : 'danger'}>
                        {run.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{run.size}</td>
                    <td className="px-4 py-3">
                      {run.status === 'Success' && (
                        <button className="inline-flex items-center gap-1 text-xs text-nexaproc-amber hover:text-nexaproc-amber/80 transition-colors">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Schedule Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create Scheduled Report"
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => setCreateOpen(false)}>Create Schedule</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Report Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g. Daily Production Summary"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Template"
              options={[
                { value: 'daily-production', label: 'Daily Production' },
                { value: 'shift-handover', label: 'Shift Handover' },
                { value: 'monthly-maintenance', label: 'Monthly Maintenance' },
                { value: 'quality-summary', label: 'Quality Summary' },
                { value: 'energy-report', label: 'Energy Report' },
              ]}
              value={formTemplate}
              onChange={setFormTemplate}
            />
            <Select
              label="Frequency"
              options={[
                { value: 'daily', label: 'Daily' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'monthly', label: 'Monthly' },
              ]}
              value={formFrequency}
              onChange={setFormFrequency}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Format"
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'excel', label: 'Excel' },
                { value: 'word', label: 'Word' },
              ]}
              value={formFormat}
              onChange={setFormFormat}
            />
            <Input
              label="Time"
              type="time"
              value="06:00"
              onChange={() => {}}
            />
          </div>
          <Input
            label="Recipients (comma-separated)"
            value={formRecipients}
            onChange={(e) => setFormRecipients(e.target.value)}
            placeholder="ops@nexaproc.com, mgr@nexaproc.com"
          />
        </div>
      </Modal>
    </div>
  );
}
