import React, { useMemo } from 'react';
import {
  Activity,
  ShieldAlert,
  Wrench,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
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

import { Card, Badge, Button } from '@/components/ui';
import { KPICard } from '@/components/scada';

/* ---------- Mock Data ---------- */

interface Prediction {
  id: string;
  equipment: string;
  tag: string;
  prediction: string;
  probability: number;
  daysToFailure: number;
  recommendedAction: string;
  estimatedSavings: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const predictions: Prediction[] = [
  {
    id: 'P1',
    equipment: 'Pump P-103',
    tag: 'PMP-103',
    prediction: 'Bearing degradation detected',
    probability: 87,
    daysToFailure: 14,
    recommendedAction: 'Schedule bearing replacement during next planned outage',
    estimatedSavings: '₹4.2L',
    severity: 'critical',
  },
  {
    id: 'P2',
    equipment: 'Motor M-201',
    tag: 'MTR-201',
    prediction: 'Vibration anomaly increasing',
    probability: 72,
    daysToFailure: 21,
    recommendedAction: 'Perform vibration analysis and check alignment',
    estimatedSavings: '₹3.1L',
    severity: 'high',
  },
  {
    id: 'P3',
    equipment: 'Valve FCV-301',
    tag: 'FCV-301',
    prediction: 'Actuator response time degrading',
    probability: 65,
    daysToFailure: 30,
    recommendedAction: 'Inspect actuator mechanism and lubricate',
    estimatedSavings: '₹1.8L',
    severity: 'medium',
  },
  {
    id: 'P4',
    equipment: 'Heat Exchanger HX-101',
    tag: 'HX-101',
    prediction: 'Fouling rate above threshold',
    probability: 58,
    daysToFailure: 45,
    recommendedAction: 'Plan CIP cleaning cycle during scheduled shutdown',
    estimatedSavings: '₹2.5L',
    severity: 'low',
  },
];

const accuracyTrend = [
  { month: 'Oct', accuracy: 88.2 },
  { month: 'Nov', accuracy: 89.5 },
  { month: 'Dec', accuracy: 91.0 },
  { month: 'Jan', accuracy: 90.8 },
  { month: 'Feb', accuracy: 93.2 },
  { month: 'Mar', accuracy: 94.6 },
];

/* ---------- Helpers ---------- */

function getBarColor(probability: number): string {
  if (probability >= 80) return '#ef4444';
  if (probability >= 70) return '#f97316';
  if (probability >= 60) return '#fbbf24';
  return '#4ade80';
}

function getSeverityVariant(
  severity: Prediction['severity'],
): 'critical' | 'high' | 'medium' | 'low' {
  return severity;
}

/* ---------- Component ---------- */

export default function PredictivePage() {
  const trendData = useMemo(() => accuracyTrend, []);

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={24} className="text-nexaproc-amber" />
          <div>
            <h1 className="text-2xl font-bold text-white">Predictive Maintenance</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              AI-powered failure predictions and recommended actions
            </p>
          </div>
        </div>
        <Badge variant="success" dot pulse>
          Models Active
        </Badge>
      </div>

      {/* Savings Summary KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KPICard
          title="Failures Prevented"
          value={23}
          unit="this year"
          trend="up"
          trendValue={15.0}
          icon={<ShieldAlert className="w-6 h-6" />}
          color="#4ade80"
        />
        <KPICard
          title="Cost Saved"
          value="₹1.2Cr"
          unit=""
          trend="up"
          trendValue={22.5}
          icon={<DollarSign className="w-6 h-6" />}
          color="#fbbf24"
        />
        <KPICard
          title="Downtime Avoided"
          value={156}
          unit="hrs"
          trend="up"
          trendValue={18.3}
          icon={<Clock className="w-6 h-6" />}
          color="#0d9488"
        />
      </div>

      {/* Prediction Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <Card key={p.id}>
            <div className="space-y-4">
              {/* Header row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `${getBarColor(p.probability)}18`,
                      color: getBarColor(p.probability),
                    }}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{p.equipment}</h3>
                    <p className="text-xs text-gray-500 font-mono">{p.tag}</p>
                  </div>
                </div>
                <Badge variant={getSeverityVariant(p.severity)} dot>
                  {p.daysToFailure}d remaining
                </Badge>
              </div>

              {/* Prediction text */}
              <p className="text-sm text-gray-300">{p.prediction}</p>

              {/* Confidence bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Failure Probability</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getBarColor(p.probability) }}
                  >
                    {p.probability}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-700"
                    style={{
                      width: `${p.probability}%`,
                      backgroundColor: getBarColor(p.probability),
                    }}
                  />
                </div>
              </div>

              {/* Recommended action */}
              <div className="rounded-lg bg-white/5 p-3">
                <div className="flex items-start gap-2">
                  <Wrench className="w-4 h-4 text-nexaproc-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-nexaproc-amber mb-0.5">
                      Recommended Action
                    </p>
                    <p className="text-xs text-gray-400">{p.recommendedAction}</p>
                  </div>
                </div>
              </div>

              {/* Savings footer */}
              <div className="flex items-center justify-between pt-2 border-t border-scada-border/50">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <DollarSign className="w-3.5 h-3.5" />
                  Est. savings: <span className="text-status-running font-semibold">{p.estimatedSavings}</span>
                </div>
                <Button size="sm" variant="secondary">
                  Schedule
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Prediction Accuracy Trend */}
      <Card title="Prediction Accuracy Trend" subtitle="Last 6 months">
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(74,222,128,0.08)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis
                domain={[85, 100]}
                stroke="#374151"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                tickLine={{ stroke: '#374151' }}
                width={50}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0d1a12',
                  border: '1px solid rgba(74,222,128,0.28)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e5e7eb',
                }}
                formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Accuracy']}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} iconType="line" iconSize={12} />
              <Line
                type="monotone"
                dataKey="accuracy"
                name="Model Accuracy"
                stroke="#4ade80"
                strokeWidth={2}
                dot={{ r: 4, fill: '#4ade80', strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#4ade80' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent Prediction Results */}
      <Card title="Recent Prediction Results" subtitle="Validated outcomes">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-scada-border text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Equipment</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Prediction</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Predicted</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Actual</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/50">Result</th>
              </tr>
            </thead>
            <tbody>
              {[
                { eq: 'Compressor C-201', pred: 'Valve leak', predDate: '15 Jan', actDate: '18 Jan', result: true },
                { eq: 'Pump P-102', pred: 'Seal failure', predDate: '02 Feb', actDate: '05 Feb', result: true },
                { eq: 'Motor M-105', pred: 'Bearing wear', predDate: '10 Feb', actDate: 'Prevented', result: true },
                { eq: 'Conveyor CV-03', pred: 'Belt slip', predDate: '22 Feb', actDate: 'Not occurred', result: false },
                { eq: 'Fan F-201', pred: 'Imbalance', predDate: '01 Mar', actDate: '03 Mar', result: true },
              ].map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-scada-border/50 hover:bg-nexaproc-green/5 transition-colors"
                >
                  <td className="px-4 py-3 text-white/80 font-medium">{row.eq}</td>
                  <td className="px-4 py-3 text-gray-400">{row.pred}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{row.predDate}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{row.actDate}</td>
                  <td className="px-4 py-3">
                    {row.result ? (
                      <span className="inline-flex items-center gap-1 text-status-running text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" /> False Positive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
