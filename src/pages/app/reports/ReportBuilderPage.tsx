import React, { useState } from 'react';
import {
  FilePlus,
  FileText,
  BarChart3,
  AlertTriangle,
  Settings,
  Table2,
  Type,
  GripVertical,
  X,
  Download,
  Save,
  ChevronDown,
  Layout,
  PieChart,
  Activity,
} from 'lucide-react';

import { Card, Button, Input, Select } from '@/components/ui';

/* ---------- Types ---------- */

interface ReportSection {
  id: string;
  type: string;
  label: string;
  icon: React.ReactNode;
}

const availableSections: ReportSection[] = [
  { id: 'header', type: 'header', label: 'Header', icon: <Layout className="w-4 h-4" /> },
  { id: 'kpi', type: 'kpi', label: 'KPI Summary', icon: <PieChart className="w-4 h-4" /> },
  { id: 'trend', type: 'trend', label: 'Trend Chart', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'alarm', type: 'alarm', label: 'Alarm Summary', icon: <AlertTriangle className="w-4 h-4" /> },
  { id: 'equipment', type: 'equipment', label: 'Equipment Status', icon: <Settings className="w-4 h-4" /> },
  { id: 'table', type: 'table', label: 'Table', icon: <Table2 className="w-4 h-4" /> },
  { id: 'text', type: 'text', label: 'Custom Text', icon: <Type className="w-4 h-4" /> },
];

const templates = [
  { value: 'daily-production', label: 'Daily Production' },
  { value: 'shift-handover', label: 'Shift Handover' },
  { value: 'monthly-maintenance', label: 'Monthly Maintenance' },
  { value: 'quality-summary', label: 'Quality Summary' },
  { value: 'energy-report', label: 'Energy Report' },
];

const formats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'word', label: 'Word' },
];

/* ---------- Preview Components ---------- */

function PreviewHeader() {
  return (
    <div className="border-b border-scada-border/50 pb-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">NexaProc Daily Report</h2>
          <p className="text-xs text-gray-500 mt-0.5">Generated: 12 Mar 2026 14:30</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">NexaProc Industrial SCADA</p>
          <p className="text-xs text-gray-600">Plant: Main Facility</p>
        </div>
      </div>
    </div>
  );
}

function PreviewKPI() {
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      {[
        { label: 'Production', value: '847 units', color: '#4ade80' },
        { label: 'OEE', value: '94.2%', color: '#fbbf24' },
        { label: 'Downtime', value: '0.8 hrs', color: '#f97316' },
      ].map((kpi) => (
        <div key={kpi.label} className="rounded bg-white/5 p-3 text-center">
          <p className="text-[10px] text-gray-500 uppercase">{kpi.label}</p>
          <p className="text-sm font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
        </div>
      ))}
    </div>
  );
}

function PreviewTrend() {
  return (
    <div className="rounded bg-white/5 p-3 mb-4">
      <p className="text-xs text-gray-500 mb-2">Temperature Trend (24h)</p>
      <div className="flex items-end gap-0.5 h-16">
        {Array.from({ length: 24 }, (_, i) => {
          const h = 20 + Math.random() * 40;
          return (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{ height: `${h}%`, backgroundColor: h > 50 ? '#f97316' : '#4ade80', opacity: 0.6 }}
            />
          );
        })}
      </div>
    </div>
  );
}

