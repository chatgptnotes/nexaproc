import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { format, subDays, subMinutes } from 'date-fns';
import { Download, RefreshCw, ScrollText } from 'lucide-react';
import { Card, Button, Input, Badge, Table } from '@/components/ui';

type EventType = 'System' | 'Process' | 'Operator' | 'Security' | 'Communication';
type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

interface EventEntry {
  id: number;
  timestamp: Date;
  source: string;
  eventType: EventType;
  description: string;
  user: string;
  severity: Severity;
}

const EVENT_TYPE_BADGE: Record<EventType, 'info' | 'success' | 'warning' | 'danger' | 'neutral'> = {
  System: 'info',
  Process: 'success',
  Operator: 'warning',
  Security: 'danger',
  Communication: 'neutral',
};

const SEVERITY_BADGE: Record<Severity, 'critical' | 'high' | 'medium' | 'low' | 'info'> = {
  Critical: 'critical',
  High: 'high',
  Medium: 'medium',
  Low: 'low',
  Info: 'info',
};

function generateMockEvents(): EventEntry[] {
  const templates: { type: EventType; severity: Severity; desc: string; source: string; user: string }[] = [
    { type: 'Security', severity: 'Info', desc: 'User admin logged in', source: 'AuthService', user: 'admin' },
    { type: 'Security', severity: 'Info', desc: 'User operator1 logged in', source: 'AuthService', user: 'operator1' },
    { type: 'Security', severity: 'Medium', desc: 'Failed login attempt for user admin', source: 'AuthService', user: 'SYSTEM' },
    { type: 'Security', severity: 'Info', desc: 'User operator2 logged out', source: 'AuthService', user: 'operator2' },
    { type: 'Security', severity: 'High', desc: 'Password changed for user engineer', source: 'AuthService', user: 'engineer' },
    { type: 'Process', severity: 'Info', desc: 'Tag TT-101 value changed from 72.3 to 75.1', source: 'PLC-01', user: 'SYSTEM' },
    { type: 'Process', severity: 'Info', desc: 'Tag PT-201 value changed from 4.2 to 4.8', source: 'PLC-01', user: 'SYSTEM' },
    { type: 'Process', severity: 'Medium', desc: 'Tag FT-301 exceeded high limit (250 L/min)', source: 'PLC-02', user: 'SYSTEM' },
    { type: 'Process', severity: 'High', desc: 'Reactor temperature approaching critical threshold', source: 'PLC-01', user: 'SYSTEM' },
    { type: 'Process', severity: 'Info', desc: 'Batch B-001 started', source: 'BatchEngine', user: 'operator1' },
    { type: 'Process', severity: 'Info', desc: 'Batch B-001 phase 2 (Heating) initiated', source: 'BatchEngine', user: 'SYSTEM' },
    { type: 'Process', severity: 'Info', desc: 'Batch B-001 completed successfully', source: 'BatchEngine', user: 'SYSTEM' },
    { type: 'Communication', severity: 'Critical', desc: 'PLC-01 communication lost', source: 'PLC-01', user: 'SYSTEM' },
    { type: 'Communication', severity: 'Info', desc: 'PLC-01 communication restored', source: 'PLC-01', user: 'SYSTEM' },
    { type: 'Communication', severity: 'High', desc: 'OPC-UA Server connection timeout', source: 'OPC-Server', user: 'SYSTEM' },
    { type: 'Communication', severity: 'Info', desc: 'MQTT Broker reconnected', source: 'MQTTBroker', user: 'SYSTEM' },
    { type: 'Communication', severity: 'Medium', desc: 'PLC-02 high latency detected (>500ms)', source: 'PLC-02', user: 'SYSTEM' },
    { type: 'System', severity: 'Info', desc: 'Historian database backup completed', source: 'Historian', user: 'SYSTEM' },
    { type: 'System', severity: 'Medium', desc: 'Disk usage exceeded 80% on SCADA server', source: 'SCADA-HMI', user: 'SYSTEM' },
    { type: 'System', severity: 'Info', desc: 'SCADA application started', source: 'SCADA-HMI', user: 'SYSTEM' },
    { type: 'System', severity: 'Low', desc: 'Scheduled report generated', source: 'Historian', user: 'SYSTEM' },
    { type: 'System', severity: 'Info', desc: 'Configuration snapshot saved', source: 'SCADA-HMI', user: 'supervisor' },
    { type: 'Operator', severity: 'Info', desc: 'Setpoint SP-101 changed from 75.0 to 80.0', source: 'SCADA-HMI', user: 'operator1' },
    { type: 'Operator', severity: 'Info', desc: 'Valve XV-201 manually opened', source: 'SCADA-HMI', user: 'operator2' },
    { type: 'Operator', severity: 'Medium', desc: 'Alarm TT-101 HiHi acknowledged', source: 'SCADA-HMI', user: 'operator1' },
    { type: 'Operator', severity: 'Info', desc: 'Pump P-301 started manually', source: 'SCADA-HMI', user: 'supervisor' },
    { type: 'Operator', severity: 'Info', desc: 'Mode changed to AUTO for Loop LC-401', source: 'SCADA-HMI', user: 'operator1' },
    { type: 'Operator', severity: 'High', desc: 'Emergency stop triggered by operator', source: 'SCADA-HMI', user: 'operator2' },
    { type: 'System', severity: 'Critical', desc: 'UPS battery low - switching to generator', source: 'SCADA-HMI', user: 'SYSTEM' },
    { type: 'Process', severity: 'Low', desc: 'Tank LT-401 level stabilized at 65%', source: 'PLC-02', user: 'SYSTEM' },
  ];

  const now = new Date();
  return templates.map((t, i) => ({
    id: i + 1,
    timestamp: subMinutes(now, i * 12 + Math.floor(Math.random() * 10)),
    source: t.source,
    eventType: t.type,
    description: t.desc,
    user: t.user,
    severity: t.severity,
  }));
}

