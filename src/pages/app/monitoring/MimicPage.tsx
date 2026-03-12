import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { RefreshCw, Droplets, Flame, FlaskConical, Container } from 'lucide-react';

import { Card, Badge, Button } from '@/components/ui';
import { TagDisplay, ProcessFlowIndicator } from '@/components/scada';

// ---------------------------------------------------------------------------
// Process tag mock data with live updates
// ---------------------------------------------------------------------------
interface LiveTag {
  id: string;
  label: string;
  unit: string;
  value: number;
  quality: 'good' | 'bad' | 'uncertain';
  alarmState: 'normal' | 'high' | 'hihi' | 'low' | 'lolo';
}

const initialTags: LiveTag[] = [
  { id: 'LT-001', label: 'Feed Tank Level', unit: '%', value: 72.4, quality: 'good', alarmState: 'normal' },
  { id: 'TT-001', label: 'Feed Temperature', unit: '\u00B0C', value: 25.3, quality: 'good', alarmState: 'normal' },
  { id: 'FT-001', label: 'Feed Flow Rate', unit: 'L/min', value: 42.8, quality: 'good', alarmState: 'normal' },
  { id: 'PT-P01', label: 'Pump Discharge Pressure', unit: 'bar', value: 3.2, quality: 'good', alarmState: 'normal' },
  { id: 'ST-P01', label: 'Pump Speed', unit: 'RPM', value: 1450, quality: 'good', alarmState: 'normal' },
  { id: 'TT-HX1', label: 'HX Outlet Temperature', unit: '\u00B0C', value: 78.6, quality: 'good', alarmState: 'normal' },
  { id: 'PT-HX1', label: 'HX Pressure Drop', unit: 'bar', value: 0.45, quality: 'good', alarmState: 'normal' },
  { id: 'TT-RX1', label: 'Reactor Temperature', unit: '\u00B0C', value: 142.3, quality: 'good', alarmState: 'high' },
  { id: 'PT-RX1', label: 'Reactor Pressure', unit: 'bar', value: 4.8, quality: 'good', alarmState: 'normal' },
  { id: 'LT-RX1', label: 'Reactor Level', unit: '%', value: 65.1, quality: 'good', alarmState: 'normal' },
  { id: 'LT-002', label: 'Product Tank Level', unit: '%', value: 38.7, quality: 'good', alarmState: 'normal' },
  { id: 'TT-002', label: 'Product Temperature', unit: '\u00B0C', value: 45.2, quality: 'good', alarmState: 'normal' },
];

function walkTags(prevTags: LiveTag[]): LiveTag[] {
  return prevTags.map((t) => {
    let nv = t.value + (Math.random() - 0.48) * t.value * 0.005;
    nv = Math.max(0, nv);
    return { ...t, value: parseFloat(nv.toFixed(2)) };
  });
}

// ---------------------------------------------------------------------------
// Equipment block component
// ---------------------------------------------------------------------------
interface EquipBlockProps {
  icon: React.ReactNode;
  name: string;
  subtitle: string;
  state: 'running' | 'fault' | 'standby';
  children?: React.ReactNode;
  className?: string;
}

const stateStyles: Record<string, { border: string; dot: string; text: string; bg: string }> = {
  running: { border: 'border-status-running/30', dot: 'bg-status-running', text: 'text-status-running', bg: 'bg-status-running/8' },
  fault: { border: 'border-status-fault/40', dot: 'bg-status-fault', text: 'text-status-fault', bg: 'bg-status-fault/10' },
  standby: { border: 'border-status-warning/30', dot: 'bg-status-warning', text: 'text-status-warning', bg: 'bg-status-warning/8' },
};

