import React, { useState, useMemo } from 'react';
import { format, subDays, subHours } from 'date-fns';
import {
  Download,
  FileSpreadsheet,
  FileText,
  FileDown,
  Check,
  Clock,
  Database,
} from 'lucide-react';
import { Card, Button, Input, Badge, Table } from '@/components/ui';

type DataSource = 'Tags' | 'Alarms' | 'Events' | 'Equipment' | 'Batch Records';
type ExportFormat = 'CSV' | 'Excel' | 'PDF';

interface PreviewRow {
  [key: string]: string | number;
}

interface ExportHistoryEntry {
  id: number;
  timestamp: Date;
  source: DataSource;
  format: ExportFormat;
  rows: number;
  fileSize: string;
  status: 'Completed' | 'Pending';
}

const SOURCES: DataSource[] = ['Tags', 'Alarms', 'Events', 'Equipment', 'Batch Records'];

const SOURCE_ITEMS: Record<DataSource, { id: string; label: string }[]> = {
  Tags: [
    { id: 'TT-101', label: 'TT-101 Reactor Temp' },
    { id: 'PT-201', label: 'PT-201 Header Pressure' },
    { id: 'FT-301', label: 'FT-301 Feed Flow' },
    { id: 'LT-401', label: 'LT-401 Tank Level' },
    { id: 'AT-501', label: 'AT-501 pH Analyzer' },
    { id: 'TT-102', label: 'TT-102 Coolant Temp' },
    { id: 'PT-202', label: 'PT-202 Discharge Pressure' },
    { id: 'FT-302', label: 'FT-302 Recycle Flow' },
  ],
  Alarms: [
    { id: 'ALM-TT101-HH', label: 'TT-101 HiHi Alarm' },
    { id: 'ALM-TT101-H', label: 'TT-101 Hi Alarm' },
    { id: 'ALM-PT201-H', label: 'PT-201 Hi Alarm' },
    { id: 'ALM-LT401-HH', label: 'LT-401 HiHi Alarm' },
    { id: 'ALM-LT401-L', label: 'LT-401 Lo Alarm' },
    { id: 'ALM-COMM01', label: 'PLC-01 Comm Failure' },
  ],
  Events: [
    { id: 'EVT-SYS', label: 'System Events' },
    { id: 'EVT-PROC', label: 'Process Events' },
    { id: 'EVT-OP', label: 'Operator Events' },
    { id: 'EVT-SEC', label: 'Security Events' },
    { id: 'EVT-COMM', label: 'Communication Events' },
  ],
  Equipment: [
    { id: 'EQ-R101', label: 'Reactor R-101' },
    { id: 'EQ-P301', label: 'Pump P-301' },
    { id: 'EQ-V201', label: 'Valve XV-201' },
    { id: 'EQ-T401', label: 'Tank T-401' },
    { id: 'EQ-HX501', label: 'Heat Exchanger HX-501' },
  ],
  'Batch Records': [
    { id: 'BATCH-001', label: 'Batch B-001 (Product A)' },
    { id: 'BATCH-002', label: 'Batch B-002 (Product A)' },
    { id: 'BATCH-003', label: 'Batch B-003 (Product B)' },
    { id: 'BATCH-004', label: 'Batch B-004 (Product B)' },
  ],
};

