import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { format } from 'date-fns';

import { Card, Table, Badge, Select, Input, StatusIndicator } from '@/components/ui';
import { equipment } from '@/mocks';
import { plants } from '@/mocks';
import type { Equipment, EquipmentState } from '@/mocks';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const stateLabelMap: Record<EquipmentState, { variant: 'success' | 'danger' | 'warning' | 'info' | 'neutral'; label: string; siStatus: 'running' | 'stopped' | 'fault' | 'warning' | 'maintenance' }> = {
  running: { variant: 'success', label: 'Running', siStatus: 'running' },
  stopped: { variant: 'neutral', label: 'Stopped', siStatus: 'stopped' },
  fault: { variant: 'danger', label: 'Fault', siStatus: 'fault' },
  maintenance: { variant: 'info', label: 'Maintenance', siStatus: 'maintenance' },
  standby: { variant: 'warning', label: 'Standby', siStatus: 'warning' },
};

function formatRuntime(hours: number): string {
  if (hours < 24) return `${hours.toFixed(0)} hrs`;
  const days = Math.floor(hours / 24);
  const rem = Math.round(hours % 24);
  return `${days}d ${rem}h`;
}

function getPlantName(plantId: string): string {
  return plants.find((p) => p.id === plantId)?.name ?? plantId;
}

// Generate fake last maintenance dates
function getLastMaintenance(eqId: string): Date {
  let hash = 0;
  for (let i = 0; i < eqId.length; i++) hash = (hash * 31 + eqId.charCodeAt(i)) & 0xffffffff;
  const daysAgo = (Math.abs(hash) % 90) + 5;
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function EquipmentStatusPage() {
  const [stateFilter, setStateFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [plantFilter, setPlantFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Unique types
  const equipmentTypes = useMemo(() => {
    const types = Array.from(new Set(equipment.map((e) => e.type)));
    return types.sort();
  }, []);

  // Filtered data
  const filtered = useMemo(() => {
    let data = [...equipment];
    if (stateFilter !== 'all') data = data.filter((e) => e.state === stateFilter);
    if (typeFilter !== 'all') data = data.filter((e) => e.type === typeFilter);
    if (plantFilter !== 'all') data = data.filter((e) => e.plantId === plantFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q) ||
          e.type.toLowerCase().includes(q),
      );
    }
    return data;
  }, [stateFilter, typeFilter, plantFilter, search]);

  // Summary counts
  const counts = useMemo(() => {
    const all = equipment;
    return {
      total: all.length,
      running: all.filter((e) => e.state === 'running').length,
      stopped: all.filter((e) => e.state === 'stopped').length,
      fault: all.filter((e) => e.state === 'fault').length,
      maintenance: all.filter((e) => e.state === 'maintenance').length,
      standby: all.filter((e) => e.state === 'standby').length,
    };
  }, []);

  const columns = useMemo(
    () => [
      {
        key: 'name',
        header: 'Equipment',
        sortable: true,
        render: (row: Equipment) => (
          <div>
            <p className="text-sm font-medium text-white">{row.name}</p>
            <p className="text-[11px] text-gray-500 font-mono">{row.id}</p>
          </div>
        ),
      },
      {
        key: 'type',
        header: 'Type',
        sortable: true,
        render: (row: Equipment) => (
          <span className="text-xs text-gray-400">{row.type}</span>
        ),
      },
      {
        key: 'state',
        header: 'State',
        sortable: true,
        render: (row: Equipment) => {
          const cfg = stateLabelMap[row.state];
          return (
            <div className="flex items-center gap-2">
              <StatusIndicator status={cfg.siStatus} />
              <Badge
                variant={cfg.variant}
                dot
                pulse={row.state === 'fault'}
              >
                {cfg.label}
              </Badge>
            </div>
          );
        },
      },
      {
        key: 'plantId',
        header: 'Plant',
        sortable: true,
        render: (row: Equipment) => (
          <span className="text-xs text-gray-400">{getPlantName(row.plantId)}</span>
        ),
      },
      {
        key: 'zoneId',
        header: 'Zone',
        sortable: true,
        render: (row: Equipment) => (
          <span className="text-xs text-gray-500 font-mono">{row.zoneId}</span>
        ),
      },
      {
        key: 'runtimeHours',
        header: 'Runtime',
        sortable: true,
        render: (row: Equipment) => (
          <span className="text-xs text-gray-300 font-mono">{formatRuntime(row.runtimeHours)}</span>
        ),
      },
      {
        key: 'lastMaintenance',
        header: 'Last Maintenance',
        sortable: false,
        render: (row: Equipment) => (
          <span className="text-xs text-gray-500 font-mono">
            {format(getLastMaintenance(row.id), 'dd MMM yyyy')}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Equipment Status</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {equipment.length} assets across {plants.length} plants
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="success" dot>{counts.running} Running</Badge>
          <Badge variant="neutral">{counts.stopped} Stopped</Badge>
          <Badge variant="danger" dot pulse>{counts.fault} Fault</Badge>
          <Badge variant="info">{counts.maintenance} Maint.</Badge>
          <Badge variant="warning">{counts.standby} Standby</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Search equipment..."
              icon={<Search className="w-4 h-4" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-44">
            <Select
              label="State"
              value={stateFilter}
              onChange={setStateFilter}
              options={[
                { value: 'all', label: 'All States' },
                { value: 'running', label: 'Running' },
                { value: 'stopped', label: 'Stopped' },
                { value: 'fault', label: 'Fault' },
                { value: 'maintenance', label: 'Maintenance' },
                { value: 'standby', label: 'Standby' },
              ]}
            />
          </div>
          <div className="w-44">
            <Select
              label="Type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: 'all', label: 'All Types' },
                ...equipmentTypes.map((t) => ({ value: t, label: t })),
              ]}
            />
          </div>
          <div className="w-52">
            <Select
              label="Plant"
              value={plantFilter}
              onChange={setPlantFilter}
              options={[
                { value: 'all', label: 'All Plants' },
                ...plants.map((p) => ({ value: p.id, label: p.name })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card
        title="Equipment Inventory"
        subtitle={`Showing ${filtered.length} of ${equipment.length} assets`}
        noPadding
      >
        <Table<Equipment>
          columns={columns}
          data={filtered}
          emptyMessage="No equipment matches your filters"
        />
      </Card>
    </div>
  );
}
