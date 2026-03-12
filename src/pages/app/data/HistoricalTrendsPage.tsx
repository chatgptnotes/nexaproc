import React, { useState, useMemo } from 'react';
import { format, subDays, addMilliseconds, differenceInMilliseconds } from 'date-fns';
import { Download, Search, TrendingUp } from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import TrendChart from '@/components/scada/TrendChart';
import type { TrendDataPoint, TrendSeries } from '@/components/scada/TrendChart';

const ALL_TAGS = [
  { id: 'TT-101', label: 'TT-101 Reactor Temp', unit: '\u00b0C', min: 60, max: 95, color: '#fbbf24' },
  { id: 'PT-201', label: 'PT-201 Header Pressure', unit: 'bar', min: 2.5, max: 6.0, color: '#4ade80' },
  { id: 'FT-301', label: 'FT-301 Feed Flow', unit: 'L/min', min: 100, max: 250, color: '#38bdf8' },
  { id: 'LT-401', label: 'LT-401 Tank Level', unit: '%', min: 30, max: 85, color: '#f97316' },
  { id: 'AT-501', label: 'AT-501 pH Analyzer', unit: 'pH', min: 5.5, max: 8.5, color: '#a78bfa' },
  { id: 'TT-102', label: 'TT-102 Coolant Temp', unit: '\u00b0C', min: 15, max: 35, color: '#f472b6' },
  { id: 'PT-202', label: 'PT-202 Discharge Pressure', unit: 'bar', min: 1.0, max: 4.5, color: '#34d399' },
  { id: 'FT-302', label: 'FT-302 Recycle Flow', unit: 'L/min', min: 50, max: 150, color: '#fb923c' },
];

const RESOLUTIONS = [
  { value: '1s', label: '1 Second' },
  { value: '10s', label: '10 Seconds' },
  { value: '1min', label: '1 Minute' },
  { value: '5min', label: '5 Minutes' },
  { value: '1hr', label: '1 Hour' },
];

function generateData(
  selectedTags: string[],
  startDate: Date,
  endDate: Date,
  count: number,
): TrendDataPoint[] {
  const totalMs = differenceInMilliseconds(endDate, startDate);
  const step = totalMs / (count - 1);
  const data: TrendDataPoint[] = [];

  for (let i = 0; i < count; i++) {
    const ts = addMilliseconds(startDate, step * i);
    const point: TrendDataPoint = { time: ts.getTime() };
    for (const tagId of selectedTags) {
      const tag = ALL_TAGS.find((t) => t.id === tagId);
      if (!tag) continue;
      const mid = (tag.max + tag.min) / 2;
      const amp = (tag.max - tag.min) / 2;
      const noise = (Math.random() - 0.5) * amp * 0.4;
      const wave = Math.sin((i / count) * Math.PI * 4 + ALL_TAGS.indexOf(tag)) * amp * 0.5;
      point[tagId] = Math.round((mid + wave + noise) * 100) / 100;
    }
    data.push(point);
  }
  return data;
}

export default function HistoricalTrendsPage() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const weekAgo = format(subDays(new Date(), 7), 'yyyy-MM-dd');

  const [startDate, setStartDate] = useState(weekAgo);
  const [endDate, setEndDate] = useState(today);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'TT-101', 'PT-201', 'FT-301', 'LT-401',
  ]);
  const [resolution, setResolution] = useState('1min');
  const [tagSearch, setTagSearch] = useState('');

  const filteredTags = ALL_TAGS.filter(
    (t) =>
      t.id.toLowerCase().includes(tagSearch.toLowerCase()) ||
      t.label.toLowerCase().includes(tagSearch.toLowerCase()),
  );

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  const chartData = useMemo(() => {
    if (selectedTags.length === 0) return [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) return [];
    return generateData(selectedTags, start, end, 100);
  }, [selectedTags, startDate, endDate]);

  const series: TrendSeries[] = selectedTags
    .map((tagId) => {
      const tag = ALL_TAGS.find((t) => t.id === tagId);
      if (!tag) return null;
      return { key: tag.id, label: tag.label, color: tag.color };
    })
    .filter(Boolean) as TrendSeries[];

  const handleExport = () => {
    if (chartData.length === 0) return;
    const headers = ['Timestamp', ...selectedTags].join(',');
    const rows = chartData.map((p) => {
      const ts = format(new Date(p.time as number), 'yyyy-MM-dd HH:mm:ss');
      const vals = selectedTags.map((t) => p[t] ?? '');
      return [ts, ...vals].join(',');
    });
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historical_trends_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp className="w-7 h-7 text-nexaproc-amber" />
            Historical Trends
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Browse and export historical process data
          </p>
        </div>
        <Button
          icon={<Download className="w-4 h-4" />}
          onClick={handleExport}
          disabled={chartData.length === 0}
        >
          Export CSV
        </Button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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

        {/* Resolution */}
        <Card title="Time Resolution">
          <div className="space-y-2">
            {RESOLUTIONS.map((r) => (
              <label
                key={r.value}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="resolution"
                  value={r.value}
                  checked={resolution === r.value}
                  onChange={() => setResolution(r.value)}
                  className="accent-nexaproc-amber w-3.5 h-3.5"
                />
                <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">
                  {r.label}
                </span>
              </label>
            ))}
          </div>
        </Card>

        {/* Tag Selector */}
        <div className="lg:col-span-2">
          <Card title="Tag Selector" subtitle={`${selectedTags.length} tag(s) selected`}>
            <div className="mb-3">
              <Input
                placeholder="Search tags..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredTags.map((tag) => (
                <label
                  key={tag.id}
                  className="flex items-center gap-2 cursor-pointer rounded-lg border border-scada-border px-3 py-2 hover:border-scada-border-hover transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag.id)}
                    onChange={() => toggleTag(tag.id)}
                    className="accent-nexaproc-amber w-3.5 h-3.5 flex-shrink-0"
                  />
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm text-white/80 truncate">{tag.label}</span>
                  <span className="text-xs text-white/40 ml-auto flex-shrink-0">{tag.unit}</span>
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Trend Chart */}
      <Card title="Trend Data" subtitle={chartData.length > 0 ? `${chartData.length} data points` : 'Select tags and date range'}>
        {chartData.length > 0 && series.length > 0 ? (
          <TrendChart data={chartData} series={series} height={420} showLegend />
        ) : (
          <div className="flex items-center justify-center h-64 text-white/40 text-sm">
            No data to display. Select tags and a valid date range.
          </div>
        )}
      </Card>
    </div>
  );
}