function generatePreview(source: DataSource, items: string[]): PreviewRow[] {
  const rows: PreviewRow[] = [];
  const now = new Date();

  if (source === 'Tags') {
    for (let i = 0; i < 10; i++) {
      const row: PreviewRow = {
        '#': i + 1,
        Timestamp: format(subHours(now, i), 'yyyy-MM-dd HH:mm:ss'),
      };
      items.forEach((tag) => {
        row[tag] = Math.round((Math.random() * 100 + 20) * 100) / 100;
      });
      rows.push(row);
    }
  } else if (source === 'Alarms') {
    const priorities = ['Critical', 'High', 'Medium', 'Low'];
    for (let i = 0; i < 10; i++) {
      rows.push({
        '#': i + 1,
        Timestamp: format(subHours(now, i * 2), 'yyyy-MM-dd HH:mm:ss'),
        Alarm: items[i % items.length] || 'N/A',
        Priority: priorities[i % priorities.length],
        Duration: `${Math.floor(Math.random() * 60 + 1)} min`,
        Status: i % 3 === 0 ? 'Active' : 'Cleared',
      });
    }
  } else if (source === 'Events') {
    const types = ['System', 'Process', 'Operator', 'Security'];
    for (let i = 0; i < 10; i++) {
      rows.push({
        '#': i + 1,
        Timestamp: format(subHours(now, i), 'yyyy-MM-dd HH:mm:ss'),
        Type: types[i % types.length],
        Source: ['PLC-01', 'SCADA-HMI', 'BatchEngine', 'AuthService'][i % 4],
        Description: `Event entry ${i + 1} for ${items[i % items.length] || 'system'}`,
      });
    }
  } else if (source === 'Equipment') {
    const statuses = ['Running', 'Stopped', 'Maintenance', 'Fault'];
    for (let i = 0; i < Math.min(10, items.length); i++) {
      rows.push({
        '#': i + 1,
        Equipment: items[i],
        Status: statuses[i % statuses.length],
        Runtime: `${Math.floor(Math.random() * 8000 + 1000)} hrs`,
        'Last Maintenance': format(
          subDays(now, Math.floor(Math.random() * 30)),
          'yyyy-MM-dd',
        ),
      });
    }
  } else {
    for (let i = 0; i < Math.min(10, items.length); i++) {
      rows.push({
        '#': i + 1,
        'Batch ID': items[i],
        Product: i % 2 === 0 ? 'Product A' : 'Product B',
        'Start Time': format(subDays(now, 5 - i), 'yyyy-MM-dd HH:mm'),
        Status: i < 3 ? 'Completed' : 'In Progress',
        Yield: `${(Math.random() * 5 + 95).toFixed(1)}%`,
      });
    }
  }
  return rows;
}

function generateExportHistory(): ExportHistoryEntry[] {
  const now = new Date();
  return [
    {
      id: 1,
      timestamp: subHours(now, 1),
      source: 'Tags',
      format: 'CSV',
      rows: 14400,
      fileSize: '2.3 MB',
      status: 'Completed',
    },
    {
      id: 2,
      timestamp: subHours(now, 4),
      source: 'Alarms',
      format: 'Excel',
      rows: 256,
      fileSize: '180 KB',
      status: 'Completed',
    },
    {
      id: 3,
      timestamp: subHours(now, 8),
      source: 'Batch Records',
      format: 'PDF',
      rows: 4,
      fileSize: '1.1 MB',
      status: 'Completed',
    },
    {
      id: 4,
      timestamp: subDays(now, 1),
      source: 'Events',
      format: 'CSV',
      rows: 1024,
      fileSize: '512 KB',
      status: 'Completed',
    },
    {
      id: 5,
      timestamp: subDays(now, 2),
      source: 'Equipment',
      format: 'Excel',
      rows: 12,
      fileSize: '45 KB',
      status: 'Completed',
    },
  ];
}

const FORMAT_ICONS: Record<ExportFormat, React.ReactNode> = {
  CSV: <FileText className="w-4 h-4" />,
  Excel: <FileSpreadsheet className="w-4 h-4" />,
  PDF: <FileDown className="w-4 h-4" />,
};

