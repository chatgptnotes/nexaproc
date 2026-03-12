import type { Plant, ProductionLine, ProcessZone, ProcessCell } from '@/types/plant';
import { PlantStatus, LineStatus, ZoneStatus, CellStatus } from '@/types/plant';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_PROCESS_CELLS: ProcessCell[] = [
  {
    id: 'cell-001', processZoneId: 'zone-001', name: 'Mixing Cell A', code: 'MIX-A',
    description: 'Primary mixing and blending cell', status: CellStatus.Active,
    equipmentIds: ['eq-001', 'eq-002', 'eq-003'],
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'cell-002', processZoneId: 'zone-001', name: 'Mixing Cell B', code: 'MIX-B',
    description: 'Secondary mixing and blending cell', status: CellStatus.Idle,
    equipmentIds: ['eq-004', 'eq-005'],
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'cell-003', processZoneId: 'zone-002', name: 'Reactor Cell 1', code: 'RXN-1',
    description: 'Primary reactor for batch processing', status: CellStatus.Active,
    equipmentIds: ['eq-006', 'eq-007', 'eq-008', 'eq-009'],
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'cell-004', processZoneId: 'zone-003', name: 'Distillation Cell', code: 'DIST-1',
    description: 'Distillation and purification cell', status: CellStatus.Active,
    equipmentIds: ['eq-010', 'eq-011', 'eq-012'],
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
];

const MOCK_PROCESS_ZONES: ProcessZone[] = [
  {
    id: 'zone-001', productionLineId: 'line-001', name: 'Raw Material Preparation', code: 'RMP',
    description: 'Weighing, mixing, and preparation of raw materials', status: ZoneStatus.Active,
    processCells: MOCK_PROCESS_CELLS.filter((c) => c.processZoneId === 'zone-001'),
    equipmentCount: 12, tagCount: 48,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'zone-002', productionLineId: 'line-001', name: 'Reaction Zone A', code: 'RXA',
    description: 'Primary chemical reaction and synthesis', status: ZoneStatus.Active,
    processCells: MOCK_PROCESS_CELLS.filter((c) => c.processZoneId === 'zone-002'),
    equipmentCount: 18, tagCount: 92,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'zone-003', productionLineId: 'line-001', name: 'Separation & Purification', code: 'SEP',
    description: 'Distillation, filtration, and product purification', status: ZoneStatus.Active,
    processCells: MOCK_PROCESS_CELLS.filter((c) => c.processZoneId === 'zone-003'),
    equipmentCount: 15, tagCount: 64,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'zone-004', productionLineId: 'line-002', name: 'Packaging Zone', code: 'PKG',
    description: 'Product filling, labelling, and palletisation', status: ZoneStatus.Active,
    processCells: [],
    equipmentCount: 22, tagCount: 78,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'zone-005', productionLineId: 'line-003', name: 'Fermentation', code: 'FRM',
    description: 'Fermentation and bio-processing zone', status: ZoneStatus.Idle,
    processCells: [],
    equipmentCount: 10, tagCount: 55,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
];

const MOCK_LINES: ProductionLine[] = [
  {
    id: 'line-001', plantId: 'plant-001', name: 'Chemical Processing Line 1', code: 'CPL-1',
    description: 'Primary chemical synthesis and processing line',
    status: LineStatus.Running,
    processZones: MOCK_PROCESS_ZONES.filter((z) => z.productionLineId === 'line-001'),
    currentProduct: 'Polymer Grade A', throughput: 1250, throughputUnit: 'kg/h', targetThroughput: 1500,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'line-002', plantId: 'plant-001', name: 'Packaging Line 1', code: 'PKG-1',
    description: 'Automated packaging and palletisation line',
    status: LineStatus.Running,
    processZones: MOCK_PROCESS_ZONES.filter((z) => z.productionLineId === 'line-002'),
    currentProduct: 'Polymer Grade A — 25 kg bags', throughput: 800, throughputUnit: 'units/h', targetThroughput: 1000,
    createdAt: '2025-01-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'line-003', plantId: 'plant-002', name: 'Bioprocess Line 1', code: 'BIO-1',
    description: 'Fermentation and bioproduct processing',
    status: LineStatus.Changeover,
    processZones: MOCK_PROCESS_ZONES.filter((z) => z.productionLineId === 'line-003'),
    currentProduct: 'Enzyme Batch B-412', throughput: 0, throughputUnit: 'L/h', targetThroughput: 500,
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
];

const MOCK_PLANTS: Plant[] = [
  {
    id: 'plant-001',
    name: 'Primary Processing Plant',
    code: 'PPP',
    description: 'Main chemical processing and manufacturing facility with two production lines',
    status: PlantStatus.Online,
    location: {
      latitude: -26.2041,
      longitude: 28.0473,
      address: '42 Industrial Road, Kempton Park',
      city: 'Johannesburg',
      country: 'South Africa',
    },
    timezone: 'Africa/Johannesburg',
    productionLines: MOCK_LINES.filter((l) => l.plantId === 'plant-001'),
    totalEquipment: 67,
    activeAlarms: 4,
    oee: 82.5,
    createdAt: '2025-01-15T08:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'plant-002',
    name: 'Bioprocessing Facility',
    code: 'BPF',
    description: 'Biotechnology and fermentation processing facility',
    status: PlantStatus.Online,
    location: {
      latitude: -33.9249,
      longitude: 18.4241,
      address: '15 Innovation Drive, Bellville',
      city: 'Cape Town',
      country: 'South Africa',
    },
    timezone: 'Africa/Johannesburg',
    productionLines: MOCK_LINES.filter((l) => l.plantId === 'plant-002'),
    totalEquipment: 35,
    activeAlarms: 1,
    oee: 76.8,
    createdAt: '2025-02-01T08:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'plant-003',
    name: 'Water Treatment Works',
    code: 'WTW',
    description: 'Municipal water treatment and distribution facility',
    status: PlantStatus.Degraded,
    location: {
      latitude: -25.7479,
      longitude: 28.2293,
      address: '8 Waterfront Road, Centurion',
      city: 'Pretoria',
      country: 'South Africa',
    },
    timezone: 'Africa/Johannesburg',
    productionLines: [],
    totalEquipment: 42,
    activeAlarms: 7,
    oee: 68.2,
    createdAt: '2025-03-10T08:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
  },
];

export async function getPlants(_params?: PaginationParams): Promise<PaginatedResponse<Plant>> {
  await delay(350);
  return {
    data: MOCK_PLANTS,
    message: 'Plants retrieved successfully',
    success: true,
    total: MOCK_PLANTS.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function getPlantById(plantId: string): Promise<ApiResponse<Plant>> {
  await delay(250);
  const plant = MOCK_PLANTS.find((p) => p.id === plantId);
  if (!plant) {
    throw new Error(`Plant ${plantId} not found`);
  }
  return { data: plant, message: 'Plant retrieved successfully', success: true };
}

export async function getProductionLines(plantId: string): Promise<ApiResponse<ProductionLine[]>> {
  await delay(250);
  const lines = MOCK_LINES.filter((l) => l.plantId === plantId);
  return { data: lines, message: 'Production lines retrieved successfully', success: true };
}

export async function getProcessZones(lineId: string): Promise<ApiResponse<ProcessZone[]>> {
  await delay(200);
  const zones = MOCK_PROCESS_ZONES.filter((z) => z.productionLineId === lineId);
  return { data: zones, message: 'Process zones retrieved successfully', success: true };
}

export async function getProcessCells(zoneId: string): Promise<ApiResponse<ProcessCell[]>> {
  await delay(200);
  const cells = MOCK_PROCESS_CELLS.filter((c) => c.processZoneId === zoneId);
  return { data: cells, message: 'Process cells retrieved successfully', success: true };
}
