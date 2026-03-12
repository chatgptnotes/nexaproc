import React, { useState, useMemo } from 'react';
import { Search, Database } from 'lucide-react';
import clsx from 'clsx';

import { Card, Input, Table, Badge, Modal, Button } from '@/components/ui';
import { tags } from '@/mocks';
import { plants } from '@/mocks';
import type { ProcessTag } from '@/mocks';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getPlantName(plantId: string): string {
  return plants.find((p) => p.id === plantId)?.name ?? plantId;
}

function getAlarmState(tag: ProcessTag): { state: string; variant: 'success' | 'danger' | 'warning' | 'neutral' } {
  const v = tag.currentValue;
  const limits = tag.alarmLimits;
  if (limits.hihi !== undefined && v >= limits.hihi) return { state: 'HI-HI', variant: 'danger' };
  if (limits.lolo !== undefined && v <= limits.lolo) return { state: 'LO-LO', variant: 'danger' };
  if (limits.hi !== undefined && v >= limits.hi) return { state: 'HIGH', variant: 'warning' };
  if (limits.lo !== undefined && v <= limits.lo) return { state: 'LOW', variant: 'warning' };
  return { state: 'Normal', variant: 'success' };
}

function getQualityDot(quality: ProcessTag['quality']): { color: string; label: string } {
  switch (quality) {
    case 'good':
      return { color: 'bg-status-running', label: 'Good' };
    case 'bad':
      return { color: 'bg-status-fault', label: 'Bad' };
    case 'uncertain':
      return { color: 'bg-status-warning', label: 'Uncertain' };
    default:
      return { color: 'bg-gray-500', label: 'Unknown' };
  }
}

