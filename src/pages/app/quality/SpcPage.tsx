import { useState, useMemo } from 'react';
import { BarChart3, AlertTriangle, Info } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ComposedChart,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';

// ── Tags ────────────────────────────────────────────────────────────────────
const tags = [
  { value: 'TT-101', label: 'TT-101 — Reactor Temperature' },
  { value: 'PT-201', label: 'PT-201 — Discharge Pressure' },
  { value: 'FT-301', label: 'FT-301 — Feed Flow Rate' },
  { value: 'AT-401', label: 'AT-401 — pH Analyzer' },
];

// ── Generate mock SPC data ──────────────────────────────────────────────────
const mean = 185.0;
const sigma = 0.6;
const ucl = mean + 3 * sigma;
const lcl = mean - 3 * sigma;

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

const rng = seededRandom(42);

const rawData: number[] = [];
for (let i = 0; i < 30; i++) {
  // Box-Muller transform for normal distribution
  const u1 = rng();
  const u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  let val = mean + z * sigma;
  // Inject 2 out-of-control points
  if (i === 12) val = ucl + 0.4;
  if (i === 23) val = lcl - 0.3;
  rawData.push(parseFloat(val.toFixed(2)));
}

// X-bar data
const xBarData = rawData.map((v, i) => ({
  sample: i + 1,
  value: v,
  outOfSpec: v > ucl || v < lcl,
}));

// Range data (moving range between consecutive points)
const rangeData: { sample: number; range: number; outOfSpec: boolean }[] = [];
const rangeMean =
  rawData.slice(1).reduce((sum, v, i) => sum + Math.abs(v - rawData[i]), 0) /
  (rawData.length - 1);
const rangeUCL = rangeMean * 3.267; // D4 constant for n=2
for (let i = 1; i < rawData.length; i++) {
  const r = parseFloat(Math.abs(rawData[i] - rawData[i - 1]).toFixed(3));
  rangeData.push({ sample: i + 1, range: r, outOfSpec: r > rangeUCL });
}

// ── SPC Statistics ──────────────────────────────────────────────────────────
const spcMean = rawData.reduce((a, b) => a + b, 0) / rawData.length;
const spcStdDev = Math.sqrt(rawData.reduce((s, v) => s + (v - spcMean) ** 2, 0) / (rawData.length - 1));
const specUpper = 186.5;
const specLower = 183.5;
const cp = (specUpper - specLower) / (6 * spcStdDev);
const cpk = Math.min((specUpper - spcMean) / (3 * spcStdDev), (spcMean - specLower) / (3 * spcStdDev));
const oosCount = rawData.filter((v) => v > ucl || v < lcl).length;

// ── Western Electric Rules ──────────────────────────────────────────────────
interface RuleViolation {
  rule: string;
  description: string;
  samples: string;
  severity: 'danger' | 'warning' | 'info';
}

const ruleViolations: RuleViolation[] = [
  {
    rule: 'Rule 1',
    description: '1 point beyond 3\u03C3 limit',
    samples: 'Sample #13 (186.92\u00B0C > UCL 186.80\u00B0C)',
    severity: 'danger',
  },
  {
    rule: 'Rule 1',
    description: '1 point beyond 3\u03C3 limit',
    samples: 'Sample #24 (182.90\u00B0C < LCL 183.20\u00B0C)',
    severity: 'danger',
  },
  {
    rule: 'Rule 5',
    description: '2 of 3 consecutive points beyond 2\u03C3 on same side',
    samples: 'Samples #11-13 (high side)',
    severity: 'warning',
  },
  {
    rule: 'Rule 7',
    description: '15 consecutive points within 1\u03C3 of center',
    samples: 'Samples #1-15 (stratification pattern)',
    severity: 'info',
  },
];

// ── Custom Tooltip ──────────────────────────────────────────────────────────
const SpcTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color?: string }>;
  label?: string | number;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-scada-dark border border-scada-border rounded-md px-3 py-2 shadow-lg text-xs">
      <p className="text-gray-400 mb-1">Sample #{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="font-mono text-white">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Custom dot renderer ─────────────────────────────────────────────────────
const renderXBarDot = (props: { cx: number; cy: number; index: number }) => {
  const { cx, cy, index } = props;
  const pt = xBarData[index];
  if (!pt) return null;
  if (pt.outOfSpec) {
    return (
      <circle
        key={`dot-${index}`}
        cx={cx}
        cy={cy}
        r={5}
        fill="#ef4444"
        stroke="#ef4444"
        strokeWidth={2}
        opacity={0.9}
      />
    );
  }
  return (
    <circle key={`dot-${index}`} cx={cx} cy={cy} r={3} fill="#4ade80" stroke="none" opacity={0.7} />
  );
};

const renderRangeDot = (props: { cx: number; cy: number; index: number }) => {
  const { cx, cy, index } = props;
  const pt = rangeData[index];
  if (!pt) return null;
  if (pt.outOfSpec) {
    return (
      <circle
        key={`rdot-${index}`}
        cx={cx}
        cy={cy}
        r={5}
        fill="#ef4444"
        stroke="#ef4444"
        strokeWidth={2}
        opacity={0.9}
      />
    );
  }
  return (
    <circle key={`rdot-${index}`} cx={cx} cy={cy} r={3} fill="#3b82f6" stroke="none" opacity={0.7} />
  );
};

