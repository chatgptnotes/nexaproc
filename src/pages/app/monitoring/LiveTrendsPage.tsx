import React, { useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { RefreshCw, Clock, CheckSquare, Square, Pause, Play } from 'lucide-react';

import { Card, Badge, Button } from '@/components/ui';
import { TrendChart } from '@/components/scada';
import type { TrendDataPoint, TrendSeries } from '@/components/scada';
import { tags } from '@/mocks';

// ---------------------------------------------------------------------------
// Colors for trend pens
// ---------------------------------------------------------------------------
const PEN_COLORS = [
  '#4ade80', // green
  '#f97316', // orange
  '#38bdf8', // sky
  '#fbbf24', // amber
  '#a78bfa', // violet
  '#f472b6', // pink
  '#34d399', // emerald
  '#fb923c', // orange-400
  '#60a5fa', // blue-400
  '#facc15', // yellow-400
];

// ---------------------------------------------------------------------------
// Time range options
// ---------------------------------------------------------------------------
const TIME_RANGES = [
  { label: '1 min', value: 60_000, points: 30 },
  { label: '5 min', value: 5 * 60_000, points: 60 },
  { label: '15 min', value: 15 * 60_000, points: 60 },
  { label: '1 hr', value: 60 * 60_000, points: 60 },
];

// ---------------------------------------------------------------------------
// Generate mock time-series for a given tag
// ---------------------------------------------------------------------------
function generateTimeSeries(
  _tagId: string,
  baseValue: number,
  range: number,
  points: number,
  timeSpan: number,
): { time: number; value: number }[] {
  const now = Date.now();
  const interval = timeSpan / points;
  const data: { time: number; value: number }[] = [];
  let val = baseValue;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * range * 0.02;
    val = Math.max(baseValue - range * 0.15, Math.min(baseValue + range * 0.15, val));
    data.push({
      time: now - (points - 1 - i) * interval,
      value: parseFloat(val.toFixed(3)),
    });
  }
  return data;
}

