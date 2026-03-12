import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import {
  Play,
  Pause,
  Square,
  Clock,
  CheckCircle2,
  RotateCcw,
  ListOrdered,
  Activity,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import BatchProgress from '@/components/scada/BatchProgress';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
interface BatchPhaseLocal {
  name: string;
  status: 'complete' | 'running' | 'pending';
  duration: string;
}

interface BatchMock {
  id: string;
  batchNumber: string;
  recipeName: string;
  state: 'running' | 'paused' | 'complete';
  progress: number;
  currentPhase: number;
  totalPhases: number;
  phaseNames: string[];
  startTime: string;
  estimatedEnd: string;
  elapsedSeconds: number;
  operator: string;
  product: string;
  phases: BatchPhaseLocal[];
  events: { time: string; message: string; type: 'info' | 'warn' | 'action' }[];
}

const now = new Date();
const h = (offset: number) => new Date(now.getTime() - offset * 60_000).toISOString();

const initialBatches: BatchMock[] = [
  {
    id: 'BATCH-2026-0312-001',
    batchNumber: 'B-001',
    recipeName: 'Tablet Coating',
    state: 'running',
    progress: 62,
    currentPhase: 3,
    totalPhases: 5,
    phaseNames: ['Pre-Heat', 'Spray Application', 'Drying', 'Cooling', 'Discharge'],
    startTime: h(125),
    estimatedEnd: h(-75),
    elapsedSeconds: 7500,
    operator: 'ops_johnson',
    product: 'Ibuprofen 200mg Coated',
    phases: [
      { name: 'Pre-Heat', status: 'complete', duration: '25 min' },
      { name: 'Spray Application', status: 'complete', duration: '45 min' },
      { name: 'Drying', status: 'running', duration: '~30 min' },
      { name: 'Cooling', status: 'pending', duration: '~20 min' },
      { name: 'Discharge', status: 'pending', duration: '~5 min' },
    ],
    events: [
      { time: h(125), message: 'Batch started by ops_johnson', type: 'action' },
      { time: h(100), message: 'Phase 1 Pre-Heat completed', type: 'info' },
      { time: h(55), message: 'Phase 2 Spray Application completed', type: 'info' },
      { time: h(55), message: 'Phase 3 Drying started', type: 'info' },
      { time: h(30), message: 'Inlet temperature deviation +2.3\u00b0C', type: 'warn' },
      { time: h(15), message: 'Operator acknowledged temperature advisory', type: 'action' },
    ],
  },
  {
    id: 'BATCH-2026-0312-002',
    batchNumber: 'B-002',
    recipeName: 'Fermentation Batch',
    state: 'paused',
    progress: 38,
    currentPhase: 2,
    totalPhases: 4,
    phaseNames: ['Inoculation', 'Growth Phase', 'Harvest', 'CIP'],
    startTime: h(240),
    estimatedEnd: h(-360),
    elapsedSeconds: 14400,
    operator: 'ops_martinez',
    product: 'Yoghurt Culture YC-44',
    phases: [
      { name: 'Inoculation', status: 'complete', duration: '60 min' },
      { name: 'Growth Phase', status: 'running', duration: '~6 hrs' },
      { name: 'Harvest', status: 'pending', duration: '~45 min' },
      { name: 'CIP', status: 'pending', duration: '~30 min' },
    ],
    events: [
      { time: h(240), message: 'Batch started by ops_martinez', type: 'action' },
      { time: h(180), message: 'Phase 1 Inoculation completed', type: 'info' },
      { time: h(180), message: 'Phase 2 Growth Phase started', type: 'info' },
      { time: h(45), message: 'pH deviation detected (5.1 pH)', type: 'warn' },
      { time: h(40), message: 'Batch paused by ops_martinez \u2014 pH correction', type: 'action' },
    ],
  },
  {
    id: 'BATCH-2026-0311-008',
    batchNumber: 'B-008',
    recipeName: 'CIP Cycle',
    state: 'complete',
    progress: 100,
    currentPhase: 4,
    totalPhases: 4,
    phaseNames: ['Rinse', 'Caustic Wash', 'Acid Wash', 'Final Rinse'],
    startTime: h(480),
    estimatedEnd: h(390),
    elapsedSeconds: 5400,
    operator: 'ops_chen',
    product: 'N/A \u2014 Cleaning',
    phases: [
      { name: 'Rinse', status: 'complete', duration: '15 min' },
      { name: 'Caustic Wash', status: 'complete', duration: '30 min' },
      { name: 'Acid Wash', status: 'complete', duration: '25 min' },
      { name: 'Final Rinse', status: 'complete', duration: '20 min' },
    ],
    events: [
      { time: h(480), message: 'CIP Cycle started by ops_chen', type: 'action' },
      { time: h(465), message: 'Phase 1 Rinse completed', type: 'info' },
      { time: h(435), message: 'Phase 2 Caustic Wash completed', type: 'info' },
      { time: h(410), message: 'Phase 3 Acid Wash completed', type: 'info' },
      { time: h(390), message: 'Phase 4 Final Rinse completed', type: 'info' },
      { time: h(390), message: 'Batch completed \u2014 all phases passed', type: 'action' },
    ],
  },
];

function fmtElapsed(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function BatchControlPage() {
  const [batches, setBatches] = useState<BatchMock[]>(initialBatches);
  const [selectedId, setSelectedId] = useState<string>(initialBatches[0].id);

  const selected = batches.find((b) => b.id === selectedId) ?? batches[0];

  useEffect(() => {
    const iv = setInterval(() => {
      setBatches((prev) =>
        prev.map((b) =>
          b.state === 'running' ? { ...b, elapsedSeconds: b.elapsedSeconds + 1 } : b,
        ),
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleAction = useCallback(
    (action: 'pause' | 'resume' | 'abort') => {
      setBatches((prev) =>
        prev.map((b) => {
          if (b.id !== selectedId) return b;
          const ts = new Date().toISOString();
          const newEvent = { time: ts, message: '', type: 'action' as const };
          switch (action) {
            case 'pause':
              newEvent.message = 'Batch paused';
              return { ...b, state: 'paused' as const, events: [...b.events, newEvent] };
            case 'resume':
              newEvent.message = 'Batch resumed';
              return { ...b, state: 'running' as const, events: [...b.events, newEvent] };
            case 'abort':
              newEvent.message = 'Batch ABORTED';
              return { ...b, state: 'complete' as const, events: [...b.events, newEvent] };
            default:
              return b;
          }
        }),
      );
    },
    [selectedId],
  );

  const stateVariant = (s: string): 'success' | 'warning' | 'neutral' => {
    if (s === 'running') return 'success';
    if (s === 'paused') return 'warning';
    return 'neutral';
  };

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Batch Control</h1>
          <p className="text-sm text-white/50">ISA-88 batch execution and monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Activity size={16} className="text-nexaproc-green" />
          <span>{batches.filter((b) => b.state === 'running').length} active</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Batch list */}
        <div className="col-span-12 lg:col-span-4 space-y-3">
          <Card title="Active Batches" subtitle="Select to view details">
            <div className="space-y-2">
              {batches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  className={clsx(
                    'w-full text-left rounded-lg border p-3 transition-all',
                    b.id === selectedId
                      ? 'border-nexaproc-amber/50 bg-nexaproc-amber/5'
                      : 'border-scada-border bg-scada-dark/40 hover:border-scada-border-hover',
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-white">{b.recipeName}</span>
                    <Badge variant={stateVariant(b.state)} dot pulse={b.state === 'running'}>
                      {b.state.charAt(0).toUpperCase() + b.state.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-xs text-white/40 font-mono">{b.id}</div>
                  <div className="mt-2 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        'h-full rounded-full transition-all duration-500',
                        b.state === 'running' && 'bg-nexaproc-green',
                        b.state === 'paused' && 'bg-status-warning',
                        b.state === 'complete' && 'bg-nexaproc-teal',
                      )}
                      style={{ width: `${b.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-white/40">
                    <span>Phase {b.currentPhase}/{b.totalPhases}</span>
                    <span>{b.progress}%</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Detail */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <BatchProgress
            batchId={selected.id}
            recipeName={selected.recipeName}
            currentPhase={selected.currentPhase}
            totalPhases={selected.totalPhases}
            phaseNames={selected.phaseNames}
            progress={selected.progress}
            state={selected.state === 'complete' ? 'complete' : selected.state === 'paused' ? 'paused' : 'running'}
            startTime={selected.startTime}
            estimatedEnd={selected.estimatedEnd}
          />

          {/* Timer + actions */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 rounded-lg border border-scada-border bg-scada-panel px-4 py-2.5">
              <Clock size={16} className="text-nexaproc-amber" />
              <span className="text-xs text-white/50 uppercase tracking-wider mr-2">Elapsed</span>
              <span className="text-lg font-bold font-mono text-white tabular-nums">
                {fmtElapsed(selected.elapsedSeconds)}
              </span>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button variant="secondary" size="sm" icon={<Play size={14} />} disabled={selected.state !== 'paused'} onClick={() => handleAction('resume')}>
                Resume
              </Button>
              <Button variant="ghost" size="sm" icon={<Pause size={14} />} disabled={selected.state !== 'running'} onClick={() => handleAction('pause')}>
                Pause
              </Button>
              <Button variant="danger" size="sm" icon={<Square size={14} />} disabled={selected.state === 'complete'} onClick={() => handleAction('abort')}>
                Abort
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phase list */}
            <Card title="Phase List" subtitle={`${selected.totalPhases} phases`}>
              <div className="space-y-1.5">
                {selected.phases.map((phase, idx) => {
                  const isCurrent = phase.status === 'running';
                  return (
                    <div
                      key={idx}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2 transition-colors',
                        isCurrent ? 'bg-nexaproc-green/10 border border-nexaproc-green/30' : 'border border-transparent',
                      )}
                    >
                      <div className="flex-shrink-0">
                        {phase.status === 'complete' ? (
                          <CheckCircle2 size={16} className="text-nexaproc-teal" />
                        ) : isCurrent ? (
                          <RotateCcw size={16} className="text-nexaproc-green animate-spin" style={{ animationDuration: '3s' }} />
                        ) : (
                          <ListOrdered size={16} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={clsx('text-sm', isCurrent ? 'text-white font-semibold' : phase.status === 'complete' ? 'text-white/60' : 'text-white/30')}>
                          {idx + 1}. {phase.name}
                        </span>
                      </div>
                      <span className="text-xs text-white/40 font-mono flex-shrink-0">{phase.duration}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Events log */}
            <Card title="Batch Events" subtitle={`${selected.events.length} events`}>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {[...selected.events].reverse().map((evt, idx) => {
                  const ts = new Date(evt.time);
                  const timeStr = `${String(ts.getHours()).padStart(2, '0')}:${String(ts.getMinutes()).padStart(2, '0')}`;
                  return (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="flex-shrink-0 font-mono text-white/30 w-12 pt-0.5">{timeStr}</span>
                      <div className={clsx('w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0', evt.type === 'warn' && 'bg-status-warning', evt.type === 'action' && 'bg-nexaproc-amber', evt.type === 'info' && 'bg-white/30')} />
                      <span className={clsx(evt.type === 'warn' ? 'text-status-warning' : 'text-white/60')}>{evt.message}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Operator', value: selected.operator },
              { label: 'Product', value: selected.product },
              { label: 'Batch Number', value: selected.batchNumber },
              { label: 'Recipe', value: selected.recipeName },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-scada-border bg-scada-panel p-3">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-sm text-white font-medium truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
