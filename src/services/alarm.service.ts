import type { Alarm, AlarmConfig, AlarmSummary } from '@/types/alarm';
import { AlarmPriority, AlarmState, AlarmType } from '@/types/alarm';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_ALARMS: Alarm[] = [
  {
    id: 'alarm-001',
    tagId: 'tag-tt-103', tagName: 'TT-103',
    equipmentId: 'eq-008', equipmentName: 'Heat Exchanger HX-201',
    plantId: 'plant-001', plantName: 'Primary Processing Plant',
    processZoneId: 'zone-002', processZoneName: 'Reaction Zone A',
    alarmType: AlarmType.High, priority: AlarmPriority.High,
    state: AlarmState.Active,
    message: 'TT-103 High Temperature Alarm',
    description: 'Heat exchanger outlet temperature exceeds high limit of 130 degC',
    value: 132.4, limit: 130.0, engineeringUnit: 'degC',
    activatedAt: '2026-03-12T08:42:15Z',
    occurrenceCount: 1, isInhibited: false,
    createdAt: '2026-03-12T08:42:15Z', updatedAt: '2026-03-12T08:42:15Z',
  },
  {
    id: 'alarm-002',
    tagId: 'tag-pt-301', tagName: 'PT-301',
    equipmentId: 'eq-010', equipmentName: 'Distillation Column C-301',
    plantId: 'plant-001', plantName: 'Primary Processing Plant',
    processZoneId: 'zone-003', processZoneName: 'Separation & Purification',
    alarmType: AlarmType.HighHigh, priority: AlarmPriority.Critical,
    state: AlarmState.Active,
    message: 'PT-301 High-High Pressure Alarm',
    description: 'Column pressure exceeds high-high limit of 4.5 bar',
    value: 4.8, limit: 4.5, engineeringUnit: 'bar',
    activatedAt: '2026-03-12T09:15:02Z',
    occurrenceCount: 1, isInhibited: false,
    createdAt: '2026-03-12T09:15:02Z', updatedAt: '2026-03-12T09:15:02Z',
  },
  {
    id: 'alarm-003',
    tagId: 'tag-lt-101', tagName: 'LT-101',
    plantId: 'plant-001', plantName: 'Primary Processing Plant',
    processZoneId: 'zone-001', processZoneName: 'Raw Material Preparation',
    alarmType: AlarmType.Low, priority: AlarmPriority.Medium,
    state: AlarmState.Acknowledged,
    message: 'LT-101 Low Level Alarm',
    description: 'Feed tank level below low limit of 20%',
    value: 18.5, limit: 20.0, engineeringUnit: '%',
    activatedAt: '2026-03-12T07:30:00Z',
    acknowledgedAt: '2026-03-12T07:35:22Z', acknowledgedBy: 'Carlos Rivera',
    occurrenceCount: 3, isInhibited: false,
    createdAt: '2026-03-12T07:30:00Z', updatedAt: '2026-03-12T07:35:22Z',
  },
  {
    id: 'alarm-004',
    tagId: 'tag-ft-101', tagName: 'FT-101',
    equipmentId: 'eq-001', equipmentName: 'Feed Pump P-101',
    plantId: 'plant-001', plantName: 'Primary Processing Plant',
    processZoneId: 'zone-001', processZoneName: 'Raw Material Preparation',
    alarmType: AlarmType.Deviation, priority: AlarmPriority.Low,
    state: AlarmState.Active,
    message: 'FT-101 Flow Deviation',
    description: 'Feed flow deviates more than 15% from setpoint',
    value: 125.0, limit: 150.0, engineeringUnit: 'L/min',
    activatedAt: '2026-03-12T10:05:30Z',
    occurrenceCount: 1, isInhibited: false,
    createdAt: '2026-03-12T10:05:30Z', updatedAt: '2026-03-12T10:05:30Z',
  },
  {
    id: 'alarm-005',
    tagId: 'tag-at-101', tagName: 'AT-101',
    equipmentId: 'eq-006', equipmentName: 'Reactor R-201',
    plantId: 'plant-001', plantName: 'Primary Processing Plant',
    processZoneId: 'zone-002', processZoneName: 'Reaction Zone A',
    alarmType: AlarmType.High, priority: AlarmPriority.High,
    state: AlarmState.Active,
    message: 'AT-101 pH High Alarm',
    description: 'Reactor pH above high limit of 8.0',
    value: 8.3, limit: 8.0, engineeringUnit: 'pH',
    activatedAt: '2026-03-12T09:48:12Z',
    occurrenceCount: 2, isInhibited: false,
    createdAt: '2026-03-12T09:48:12Z', updatedAt: '2026-03-12T09:48:12Z',
  },
  {
    id: 'alarm-006',
    tagId: 'tag-et-102', tagName: 'ET-102',
    equipmentId: 'eq-002', equipmentName: 'Mixer M-101',
    plantId: 'plant-001', plantName: 'Primary Processing Plant',
    processZoneId: 'zone-001', processZoneName: 'Raw Material Preparation',
    alarmType: AlarmType.High, priority: AlarmPriority.Medium,
    state: AlarmState.Shelved,
    message: 'ET-102 Power Consumption High',
    description: 'Mixer power consumption above normal operating range',
    value: 135.0, limit: 130.0, engineeringUnit: 'kW',
    activatedAt: '2026-03-12T06:20:00Z',
    shelvedAt: '2026-03-12T06:25:00Z', shelvedBy: 'James Miller',
    shelvedUntil: '2026-03-12T18:25:00Z',
    occurrenceCount: 5, isInhibited: false,
    createdAt: '2026-03-12T06:20:00Z', updatedAt: '2026-03-12T06:25:00Z',
  },
  {
    id: 'alarm-007',
    tagId: 'tag-at-102', tagName: 'AT-102',
    equipmentId: 'eq-014', equipmentName: 'Fermentor FR-501',
    plantId: 'plant-002', plantName: 'Bioprocessing Facility',
    processZoneId: 'zone-005', processZoneName: 'Fermentation',
    alarmType: AlarmType.Low, priority: AlarmPriority.High,
    state: AlarmState.Active,
    message: 'AT-102 pH Low Alarm',
    description: 'Fermentor pH below low limit of 6.5',
    value: 6.3, limit: 6.5, engineeringUnit: 'pH',
    activatedAt: '2026-03-12T10:12:45Z',
    occurrenceCount: 1, isInhibited: false,
    createdAt: '2026-03-12T10:12:45Z', updatedAt: '2026-03-12T10:12:45Z',
  },
];