const EquipBlock: React.FC<EquipBlockProps> = ({ icon, name, subtitle, state, children, className }) => {
  const s = stateStyles[state];
  return (
    <div className={clsx('rounded-xl border bg-scada-panel p-4 min-w-[200px]', s.border, className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center', s.bg, s.text)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{name}</p>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>
        <span className="relative flex h-2 w-2 flex-shrink-0">
          {state === 'running' && (
            <span className={clsx('absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping', s.dot)} />
          )}
          <span className={clsx('relative inline-flex h-2 w-2 rounded-full', s.dot)} />
        </span>
      </div>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Compact inline tag readout
// ---------------------------------------------------------------------------
const TagReadout: React.FC<{ label: string; value: number; unit: string; alarm?: boolean }> = ({
  label, value, unit, alarm,
}) => (
  <div className="flex items-center justify-between text-xs py-0.5">
    <span className="text-gray-500">{label}</span>
    <span className={clsx('font-mono', alarm ? 'text-alarm-critical font-bold' : 'text-gray-200')}>
      {value.toFixed(1)}
      <span className="text-gray-600 ml-0.5">{unit}</span>
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MimicPage() {
  const [liveTags, setLiveTags] = useState(initialTags);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLiveTags((prev) => walkTags(prev));
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Helper to get a tag by id
  const tag = (id: string) => liveTags.find((t) => t.id === id)!;

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Process Mimic</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Simplified P&ID: Feed Tank - Pump - Heat Exchanger - Reactor - Product Tank
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={isLive ? 'success' : 'neutral'} dot pulse={isLive}>
            {isLive ? 'LIVE' : 'PAUSED'}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCw className={clsx('w-4 h-4', isLive && 'animate-spin')} style={isLive ? { animationDuration: '3s' } : undefined} />}
            onClick={() => setIsLive((v) => !v)}
          >
            {isLive ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      {/* P&ID Flow */}
      <Card title="Process Flow Diagram" subtitle="Pharma Plant Alpha - Granulation Unit">
        {/* Horizontal flow layout */}
        <div className="overflow-x-auto">
          <div className="flex items-center gap-0 min-w-[1100px] py-4">
            {/* FEED TANK */}
            <EquipBlock
              icon={<Container className="w-5 h-5" />}
              name="Feed Tank TK-101"
              subtitle="Raw Material Storage"
              state="running"
            >
              <div className="space-y-0.5 border-t border-scada-border pt-2 mt-1">
                <TagReadout label="Level" value={tag('LT-001').value} unit="%" />
                <TagReadout label="Temp" value={tag('TT-001').value} unit={'\u00B0C'} />
              </div>
            </EquipBlock>

            {/* Pipe: Feed Tank -> Pump */}
            <div className="flex-shrink-0">
              <ProcessFlowIndicator
                flowRate={tag('FT-001').value}
                unit="L/min"
                direction="right"
                active={isLive}
              />
            </div>

            {/* PUMP */}
            <EquipBlock
              icon={<Droplets className="w-5 h-5" />}
              name="Pump P-101"
              subtitle="Centrifugal Feed Pump"
              state="running"
            >
              <div className="space-y-0.5 border-t border-scada-border pt-2 mt-1">
                <TagReadout label="Discharge" value={tag('PT-P01').value} unit="bar" />
                <TagReadout label="Speed" value={tag('ST-P01').value} unit="RPM" />
                <TagReadout label="Flow" value={tag('FT-001').value} unit="L/min" />
              </div>
            </EquipBlock>

            {/* Pipe: Pump -> HX */}
            <div className="flex-shrink-0">
              <ProcessFlowIndicator
                flowRate={tag('FT-001').value}
                unit="L/min"
                direction="right"
                active={isLive}
              />
            </div>

            {/* HEAT EXCHANGER */}
            <EquipBlock
              icon={<Flame className="w-5 h-5" />}
              name="Heat Exchanger HX-101"
              subtitle="Shell & Tube"
              state="running"
            >
              <div className="space-y-0.5 border-t border-scada-border pt-2 mt-1">
                <TagReadout label="Outlet T" value={tag('TT-HX1').value} unit={'\u00B0C'} />
                <TagReadout label={'\u0394P'} value={tag('PT-HX1').value} unit="bar" />
              </div>
            </EquipBlock>

            {/* Pipe: HX -> Reactor */}
            <div className="flex-shrink-0">
              <ProcessFlowIndicator
                flowRate={tag('FT-001').value * 0.97}
                unit="L/min"
                direction="right"
                active={isLive}
              />
            </div>

            {/* REACTOR */}
            <EquipBlock
              icon={<FlaskConical className="w-5 h-5" />}
              name="Reactor R-101"
              subtitle="CSTR Reactor"
              state="running"
              className="border-alarm-high/30"
            >
              <div className="space-y-0.5 border-t border-scada-border pt-2 mt-1">
                <TagReadout label="Temp" value={tag('TT-RX1').value} unit={'\u00B0C'} alarm />
                <TagReadout label="Pressure" value={tag('PT-RX1').value} unit="bar" />
                <TagReadout label="Level" value={tag('LT-RX1').value} unit="%" />
              </div>
            </EquipBlock>

            {/* Pipe: Reactor -> Product Tank */}
            <div className="flex-shrink-0">
              <ProcessFlowIndicator
                flowRate={tag('FT-001').value * 0.92}
                unit="L/min"
                direction="right"
                active={isLive}
              />
            </div>

            {/* PRODUCT TANK */}
            <EquipBlock
              icon={<Container className="w-5 h-5" />}
              name="Product Tank TK-201"
              subtitle="Finished Product Storage"
              state="running"
            >
              <div className="space-y-0.5 border-t border-scada-border pt-2 mt-1">
                <TagReadout label="Level" value={tag('LT-002').value} unit="%" />
                <TagReadout label="Temp" value={tag('TT-002').value} unit={'\u00B0C'} />
              </div>
            </EquipBlock>
          </div>
        </div>
      </Card>

      {/* Detailed tag displays */}
      <Card title="Key Process Measurements" subtitle="Live tag values with quality and alarm state">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {liveTags.map((t) => (
            <TagDisplay
              key={t.id}
              tagId={t.id}
              label={t.label}
              unit={t.unit}
              value={t.value}
              quality={t.quality}
              timestamp={new Date()}
              alarmState={t.alarmState}
              precision={t.value > 100 ? 1 : 2}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