// ---------------------------------------------------------------------------
// Detail row helper
// ---------------------------------------------------------------------------
const DetailRow: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
    <p className={clsx('text-sm text-gray-200', mono && 'font-mono')}>{value}</p>
  </div>
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function TagBrowserPage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<ProcessTag | null>(null);

  // Filtered tags
  const filtered = useMemo(() => {
    if (!search.trim()) return tags;
    const q = search.toLowerCase();
    return tags.filter(
      (t) =>
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.engineeringUnit.toLowerCase().includes(q) ||
        getPlantName(t.plantId).toLowerCase().includes(q),
    );
  }, [search]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        key: 'id',
        header: 'Tag Name',
        sortable: true,
        render: (row: ProcessTag) => (
          <span className="font-mono text-xs font-bold text-nexaproc-green">{row.id}</span>
        ),
      },
      {
        key: 'description',
        header: 'Description',
        sortable: true,
        render: (row: ProcessTag) => (
          <span className="text-xs text-gray-300 max-w-xs truncate block">{row.description}</span>
        ),
      },
      {
        key: 'currentValue',
        header: 'Value',
        sortable: true,
        render: (row: ProcessTag) => {
          if (row.type === 'digital_input' || row.type === 'digital_output') {
            return (
              <Badge variant={row.currentValue === 1 ? 'success' : 'neutral'}>
                {row.currentValue === 1 ? 'ON' : 'OFF'}
              </Badge>
            );
          }
          return (
            <span className="font-mono text-sm text-white font-semibold">
              {row.currentValue.toFixed(2)}
            </span>
          );
        },
      },
      {
        key: 'engineeringUnit',
        header: 'Unit',
        sortable: true,
        render: (row: ProcessTag) => (
          <span className="text-xs text-gray-500">{row.engineeringUnit || '--'}</span>
        ),
      },
      {
        key: 'quality',
        header: 'Quality',
        sortable: true,
        render: (row: ProcessTag) => {
          const q = getQualityDot(row.quality);
          return (
            <div className="flex items-center gap-2">
              <span className={clsx('w-2 h-2 rounded-full', q.color)} />
              <span className="text-xs text-gray-400">{q.label}</span>
            </div>
          );
        },
      },
      {
        key: 'alarmState',
        header: 'Alarm',
        sortable: false,
        render: (row: ProcessTag) => {
          const a = getAlarmState(row);
          return (
            <Badge
              variant={a.variant}
              dot={a.state !== 'Normal'}
              pulse={a.variant === 'danger'}
            >
              {a.state}
            </Badge>
          );
        },
      },
      {
        key: 'plantId',
        header: 'Plant',
        sortable: true,
        render: (row: ProcessTag) => (
          <span className="text-xs text-gray-500">{getPlantName(row.plantId)}</span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-nexaproc-green/10 text-nexaproc-green flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Tag Browser</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {tags.length} process tags across all plants
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Badge variant="success">{tags.filter((t) => t.quality === 'good').length} Good</Badge>
          <Badge variant="warning">{tags.filter((t) => t.quality === 'uncertain').length} Uncertain</Badge>
          <Badge variant="danger">{tags.filter((t) => t.quality === 'bad').length} Bad</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-xl">
        <Input
          placeholder="Search by tag name, description, unit, or plant..."
          icon={<Search className="w-4 h-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-500">
        Showing <span className="text-white font-semibold">{filtered.length}</span> of {tags.length} tags
        {search && (
          <button
            className="ml-2 text-nexaproc-amber hover:underline"
            onClick={() => setSearch('')}
          >
            Clear search
          </button>
        )}
      </p>

      {/* Table */}
      <Card noPadding>
        <Table<ProcessTag>
          columns={columns}
          data={filtered}
          onRowClick={(row) => setSelectedTag(row)}
          emptyMessage="No tags match your search"
        />
      </Card>

      {/* Tag detail modal */}
      <Modal
        open={!!selectedTag}
        onClose={() => setSelectedTag(null)}
        title={selectedTag ? `Tag Detail: ${selectedTag.id}` : ''}
        size="lg"
        footer={
          <Button variant="ghost" onClick={() => setSelectedTag(null)}>
            Close
          </Button>
        }
      >
        {selectedTag && (
          <div className="space-y-5">
            {/* General info */}
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Tag ID" value={selectedTag.id} mono />
              <DetailRow label="Name" value={selectedTag.name} mono />
              <DetailRow label="Description" value={selectedTag.description} />
              <DetailRow label="Type" value={selectedTag.type} />
              <DetailRow label="Unit" value={selectedTag.engineeringUnit || 'N/A'} />
              <DetailRow label="Plant" value={getPlantName(selectedTag.plantId)} />
              <DetailRow label="Zone" value={selectedTag.zoneId} mono />
              <DetailRow label="Quality" value={selectedTag.quality} />
            </div>

            {/* Current value */}
            <div className="border-t border-scada-border pt-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Current Value
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-nexaproc-green font-mono">
                  {selectedTag.currentValue.toFixed(3)}
                </span>
                <span className="text-sm text-gray-500">{selectedTag.engineeringUnit}</span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                {(() => {
                  const q = getQualityDot(selectedTag.quality);
                  return (
                    <div className="flex items-center gap-1.5">
                      <span className={clsx('w-2 h-2 rounded-full', q.color)} />
                      <span className="text-xs text-gray-400">{q.label}</span>
                    </div>
                  );
                })()}
                {(() => {
                  const a = getAlarmState(selectedTag);
                  return (
                    <Badge variant={a.variant} dot={a.state !== 'Normal'}>
                      {a.state}
                    </Badge>
                  );
                })()}
              </div>
            </div>

            {/* Range & Alarm limits */}
            <div className="border-t border-scada-border pt-4">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                Range & Alarm Limits
              </p>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Min Range" value={selectedTag.minRange.toString()} mono />
                <DetailRow label="Max Range" value={selectedTag.maxRange.toString()} mono />
                <DetailRow
                  label="LOLO"
                  value={selectedTag.alarmLimits.lolo?.toString() ?? '--'}
                  mono
                />
                <DetailRow
                  label="LO"
                  value={selectedTag.alarmLimits.lo?.toString() ?? '--'}
                  mono
                />
                <DetailRow
                  label="HI"
                  value={selectedTag.alarmLimits.hi?.toString() ?? '--'}
                  mono
                />
                <DetailRow
                  label="HIHI"
                  value={selectedTag.alarmLimits.hihi?.toString() ?? '--'}
                  mono
                />
              </div>
            </div>

            {/* Timestamp */}
            <div className="border-t border-scada-border pt-4">
              <DetailRow label="Last Updated" value={new Date(selectedTag.timestamp).toLocaleString()} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