const MOCK_ALARM_CONFIGS: AlarmConfig[] = [
  {
    id: 'aconfig-001', tagId: 'tag-tt-103', tagName: 'TT-103',
    alarmType: AlarmType.High, priority: AlarmPriority.High,
    enabled: true, limit: 130, deadband: 2, delay: 5,
    message: 'TT-103 High Temperature Alarm',
    description: 'Heat exchanger outlet temperature high',
    consequenceDescription: 'Potential product degradation and equipment damage',
    correctionAction: 'Check cooling water flow and heat exchanger fouling. Reduce feed rate if necessary.',
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'aconfig-002', tagId: 'tag-tt-103', tagName: 'TT-103',
    alarmType: AlarmType.HighHigh, priority: AlarmPriority.Critical,
    enabled: true, limit: 150, deadband: 2, delay: 0,
    message: 'TT-103 High-High Temperature Alarm — Emergency',
    description: 'Heat exchanger outlet temperature critically high',
    consequenceDescription: 'Immediate risk of equipment failure and product loss',
    correctionAction: 'Initiate emergency shutdown. Isolate heat source. Notify supervisor immediately.',
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'aconfig-003', tagId: 'tag-pt-301', tagName: 'PT-301',
    alarmType: AlarmType.HighHigh, priority: AlarmPriority.Critical,
    enabled: true, limit: 4.5, deadband: 0.1, delay: 0,
    message: 'PT-301 High-High Pressure Alarm',
    description: 'Distillation column pressure critically high',
    consequenceDescription: 'Risk of pressure relief valve activation and potential vessel damage',
    correctionAction: 'Check column vent line. Reduce reboiler duty. Prepare for emergency depressurisation.',
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'aconfig-004', tagId: 'tag-lt-101', tagName: 'LT-101',
    alarmType: AlarmType.Low, priority: AlarmPriority.Medium,
    enabled: true, limit: 20, deadband: 2, delay: 10,
    message: 'LT-101 Low Level Alarm',
    description: 'Feed tank level low',
    consequenceDescription: 'Risk of pump cavitation and production interruption',
    correctionAction: 'Check raw material supply. Verify level transmitter calibration.',
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
];

export async function getActiveAlarms(params?: PaginationParams & { plantId?: string; priority?: AlarmPriority }): Promise<PaginatedResponse<Alarm>> {
  await delay(300);
  let filtered = MOCK_ALARMS.filter((a) => a.state !== AlarmState.Cleared);
  if (params?.plantId) {
    filtered = filtered.filter((a) => a.plantId === params.plantId);
  }
  if (params?.priority) {
    filtered = filtered.filter((a) => a.priority === params.priority);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((a) =>
      a.tagName.toLowerCase().includes(s) || a.message.toLowerCase().includes(s),
    );
  }
  return {
    data: filtered,
    message: 'Active alarms retrieved successfully',
    success: true,
    total: filtered.length,
    page: 1,
    limit: 50,
    totalPages: 1,
  };
}

export async function getAlarmHistory(params?: PaginationParams & { plantId?: string; from?: string; to?: string }): Promise<PaginatedResponse<Alarm>> {
  await delay(400);
  let filtered = [...MOCK_ALARMS];
  if (params?.plantId) {
    filtered = filtered.filter((a) => a.plantId === params.plantId);
  }
  return {
    data: filtered,
    message: 'Alarm history retrieved successfully',
    success: true,
    total: filtered.length,
    page: 1,
    limit: 50,
    totalPages: 1,
  };
}

export async function getAlarmSummary(plantId?: string): Promise<ApiResponse<AlarmSummary>> {
  await delay(200);
  const alarms = plantId ? MOCK_ALARMS.filter((a) => a.plantId === plantId) : MOCK_ALARMS;
  const active = alarms.filter((a) => a.state !== AlarmState.Cleared);
  const summary: AlarmSummary = {
    critical: active.filter((a) => a.priority === AlarmPriority.Critical).length,
    high: active.filter((a) => a.priority === AlarmPriority.High).length,
    medium: active.filter((a) => a.priority === AlarmPriority.Medium).length,
    low: active.filter((a) => a.priority === AlarmPriority.Low).length,
    total: active.length,
    unacknowledged: active.filter((a) => a.state === AlarmState.Active).length,
    shelved: active.filter((a) => a.state === AlarmState.Shelved).length,
  };
  return { data: summary, message: 'Alarm summary retrieved', success: true };
}

export async function acknowledgeAlarm(alarmId: string, userId: string): Promise<ApiResponse<Alarm>> {
  await delay(200);
  const alarm = MOCK_ALARMS.find((a) => a.id === alarmId);
  if (!alarm) throw new Error(`Alarm ${alarmId} not found`);
  const now = new Date().toISOString();
  const updated = { ...alarm, state: AlarmState.Acknowledged, acknowledgedAt: now, acknowledgedBy: userId, updatedAt: now };
  return { data: updated, message: 'Alarm acknowledged', success: true };
}

export async function getAlarmConfigs(params?: PaginationParams): Promise<PaginatedResponse<AlarmConfig>> {
  await delay(350);
  let filtered = [...MOCK_ALARM_CONFIGS];
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((c) =>
      c.tagName.toLowerCase().includes(s) || c.message.toLowerCase().includes(s),
    );
  }
  return {
    data: filtered,
    message: 'Alarm configurations retrieved successfully',
    success: true,
    total: filtered.length,
    page: 1,
    limit: 50,
    totalPages: 1,
  };
}