export default function DataExportPage() {
  const [source, setSource] = useState<DataSource>('Tags');
  const [selectedItems, setSelectedItems] = useState<string[]>([
    'TT-101',
    'PT-201',
    'FT-301',
  ]);
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 7), 'yyyy-MM-dd'),
  );
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [exportFormat, setExportFormat] = useState<ExportFormat>('CSV');
  const [exporting, setExporting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [exportHistory] = useState<ExportHistoryEntry[]>(generateExportHistory);

  const items = SOURCE_ITEMS[source];

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSourceChange = (newSource: DataSource) => {
    setSource(newSource);
    setSelectedItems([]);
  };

  const previewData = useMemo(() => {
    if (selectedItems.length === 0) return [];
    return generatePreview(source, selectedItems);
  }, [source, selectedItems]);

  const previewColumns = useMemo(() => {
    if (previewData.length === 0) return [];
    return Object.keys(previewData[0]).map((key) => ({
      key,
      header: key,
      sortable: false,
      render: (row: PreviewRow) => (
        <span className="text-xs text-white/70 font-mono">
          {String(row[key])}
        </span>
      ),
    }));
  }, [previewData]);

  const historyColumns = [
    {
      key: 'timestamp',
      header: 'Date',
      sortable: true,
      width: '160px',
      render: (row: ExportHistoryEntry) => (
        <span className="font-mono text-xs text-white/70">
          {format(row.timestamp, 'yyyy-MM-dd HH:mm')}
        </span>
      ),
    },
    { key: 'source', header: 'Source', sortable: true, width: '120px' },
    {
      key: 'format',
      header: 'Format',
      width: '80px',
      render: (row: ExportHistoryEntry) => (
        <Badge variant="info">{row.format}</Badge>
      ),
    },
    {
      key: 'rows',
      header: 'Rows',
      sortable: true,
      width: '80px',
      render: (row: ExportHistoryEntry) => (
        <span className="font-mono text-xs text-white/70">
          {row.rows.toLocaleString()}
        </span>
      ),
    },
    { key: 'fileSize', header: 'Size', width: '80px' },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (row: ExportHistoryEntry) => (
        <Badge
          variant={row.status === 'Completed' ? 'success' : 'warning'}
          dot
        >
          {row.status}
        </Badge>
      ),
    },
  ];

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const ext =
        exportFormat === 'CSV'
          ? '.csv'
          : exportFormat === 'Excel'
            ? '.xlsx'
            : '.pdf';
      setToast(
        `Export completed: ${source.toLowerCase().replace(' ', '_')}_export_${format(new Date(), 'yyyyMMdd')}${ext}`,
      );
      setTimeout(() => setToast(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg border border-status-running/30 bg-status-running/10 backdrop-blur-sm px-4 py-3 shadow-xl">
          <Check className="w-4 h-4 text-status-running" />
          <span className="text-sm text-white/90">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Database className="w-7 h-7 text-nexaproc-amber" />
            Data Export
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Export process data in multiple formats
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="space-y-4">
          {/* Source Selector */}
          <Card title="Data Source">
            <div className="space-y-2">
              {SOURCES.map((s) => (
                <label
                  key={s}
                  className="flex items-center gap-3 cursor-pointer rounded-lg border border-scada-border px-3 py-2.5 hover:border-scada-border-hover transition-colors"
                >
                  <input
                    type="radio"
                    name="source"
                    checked={source === s}
                    onChange={() => handleSourceChange(s)}
                    className="accent-nexaproc-amber w-3.5 h-3.5"
                  />
                  <span className="text-sm text-white/80">{s}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Item Selector */}
          <Card
            title={`Select ${source}`}
            subtitle={`${selectedItems.length} selected`}
          >
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {items.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-scada-border px-3 py-2 hover:border-scada-border-hover transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItem(item.id)}
                    className="accent-nexaproc-amber w-3.5 h-3.5 flex-shrink-0"
                  />
                  <span className="text-sm text-white/80 truncate">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* Date Range */}
          <Card title="Date Range">
            <div className="space-y-3">
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

          {/* Format */}
          <Card title="Export Format">
            <div className="space-y-2">
              {(['CSV', 'Excel', 'PDF'] as ExportFormat[]).map((f) => (
                <label
                  key={f}
                  className="flex items-center gap-3 cursor-pointer rounded-lg border border-scada-border px-3 py-2.5 hover:border-scada-border-hover transition-colors"
                >
                  <input
                    type="radio"
                    name="format"
                    checked={exportFormat === f}
                    onChange={() => setExportFormat(f)}
                    className="accent-nexaproc-amber w-3.5 h-3.5"
                  />
                  <span className="text-white/50">{FORMAT_ICONS[f]}</span>
                  <span className="text-sm text-white/80">{f}</span>
                </label>
              ))}
            </div>
          </Card>

          {/* Export Button */}
          <Button
            className="w-full"
            size="lg"
            icon={<Download className="w-5 h-5" />}
            loading={exporting}
            disabled={selectedItems.length === 0}
            onClick={handleExport}
          >
            {exporting ? 'Exporting...' : `Export as ${exportFormat}`}
          </Button>
        </div>

        {/* Right: Preview + History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Preview */}
          <Card
            title="Data Preview"
            subtitle={
              previewData.length > 0
                ? `Showing first ${previewData.length} rows`
                : 'Select items to preview'
            }
            noPadding
          >
            {previewData.length > 0 ? (
              <Table<PreviewRow>
                columns={previewColumns}
                data={previewData}
                emptyMessage="No data to preview"
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-white/40 text-sm">
                Select a data source and items to see a preview
              </div>
            )}
          </Card>

          {/* Export History */}
          <Card
            title="Recent Exports"
            subtitle="Last 5 exports"
            noPadding
            headerAction={
              <div className="flex items-center gap-1.5 text-white/40">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">History</span>
              </div>
            }
          >
            <Table<ExportHistoryEntry>
              columns={historyColumns}
              data={exportHistory}
              emptyMessage="No export history"
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