export default function SpcPage() {
  const [selectedTag, setSelectedTag] = useState('TT-101');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 size={24} className="text-nexaproc-amber" />
          <h1 className="text-2xl font-bold text-white">SPC Charts</h1>
        </div>
        <Select
          options={tags}
          value={selectedTag}
          onChange={setSelectedTag}
          className="w-72"
        />
      </div>

      {/* SPC Statistics Panel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Mean', value: spcMean.toFixed(2), unit: '\u00B0C', color: 'text-white' },
          { label: 'Std Dev', value: spcStdDev.toFixed(3), unit: '\u03C3', color: 'text-white' },
          { label: 'Cp', value: cp.toFixed(2), unit: '', color: cp >= 1.33 ? 'text-status-running' : 'text-status-warning' },
          { label: 'Cpk', value: cpk.toFixed(2), unit: '', color: cpk >= 1.33 ? 'text-status-running' : 'text-status-warning' },
          { label: 'UCL', value: ucl.toFixed(2), unit: '\u00B0C', color: 'text-alarm-critical' },
          { label: 'Out-of-Spec', value: String(oosCount), unit: 'pts', color: oosCount > 0 ? 'text-alarm-critical' : 'text-status-running' },
        ].map((stat, i) => (
          <div key={i} className="rounded-lg border border-scada-border bg-scada-panel px-4 py-3 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-lg font-bold font-mono ${stat.color}`}>
              {stat.value}
              {stat.unit && <span className="text-xs text-white/30 ml-1">{stat.unit}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* X-bar Chart */}
      <Card title="X-bar Chart (Individual Values)" subtitle={`Tag: ${selectedTag} | UCL: ${ucl.toFixed(2)} | Target: ${mean.toFixed(1)} | LCL: ${lcl.toFixed(2)}`}>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={xBarData} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" vertical={false} />
              <XAxis
                dataKey="sample"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                label={{ value: 'Sample #', position: 'insideBottomRight', offset: -5, fill: '#6b7280', fontSize: 10 }}
              />
              <YAxis
                domain={[lcl - 1, ucl + 1]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
              />
              <Tooltip content={<SpcTooltip />} />
              {/* Control limits */}
              <ReferenceLine y={ucl} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: 'UCL', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={mean} stroke="#fbbf24" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'CL', fill: '#fbbf24', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={lcl} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: 'LCL', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              {/* 1-sigma and 2-sigma zones */}
              <ReferenceLine y={mean + sigma} stroke="rgba(74,222,128,0.15)" strokeDasharray="2 4" />
              <ReferenceLine y={mean - sigma} stroke="rgba(74,222,128,0.15)" strokeDasharray="2 4" />
              <ReferenceLine y={mean + 2 * sigma} stroke="rgba(251,191,36,0.15)" strokeDasharray="2 4" />
              <ReferenceLine y={mean - 2 * sigma} stroke="rgba(251,191,36,0.15)" strokeDasharray="2 4" />
              <Line
                type="monotone"
                dataKey="value"
                name="Value"
                stroke="#4ade80"
                strokeWidth={1.5}
                dot={renderXBarDot as any}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Range Chart */}
      <Card title="Moving Range (R) Chart" subtitle={`Range UCL: ${rangeUCL.toFixed(3)} | Mean Range: ${rangeMean.toFixed(3)}`}>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rangeData} margin={{ top: 16, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" vertical={false} />
              <XAxis
                dataKey="sample"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis
                domain={[0, 'auto']}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
              />
              <Tooltip content={<SpcTooltip />} />
              <ReferenceLine y={rangeUCL} stroke="#ef4444" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: 'UCL', fill: '#ef4444', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={rangeMean} stroke="#fbbf24" strokeDasharray="4 4" strokeWidth={1} label={{ value: 'CL', fill: '#fbbf24', fontSize: 10, position: 'right' }} />
              <Line
                type="monotone"
                dataKey="range"
                name="Range"
                stroke="#3b82f6"
                strokeWidth={1.5}
                dot={renderRangeDot as any}
                activeDot={{ r: 5, strokeWidth: 0 }}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Rule Violations */}
      <Card title="Western Electric Rule Violations" subtitle="Automated SPC rule checking">
        <div className="space-y-2">
          {ruleViolations.map((v, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-scada-border/50 bg-scada-dark/40 px-4 py-3"
            >
              <AlertTriangle
                size={16}
                className={`flex-shrink-0 mt-0.5 ${
                  v.severity === 'danger' ? 'text-alarm-critical' :
                  v.severity === 'warning' ? 'text-status-warning' :
                  'text-status-maintenance'
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white">{v.rule}</span>
                  <Badge variant={v.severity === 'danger' ? 'danger' : v.severity === 'warning' ? 'warning' : 'info'}>
                    {v.severity === 'danger' ? 'Violation' : v.severity === 'warning' ? 'Warning' : 'Info'}
                  </Badge>
                </div>
                <p className="text-xs text-white/60">{v.description}</p>
                <p className="text-[11px] text-white/40 font-mono mt-0.5">{v.samples}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
