import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export interface TrendSeries {
  key: string;
  label: string;
  color: string;
  yAxisId?: string;
}

export interface TrendDataPoint {
  time: number | string;
  [key: string]: number | string;
}

export interface TrendChartProps {
  data: TrendDataPoint[];
  series: TrendSeries[];
  height?: number;
  showLegend?: boolean;
}

const formatTime = (tick: number | string): string => {
  if (typeof tick === 'string') return tick;
  const d = new Date(tick);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
};

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: number | string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg">
      <p className="text-xs text-gray-500 font-mono mb-1">
        {typeof label === 'number' ? formatTime(label) : label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-400">{entry.name}:</span>
          <span className="text-gray-200 font-mono font-medium">
            {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const TrendChart: React.FC<TrendChartProps> = ({
  data,
  series,
  height = 300,
  showLegend = true,
}) => {
  // Determine unique Y-axis IDs
  const yAxisIds = Array.from(
    new Set(series.map((s) => s.yAxisId ?? 'left')),
  );

  return (
    <div
      className="rounded-lg border border-scada-border bg-scada-panel p-4"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(74,222,128,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tickFormatter={formatTime}
            stroke="#374151"
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickLine={{ stroke: '#374151' }}
          />
          {yAxisIds.map((id, idx) => (
            <YAxis
              key={id}
              yAxisId={id}
              orientation={idx === 0 ? 'left' : 'right'}
              stroke="#374151"
              tick={{ fill: '#6b7280', fontSize: 11 }}
              tickLine={{ stroke: '#374151' }}
              width={50}
            />
          ))}
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12, color: '#9ca3af' }}
              iconType="line"
              iconSize={12}
            />
          )}
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              yAxisId={s.yAxisId ?? 'left'}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 0 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;