// ---------------------------------------------------------------------------
// Available analog tags for selection
// ---------------------------------------------------------------------------
const analogTags = tags.filter(
  (t) => t.type === 'analog_input' || t.type === 'analog_output',
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LiveTrendsPage() {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(
    new Set(['TT-101', 'PT-101', 'FT-101']),
  );
  const [timeRangeIdx, setTimeRangeIdx] = useState(3); // default 1 hr
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const timeRange = TIME_RANGES[timeRangeIdx];

  // Toggle tag selection
  const toggleTag = useCallback((tagId: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  }, []);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Build merged trend data
  const { chartData, series } = useMemo(() => {
    const selectedArray = Array.from(selectedTags);
    if (selectedArray.length === 0) return { chartData: [] as TrendDataPoint[], series: [] as TrendSeries[] };

    // Generate data per tag
    const allSeriesData = new Map<string, { time: number; value: number }[]>();
    selectedArray.forEach((tagId) => {
      const tagDef = analogTags.find((t) => t.id === tagId);
      if (!tagDef) return;
      const range = tagDef.maxRange - tagDef.minRange;
      allSeriesData.set(
        tagId,
        generateTimeSeries(tagId, tagDef.currentValue, range, timeRange.points, timeRange.value),
      );
    });

    // Merge into common time axis
    const firstTag = selectedArray[0];
    const firstData = allSeriesData.get(firstTag);
    if (!firstData) return { chartData: [] as TrendDataPoint[], series: [] as TrendSeries[] };

    const chartData: TrendDataPoint[] = firstData.map((pt, i) => {
      const point: TrendDataPoint = { time: pt.time };
      selectedArray.forEach((tagId) => {
        const data = allSeriesData.get(tagId);
        if (data && data[i]) {
          point[tagId] = data[i].value;
        }
      });
      return point;
    });

    // Determine if we need dual Y-axes (different units)
    const units = new Set<string>();
    selectedArray.forEach((tagId) => {
      const t = analogTags.find((x) => x.id === tagId);
      if (t) units.add(t.engineeringUnit);
    });

    const unitArr = Array.from(units);
    const useRightAxis = unitArr.length > 1;

    const series: TrendSeries[] = selectedArray.map((tagId, idx) => {
      const t = analogTags.find((x) => x.id === tagId);
      const unit = t?.engineeringUnit ?? '';
      let yAxisId = 'left';
      if (useRightAxis && unitArr.indexOf(unit) === 1) {
        yAxisId = 'right';
      }
      return {
        key: tagId,
        label: `${tagId} (${t?.description ?? tagId})`,
        color: PEN_COLORS[idx % PEN_COLORS.length],
        yAxisId,
      };
    });

    return { chartData, series };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTags, timeRangeIdx, refreshKey]);

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Live Trends</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Multi-pen trend viewer with real-time data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={autoRefresh ? 'success' : 'neutral'} dot pulse={autoRefresh}>
            {autoRefresh ? 'AUTO-REFRESH' : 'PAUSED'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            icon={autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            onClick={() => setAutoRefresh((v) => !v)}
          >
            {autoRefresh ? 'Pause' : 'Resume'}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw className="w-4 h-4" />}
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Main layout: sidebar + chart */}
      <div className="flex gap-6">
        {/* Tag selector sidebar */}
        <div className="w-72 flex-shrink-0">
          <Card title="Tag Selector" subtitle={`${selectedTags.size} selected`}>
            <div className="max-h-[600px] overflow-y-auto space-y-1 pr-1">
              {analogTags.map((tag) => {
                const selected = selectedTags.has(tag.id);
                const colorIdx = Array.from(selectedTags).indexOf(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={clsx(
                      'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors',
                      selected
                        ? 'bg-nexaproc-green/10 border border-nexaproc-green/25'
                        : 'hover:bg-white/5 border border-transparent',
                    )}
                  >
                    {selected ? (
                      <CheckSquare
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: PEN_COLORS[colorIdx % PEN_COLORS.length] }}
                      />
                    ) : (
                      <Square className="w-4 h-4 flex-shrink-0 text-gray-600" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={clsx('text-xs font-mono font-bold', selected ? 'text-white' : 'text-gray-400')}>
                        {tag.id}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">{tag.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-600 flex-shrink-0">{tag.engineeringUnit}</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Chart area */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Time range selector */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-xs text-gray-500 mr-2">Time Range:</span>
            {TIME_RANGES.map((tr, idx) => (
              <button
                key={tr.label}
                onClick={() => setTimeRangeIdx(idx)}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  idx === timeRangeIdx
                    ? 'bg-nexaproc-amber/15 text-nexaproc-amber border border-nexaproc-amber/30'
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent',
                )}
              >
                {tr.label}
              </button>
            ))}
          </div>

          {/* Chart */}
          {selectedTags.size === 0 ? (
            <Card>
              <div className="flex items-center justify-center h-80 text-gray-500 text-sm">
                Select one or more tags from the sidebar to display trends
              </div>
            </Card>
          ) : (
            <TrendChart
              data={chartData}
              series={series}
              height={500}
              showLegend
            />
          )}

          {/* Selected tags legend */}
          {selectedTags.size > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedTags).map((tagId, idx) => {
                const tag = analogTags.find((t) => t.id === tagId);
                return (
                  <div
                    key={tagId}
                    className="flex items-center gap-2 rounded-lg border border-scada-border bg-scada-panel px-3 py-1.5"
                  >
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: PEN_COLORS[idx % PEN_COLORS.length] }}
                    />
                    <span className="text-xs font-mono font-bold text-gray-300">{tagId}</span>
                    <span className="text-[10px] text-gray-500">{tag?.engineeringUnit}</span>
                    <span className="text-xs text-gray-400 font-mono">{tag?.currentValue.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