function PreviewAlarm() {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-2">Alarm Summary</p>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Critical', count: 2, color: '#ef4444' },
          { label: 'High', count: 5, color: '#f97316' },
          { label: 'Medium', count: 12, color: '#fbbf24' },
          { label: 'Low', count: 8, color: '#4ade80' },
        ].map((a) => (
          <div key={a.label} className="rounded bg-white/5 p-2">
            <p className="text-lg font-bold" style={{ color: a.color }}>{a.count}</p>
            <p className="text-[10px] text-gray-600">{a.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewEquipment() {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-2">Equipment Status</p>
      <div className="space-y-1">
        {[
          { name: 'Pump P-101', status: 'Running', color: '#4ade80' },
          { name: 'Motor M-201', status: 'Running', color: '#4ade80' },
          { name: 'Compressor C-301', status: 'Maintenance', color: '#3b82f6' },
        ].map((eq) => (
          <div key={eq.name} className="flex items-center justify-between rounded bg-white/5 px-3 py-1.5 text-xs">
            <span className="text-gray-300">{eq.name}</span>
            <span style={{ color: eq.color }}>{eq.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewTable() {
  return (
    <div className="mb-4">
      <p className="text-xs text-gray-500 mb-2">Production Summary</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-scada-border/50">
              <th className="px-2 py-1.5 text-left text-gray-500">Batch</th>
              <th className="px-2 py-1.5 text-left text-gray-500">Product</th>
              <th className="px-2 py-1.5 text-left text-gray-500">Qty</th>
              <th className="px-2 py-1.5 text-left text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { batch: 'B-1201', product: 'Product A', qty: 450, status: 'Complete' },
              { batch: 'B-1202', product: 'Product B', qty: 320, status: 'Complete' },
              { batch: 'B-1203', product: 'Product A', qty: 77, status: 'In Progress' },
            ].map((r) => (
              <tr key={r.batch} className="border-b border-scada-border/30">
                <td className="px-2 py-1.5 text-gray-400 font-mono">{r.batch}</td>
                <td className="px-2 py-1.5 text-gray-400">{r.product}</td>
                <td className="px-2 py-1.5 text-gray-400">{r.qty}</td>
                <td className="px-2 py-1.5 text-gray-400">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreviewText() {
  return (
    <div className="mb-4 rounded bg-white/5 p-3">
      <p className="text-xs text-gray-400 italic">
        Plant operations ran smoothly during the reporting period. No major incidents. Minor
        maintenance scheduled for compressor C-301 during next shift.
      </p>
    </div>
  );
}

const previewComponents: Record<string, React.FC> = {
  header: PreviewHeader,
  kpi: PreviewKPI,
  trend: PreviewTrend,
  alarm: PreviewAlarm,
  equipment: PreviewEquipment,
  table: PreviewTable,
  text: PreviewText,
};

/* ---------- Component ---------- */

export default function ReportBuilderPage() {
  const [addedSections, setAddedSections] = useState<ReportSection[]>([
    availableSections[0], // Header
    availableSections[1], // KPI
    availableSections[2], // Trend
  ]);
  const [title, setTitle] = useState('Daily Production Report');
  const [description, setDescription] = useState('Automated daily production summary');
  const [dateRange, setDateRange] = useState('today');
  const [format, setFormat] = useState('pdf');
  const [template, setTemplate] = useState('daily-production');

  const addSection = (section: ReportSection) => {
    const newSection = { ...section, id: `${section.type}-${Date.now()}` };
    setAddedSections((prev) => [...prev, newSection]);
  };

  const removeSection = (id: string) => {
    setAddedSections((prev) => prev.filter((s) => s.id !== id));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...addedSections];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newSections.length) return;
    [newSections[index], newSections[swapIndex]] = [newSections[swapIndex], newSections[index]];
    setAddedSections(newSections);
  };

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FilePlus size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Report Builder</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Build custom reports with drag-and-drop sections
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={<Save className="w-4 h-4" />}>
            Save Template
          </Button>
          <Button size="sm" icon={<Download className="w-4 h-4" />}>
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Settings */}
      <Card title="Report Settings" subtitle="Configure report parameters">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Select
            label="Template"
            options={templates}
            value={template}
            onChange={setTemplate}
          />
          <Select
            label="Date Range"
            options={[
              { value: 'today', label: 'Today' },
              { value: 'yesterday', label: 'Yesterday' },
              { value: 'last7', label: 'Last 7 Days' },
              { value: 'last30', label: 'Last 30 Days' },
              { value: 'custom', label: 'Custom Range' },
            ]}
            value={dateRange}
            onChange={setDateRange}
          />
          <Select
            label="Format"
            options={formats}
            value={format}
            onChange={setFormat}
          />
        </div>
      </Card>

      {/* Builder Area: Left Panel + Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Available Sections + Added Sections */}
        <div className="space-y-6">
          {/* Available Sections */}
          <Card title="Available Sections" subtitle="Click to add to report">
            <div className="space-y-2">
              {availableSections.map((section) => (
                <button
                  key={section.type}
                  onClick={() => addSection(section)}
                  className="w-full flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5 text-sm text-white/80 hover:bg-nexaproc-green/10 hover:text-white transition-colors text-left"
                >
                  <span className="text-nexaproc-amber">{section.icon}</span>
                  <span className="flex-1">{section.label}</span>
                  <span className="text-xs text-gray-600 hover:text-nexaproc-amber">+ Add</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Report Structure */}
          <Card title="Report Structure" subtitle={`${addedSections.length} sections`}>
            {addedSections.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No sections added yet</p>
            ) : (
              <div className="space-y-1.5">
                {addedSections.map((section, idx) => (
                  <div
                    key={section.id}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm group"
                  >
                    <GripVertical className="w-3.5 h-3.5 text-gray-600" />
                    <span className="text-nexaproc-amber">{section.icon}</span>
                    <span className="flex-1 text-white/80 text-xs">{section.label}</span>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {idx > 0 && (
                        <button
                          onClick={() => moveSection(idx, 'up')}
                          className="p-0.5 text-gray-500 hover:text-white rounded"
                          title="Move up"
                        >
                          <ChevronDown className="w-3 h-3 rotate-180" />
                        </button>
                      )}
                      {idx < addedSections.length - 1 && (
                        <button
                          onClick={() => moveSection(idx, 'down')}
                          className="p-0.5 text-gray-500 hover:text-white rounded"
                          title="Move down"
                        >
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeSection(section.id)}
                        className="p-0.5 text-gray-500 hover:text-alarm-critical rounded"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Panel: Report Preview */}
        <div className="lg:col-span-2">
          <Card title="Report Preview" subtitle="Live preview of report layout">
            <div className="rounded-lg border border-scada-border/50 bg-scada-dark/50 p-6 min-h-[500px]">
              {addedSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FileText className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm">Add sections from the left panel to build your report</p>
                </div>
              ) : (
                addedSections.map((section) => {
                  const Component = previewComponents[section.type];
                  return Component ? <Component key={section.id} /> : null;
                })
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