export default function EventLogPage() {
  const [events] = useState<EventEntry[]>(generateMockEvents);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 7), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const handleRefresh = useCallback(() => {
    setRefreshCounter((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(handleRefresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, handleRefresh]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      if (typeFilter !== 'All' && e.eventType !== typeFilter) return false;
      if (severityFilter !== 'All' && e.severity !== severityFilter) return false;
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      if (e.timestamp < start || e.timestamp > end) return false;
      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, typeFilter, severityFilter, startDate, endDate, refreshCounter]);

  const columns = [
    {
      key: 'timestamp',
      header: 'Timestamp',
      sortable: true,
      width: '180px',
      render: (row: EventEntry) => (
        <span className="font-mono text-xs text-white/70">
          {format(row.timestamp, 'yyyy-MM-dd HH:mm:ss')}
        </span>
      ),
    },
    { key: 'source', header: 'Source', sortable: true, width: '120px' },
    {
      key: 'eventType',
      header: 'Event Type',
      sortable: true,
      width: '130px',
      render: (row: EventEntry) => (
        <Badge variant={EVENT_TYPE_BADGE[row.eventType]} dot>
          {row.eventType}
        </Badge>
      ),
    },
    { key: 'description', header: 'Description', sortable: false },
    { key: 'user', header: 'User', sortable: true, width: '100px' },
    {
      key: 'severity',
      header: 'Severity',
      sortable: true,
      width: '100px',
      render: (row: EventEntry) => (
        <Badge variant={SEVERITY_BADGE[row.severity]}>
          {row.severity}
        </Badge>
      ),
    },
  ];

  const handleExport = () => {
    const headers = ['Timestamp', 'Source', 'Event Type', 'Description', 'User', 'Severity'];
    const rows = filteredEvents.map((e) => [
      format(e.timestamp, 'yyyy-MM-dd HH:mm:ss'),
      e.source,
      e.eventType,
      `"${e.description}"`,
      e.user,
      e.severity,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event_log_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const eventTypes: string[] = ['All', 'System', 'Process', 'Operator', 'Security', 'Communication'];
  const severities: string[] = ['All', 'Critical', 'High', 'Medium', 'Low', 'Info'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ScrollText className="w-7 h-7 text-nexaproc-amber" />
            Event Log
          </h1>
          <p className="mt-1 text-sm text-white/50">
            System and process event history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-nexaproc-amber w-3.5 h-3.5"
            />
            <span className="text-sm text-white/60">Auto-refresh</span>
            {autoRefresh && (
              <RefreshCw className="w-3.5 h-3.5 text-nexaproc-amber animate-spin" />
            )}
          </label>
          <Button
            variant="secondary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card title="Filters" headerAction={
        <span className="text-xs text-white/40">{filteredEvents.length} events</span>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Event Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {eventTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    typeFilter === t
                      ? 'bg-nexaproc-amber/20 text-nexaproc-amber border-nexaproc-amber/40'
                      : 'bg-scada-dark/40 text-white/50 border-scada-border hover:border-scada-border-hover hover:text-white/70'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Severity Filter */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Severity
            </label>
            <div className="flex flex-wrap gap-1.5">
              {severities.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverityFilter(s)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                    severityFilter === s
                      ? 'bg-nexaproc-amber/20 text-nexaproc-amber border-nexaproc-amber/40'
                      : 'bg-scada-dark/40 text-white/50 border-scada-border hover:border-scada-border-hover hover:text-white/70'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
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

      {/* Events Table */}
      <Table<EventEntry>
        columns={columns}
        data={filteredEvents}
        emptyMessage="No events match the current filters"
      />
    </div>
  );
}
