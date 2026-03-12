import type { Equipment } from '@/types/equipment';
import { EquipmentType, EquipmentState } from '@/types/equipment';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_EQUIPMENT: Equipment[] = [
  {
    id: 'eq-001', name: 'Feed Pump P-101', code: 'P-101',
    description: 'Centrifugal feed pump for raw material transfer',
    type: EquipmentType.Pump, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-001', processCellId: 'cell-001',
    tagIds: ['tag-ft-101', 'tag-pt-101', 'tag-et-101', 'tag-st-101'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Grundfos', model: 'CR 32-2', serialNumber: 'GF-2024-78451',
      installDate: '2025-03-15', ratedCapacity: '200 L/min', ratedPower: '15 kW',
      operatingPressure: '6 bar', material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2026-01-20', nextMaintenanceDate: '2026-04-20',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 8450, meanTimeBetweenFailures: 4200,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-002', name: 'Mixer M-101', code: 'M-101',
    description: 'High-shear mixer for raw material blending',
    type: EquipmentType.Mixer, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-001', processCellId: 'cell-001',
    tagIds: ['tag-st-201', 'tag-et-102', 'tag-tt-101'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Silverson', model: 'FX-60', serialNumber: 'SV-2024-11203',
      installDate: '2025-03-15', ratedPower: '22 kW',
      material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2026-02-10', nextMaintenanceDate: '2026-05-10',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 6230, meanTimeBetweenFailures: 5100,
    },
    documentUrls: [], isInterlocked: true, isCritical: false,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-003', name: 'Control Valve XV-101', code: 'XV-101',
    description: 'Pneumatic control valve for feed flow regulation',
    type: EquipmentType.Valve, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-001', processCellId: 'cell-001',
    tagIds: ['tag-vt-101', 'tag-ft-101'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Fisher', model: 'V250', serialNumber: 'FS-2024-44781',
      installDate: '2025-03-15', ratedCapacity: '250 L/min',
      operatingPressure: '10 bar', material: 'SS316',
    },
    maintenance: {
      lastMaintenanceDate: '2025-12-01', nextMaintenanceDate: '2026-06-01',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 8400,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-004', name: 'Agitator AG-101', code: 'AG-101',
    description: 'Agitator for holding tank homogenisation',
    type: EquipmentType.Agitator, state: EquipmentState.Standby,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-001', processCellId: 'cell-002',
    tagIds: ['tag-st-101'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Lightnin', model: 'A310', serialNumber: 'LN-2025-00891',
      installDate: '2025-04-01', ratedPower: '7.5 kW',
      material: 'SS304',
    },
    maintenance: {
      lastMaintenanceDate: '2026-01-05', nextMaintenanceDate: '2026-07-05',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 5120,
    },
    documentUrls: [], isInterlocked: false, isCritical: false,
    createdAt: '2025-04-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-005', name: 'Transfer Pump P-102', code: 'P-102',
    description: 'Positive displacement pump for viscous material transfer',
    type: EquipmentType.Pump, state: EquipmentState.Stopped,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-001', processCellId: 'cell-002',
    tagIds: ['tag-ft-102', 'tag-pt-102'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Mono Pumps', model: 'CB12', serialNumber: 'MN-2025-33291',
      installDate: '2025-04-01', ratedCapacity: '100 L/min', ratedPower: '11 kW',
      operatingPressure: '8 bar', material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2026-02-28', nextMaintenanceDate: '2026-05-28',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 4890, meanTimeBetweenFailures: 3800,
    },
    documentUrls: [], isInterlocked: true, isCritical: false,
    createdAt: '2025-04-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-006', name: 'Reactor R-201', code: 'R-201',
    description: 'Jacketed stirred tank reactor for batch synthesis',
    type: EquipmentType.Reactor, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-002', processCellId: 'cell-003',
    tagIds: ['tag-tt-201', 'tag-pt-201', 'tag-lt-201', 'tag-at-101', 'tag-ct-101'],
    childEquipmentIds: ['eq-007'],
    specs: {
      manufacturer: 'De Dietrich', model: 'AE-4000', serialNumber: 'DD-2024-09123',
      installDate: '2025-02-01', ratedCapacity: '4000 L',
      operatingPressure: '6 bar', operatingTemperature: '200 degC',
      material: 'Glass-lined steel', weight: '5200 kg',
    },
    maintenance: {
      lastMaintenanceDate: '2025-11-15', nextMaintenanceDate: '2026-05-15',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 7200, meanTimeBetweenFailures: 8500,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-007', name: 'Reactor Agitator AG-201', code: 'AG-201',
    description: 'Reactor agitator with variable speed drive',
    type: EquipmentType.Agitator, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-002', processCellId: 'cell-003',
    tagIds: ['tag-st-201'],
    parentEquipmentId: 'eq-006',
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Ekato', model: 'HWL-3045', serialNumber: 'EK-2024-61002',
      installDate: '2025-02-01', ratedPower: '30 kW',
      material: 'Hastelloy C-276',
    },
    maintenance: {
      lastMaintenanceDate: '2025-11-15', nextMaintenanceDate: '2026-05-15',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 7200,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-008', name: 'Heat Exchanger HX-201', code: 'HX-201',
    description: 'Shell and tube heat exchanger for reactor cooling',
    type: EquipmentType.HeatExchanger, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-002', processCellId: 'cell-003',
    tagIds: ['tag-tt-102', 'tag-tt-103', 'tag-ft-201'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Alfa Laval', model: 'M10-BFG', serialNumber: 'AL-2024-88234',
      installDate: '2025-02-01', ratedCapacity: '500 kW',
      operatingPressure: '10 bar', operatingTemperature: '180 degC',
      material: 'SS316L / Titanium',
    },
    maintenance: {
      lastMaintenanceDate: '2025-12-20', nextMaintenanceDate: '2026-06-20',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 7100,
    },
    documentUrls: [], isInterlocked: false, isCritical: true,
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-009', name: 'Condenser E-201', code: 'E-201',
    description: 'Reflux condenser for reactor vapour recovery',
    type: EquipmentType.HeatExchanger, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-002', processCellId: 'cell-003',
    tagIds: ['tag-tt-103'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Alfa Laval', model: 'T5-BFG', serialNumber: 'AL-2024-88301',
      installDate: '2025-02-01', ratedCapacity: '200 kW',
      operatingPressure: '4 bar', material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2025-12-20', nextMaintenanceDate: '2026-06-20',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 7100,
    },
    documentUrls: [], isInterlocked: false, isCritical: false,
    createdAt: '2025-02-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-010', name: 'Distillation Column C-301', code: 'C-301',
    description: 'Packed distillation column for product purification',
    type: EquipmentType.DistillationColumn, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-003', processCellId: 'cell-004',
    tagIds: ['tag-tt-103', 'tag-pt-301', 'tag-lt-102'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Koch-Glitsch', model: 'FLEXIPAC 2Y', serialNumber: 'KG-2024-55102',
      installDate: '2025-02-15', ratedCapacity: '2000 kg/h',
      operatingPressure: '3 bar', operatingTemperature: '160 degC',
      material: 'SS316L', weight: '8500 kg',
    },
    maintenance: {
      lastMaintenanceDate: '2025-09-01', nextMaintenanceDate: '2026-03-01',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 6800,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-02-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-011', name: 'Reboiler E-301', code: 'E-301',
    description: 'Column reboiler for distillation heat input',
    type: EquipmentType.HeatExchanger, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-003', processCellId: 'cell-004',
    tagIds: ['tag-tt-103'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Alfa Laval', model: 'M15-BFG', serialNumber: 'AL-2024-88402',
      installDate: '2025-02-15', ratedCapacity: '800 kW',
      operatingPressure: '6 bar', material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2025-10-15', nextMaintenanceDate: '2026-04-15',
      maintenanceCycle: 6, maintenanceCycleUnit: 'months',
      totalRunHours: 6800,
    },
    documentUrls: [], isInterlocked: false, isCritical: true,
    createdAt: '2025-02-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-012', name: 'Product Filter F-301', code: 'F-301',
    description: 'Pressure leaf filter for final product filtration',
    type: EquipmentType.Filter, state: EquipmentState.Standby,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-003', processCellId: 'cell-004',
    tagIds: ['tag-pt-301'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Sparkler', model: 'HV-18/48', serialNumber: 'SP-2025-12890',
      installDate: '2025-02-15', ratedCapacity: '500 L/batch',
      operatingPressure: '6 bar', material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2026-01-10', nextMaintenanceDate: '2026-04-10',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 3200,
    },
    documentUrls: [], isInterlocked: false, isCritical: false,
    createdAt: '2025-02-15T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-013', name: 'Compressor K-101', code: 'K-101',
    description: 'Instrument air compressor',
    type: EquipmentType.Compressor, state: EquipmentState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-001',
    tagIds: ['tag-pt-102', 'tag-et-101'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Atlas Copco', model: 'GA 45+', serialNumber: 'AC-2025-67012',
      installDate: '2025-01-20', ratedCapacity: '7.6 m3/min', ratedPower: '45 kW',
      operatingPressure: '10 bar',
    },
    maintenance: {
      lastMaintenanceDate: '2026-02-01', nextMaintenanceDate: '2026-05-01',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 9200, meanTimeBetweenFailures: 6000,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-01-20T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-014', name: 'Fermentor FR-501', code: 'FR-501',
    description: '10,000 L stainless steel bioreactor for fermentation',
    type: EquipmentType.Fermentor, state: EquipmentState.Maintenance,
    plantId: 'plant-002', productionLineId: 'line-003', processZoneId: 'zone-005',
    tagIds: ['tag-tt-201', 'tag-at-102', 'tag-lt-201'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Sartorius', model: 'BIOSTAT D-DCU', serialNumber: 'SA-2025-11782',
      installDate: '2025-06-01', ratedCapacity: '10000 L',
      operatingPressure: '2.5 bar', operatingTemperature: '45 degC',
      material: 'SS316L', weight: '3800 kg',
    },
    maintenance: {
      lastMaintenanceDate: '2026-03-05', nextMaintenanceDate: '2026-06-05',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 4100,
    },
    documentUrls: [], isInterlocked: true, isCritical: true,
    createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
  {
    id: 'eq-015', name: 'Centrifuge CF-501', code: 'CF-501',
    description: 'Disc stack centrifuge for cell separation',
    type: EquipmentType.Centrifuge, state: EquipmentState.Stopped,
    plantId: 'plant-002', productionLineId: 'line-003', processZoneId: 'zone-005',
    tagIds: ['tag-st-201', 'tag-ft-201'],
    childEquipmentIds: [],
    specs: {
      manufacturer: 'Alfa Laval', model: 'BTPX 305', serialNumber: 'AL-2025-44591',
      installDate: '2025-06-01', ratedCapacity: '5000 L/h', ratedPower: '18.5 kW',
      material: 'SS316L',
    },
    maintenance: {
      lastMaintenanceDate: '2026-02-15', nextMaintenanceDate: '2026-05-15',
      maintenanceCycle: 3, maintenanceCycleUnit: 'months',
      totalRunHours: 3600,
    },
    documentUrls: [], isInterlocked: true, isCritical: false,
    createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-03-10T14:30:00Z',
  },
];

export async function getEquipment(params?: PaginationParams & { plantId?: string; processZoneId?: string; type?: EquipmentType; state?: EquipmentState }): Promise<PaginatedResponse<Equipment>> {
  await delay(350);
  let filtered = [...MOCK_EQUIPMENT];
  if (params?.plantId) {
    filtered = filtered.filter((e) => e.plantId === params.plantId);
  }
  if (params?.processZoneId) {
    filtered = filtered.filter((e) => e.processZoneId === params.processZoneId);
  }
  if (params?.type) {
    filtered = filtered.filter((e) => e.type === params.type);
  }
  if (params?.state) {
    filtered = filtered.filter((e) => e.state === params.state);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((e) =>
      e.name.toLowerCase().includes(s) || e.code.toLowerCase().includes(s) || e.description.toLowerCase().includes(s),
    );
  }
  return {
    data: filtered,
    message: 'Equipment retrieved successfully',
    success: true,
    total: filtered.length,
    page: params?.page ?? 1,
    limit: params?.limit ?? 20,
    totalPages: 1,
  };
}

export async function getEquipmentById(equipmentId: string): Promise<ApiResponse<Equipment>> {
  await delay(250);
  const equipment = MOCK_EQUIPMENT.find((e) => e.id === equipmentId);
  if (!equipment) {
    throw new Error(`Equipment ${equipmentId} not found`);
  }
  return { data: equipment, message: 'Equipment retrieved successfully', success: true };
}

export async function getEquipmentByPlant(plantId: string): Promise<ApiResponse<Equipment[]>> {
  await delay(300);
  const equipment = MOCK_EQUIPMENT.filter((e) => e.plantId === plantId);
  return { data: equipment, message: 'Equipment retrieved successfully', success: true };
}

export async function getEquipmentByZone(zoneId: string): Promise<ApiResponse<Equipment[]>> {
  await delay(250);
  const equipment = MOCK_EQUIPMENT.filter((e) => e.processZoneId === zoneId);
  return { data: equipment, message: 'Equipment retrieved successfully', success: true };
}
