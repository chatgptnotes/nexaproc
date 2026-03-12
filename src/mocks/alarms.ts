export type AlarmPriority = 'critical' | 'high' | 'medium' | 'low';
export type AlarmState = 'active' | 'acknowledged' | 'cleared';

export interface Alarm {
  id: string;
  tagId: string;
  priority: AlarmPriority;
  state: AlarmState;
  description: string;
  area: string;
  plantId: string;
  timestamp: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  clearedAt?: string;
  value?: number;
  limit?: number;
  engineeringUnit?: string;
}

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

export const alarms: Alarm[] = [
  // ===== CRITICAL (3) =====
  {
    id: 'ALM-001',
    tagId: 'TT-302',
    priority: 'critical',
    state: 'active',
    description: 'Autoclave AC-201 Chamber Temperature Exceeded HIHI Limit',
    area: 'Sterilization',
    plantId: 'plant-001',
    timestamp: minutesAgo(3),
    value: 131.8,
    limit: 130,
    engineeringUnit: '°C',
  },
  {
    id: 'ALM-002',
    tagId: 'ST-603',
    priority: 'critical',
    state: 'active',
    description: 'Air-Jet Loom AJL-103 Emergency Shutdown Activated — Zero Speed Detected',
    area: 'Loom Floor',
    plantId: 'plant-003',
    timestamp: minutesAgo(8),
    value: 0,
    limit: 100,
    engineeringUnit: 'picks/min',
  },
  {
    id: 'ALM-003',
    tagId: 'PT-401',
    priority: 'critical',
    state: 'acknowledged',
    description: 'Homogenizer H-101 First Stage Pressure HIHI — Possible Blockage',
    area: 'Reception & Pasteurization',
    plantId: 'plant-002',
    timestamp: minutesAgo(15),
    acknowledgedAt: minutesAgo(12),
    acknowledgedBy: 'ops_johnson',
    value: 252.4,
    limit: 250,
    engineeringUnit: 'bar',
  },

  // ===== HIGH (5) =====
  {
    id: 'ALM-004',
    tagId: 'TT-101',
    priority: 'high',
    state: 'active',
    description: 'Granulator Jacket Temperature HI Alarm',
    area: 'Granulation',
    plantId: 'plant-001',
    timestamp: minutesAgo(5),
    value: 66.2,
    limit: 65,
    engineeringUnit: '°C',
  },
  {
    id: 'ALM-005',
    tagId: 'PT-302',
    priority: 'high',
    state: 'active',
    description: 'Autoclave AC-201 Chamber Pressure HI Alarm',
    area: 'Sterilization',
    plantId: 'plant-001',
    timestamp: minutesAgo(4),
    value: 2.25,
    limit: 2.2,
    engineeringUnit: 'bar',
  },
  {
    id: 'ALM-006',
    tagId: 'AT-101',
    priority: 'high',
    state: 'acknowledged',
    description: 'Fermentation Vessel FV-101 pH HI Alarm — Culture Deviation',
    area: 'Fermentation',
    plantId: 'plant-002',
    timestamp: minutesAgo(22),
    acknowledgedAt: minutesAgo(18),
    acknowledgedBy: 'ops_martinez',
    value: 5.1,
    limit: 5.0,
    engineeringUnit: 'pH',
  },
  {
    id: 'ALM-007',
    tagId: 'TT-701',
    priority: 'high',
    state: 'active',
    description: 'Jet Dyeing Machine JD-201 Temperature Signal Uncertain',
    area: 'Dyeing',
    plantId: 'plant-003',
    timestamp: minutesAgo(12),
    value: 95.6,
    engineeringUnit: '°C',
  },
  {
    id: 'ALM-008',
    tagId: 'FT-501',
    priority: 'high',
    state: 'cleared',
    description: 'Bottling Line Fill Rate HI Alarm — Overspeed',
    area: 'Carbonation & Filling',
    plantId: 'plant-002',
    timestamp: minutesAgo(45),
    acknowledgedAt: minutesAgo(42),
    acknowledgedBy: 'ops_chen',
    clearedAt: minutesAgo(30),
    value: 660,
    limit: 650,
    engineeringUnit: 'bottles/min',
  },

  // ===== MEDIUM (7) =====
  {
    id: 'ALM-009',
    tagId: 'LT-301',
    priority: 'medium',
    state: 'active',
    description: 'Mixing Vessel MV-101 Level HI Warning',
    area: 'Preparation',
    plantId: 'plant-001',
    timestamp: minutesAgo(10),
    value: 88.5,
    limit: 90,
    engineeringUnit: '%',
  },
  {
    id: 'ALM-010',
    tagId: 'TT-403',
    priority: 'medium',
    state: 'active',
    description: 'Fermentation Vessel FV-101 Temperature HI Warning',
    area: 'Fermentation',
    plantId: 'plant-002',
    timestamp: minutesAgo(18),
    value: 45.8,
    limit: 46,
    engineeringUnit: '°C',
  },
  {
    id: 'ALM-011',
    tagId: 'LT-501',
    priority: 'medium',
    state: 'acknowledged',
    description: 'Blending Tank BT-201 Level LO Warning — Refill Required',
    area: 'Syrup Preparation',
    plantId: 'plant-002',
    timestamp: minutesAgo(35),
    acknowledgedAt: minutesAgo(32),
    acknowledgedBy: 'ops_martinez',
    value: 12.3,
    limit: 10,
    engineeringUnit: '%',
  },
  {
    id: 'ALM-012',
    tagId: 'WT-102',
    priority: 'medium',
    state: 'active',
    description: 'Tablet Weight Deviation — Approaching HI Limit',
    area: 'Compression',
    plantId: 'plant-001',
    timestamp: minutesAgo(7),
    value: 208.7,
    limit: 210,
    engineeringUnit: 'mg',
  },
  {
    id: 'ALM-013',
    tagId: 'FT-701',
    priority: 'medium',
    state: 'cleared',
    description: 'Dye Liquor Circulation Flow LO Warning',
    area: 'Dyeing',
    plantId: 'plant-003',
    timestamp: minutesAgo(60),
    acknowledgedAt: minutesAgo(55),
    acknowledgedBy: 'ops_patel',
    clearedAt: minutesAgo(40),
    value: 55,
    limit: 50,
    engineeringUnit: 'L/min',
  },
  {
    id: 'ALM-014',
    tagId: 'PT-601',
    priority: 'medium',
    state: 'active',
    description: 'Air-Jet Supply Pressure LO Warning — Compressor Output Reduced',
    area: 'Loom Floor',
    plantId: 'plant-003',
    timestamp: minutesAgo(20),
    value: 2.7,
    limit: 2.5,
    engineeringUnit: 'bar',
  },
  {
    id: 'ALM-015',
    tagId: 'TT-102',
    priority: 'medium',
    state: 'acknowledged',
    description: 'Fluid Bed Dryer Inlet Temperature HI Warning',
    area: 'Granulation',
    plantId: 'plant-001',
    timestamp: minutesAgo(25),
    acknowledgedAt: minutesAgo(23),
    acknowledgedBy: 'ops_johnson',
    value: 79.1,
    limit: 80,
    engineeringUnit: '°C',
  },

  // ===== LOW (5) =====
  {
    id: 'ALM-016',
    tagId: 'TT-404',
    priority: 'low',
    state: 'active',
    description: 'Cold Room CR-101 Temperature Advisory — Slight Rise Detected',
    area: 'Packaging & Cold Storage',
    plantId: 'plant-002',
    timestamp: minutesAgo(14),
    value: 5.5,
    limit: 6,
    engineeringUnit: '°C',
  },
  {
    id: 'ALM-017',
    tagId: 'LT-701',
    priority: 'low',
    state: 'active',
    description: 'Dye Preparation Tank Level Below 60% — Consider Replenishment',
    area: 'Dyeing',
    plantId: 'plant-003',
    timestamp: minutesAgo(50),
    value: 55,
    engineeringUnit: '%',
  },
  {
    id: 'ALM-018',
    tagId: 'ST-101',
    priority: 'low',
    state: 'cleared',
    description: 'Granulator Impeller Speed Minor Fluctuation Detected',
    area: 'Granulation',
    plantId: 'plant-001',
    timestamp: minutesAgo(90),
    acknowledgedAt: minutesAgo(85),
    acknowledgedBy: 'ops_johnson',
    clearedAt: minutesAgo(70),
    value: 1455,
    engineeringUnit: 'RPM',
  },
  {
    id: 'ALM-019',
    tagId: 'FIC-201',
    priority: 'low',
    state: 'acknowledged',
    description: 'Syrup Flow Controller Output Oscillating — Tuning Advisory',
    area: 'Syrup Preparation',
    plantId: 'plant-002',
    timestamp: minutesAgo(40),
    acknowledgedAt: minutesAgo(38),
    acknowledgedBy: 'eng_williams',
    value: 85.6,
    engineeringUnit: 'L/min',
  },
  {
    id: 'ALM-020',
    tagId: 'TT-601',
    priority: 'low',
    state: 'active',
    description: 'Sizing Machine Drying Cylinder Temperature Slightly Elevated',
    area: 'Warping',
    plantId: 'plant-003',
    timestamp: minutesAgo(30),
    value: 138,
    limit: 140,
    engineeringUnit: '°C',
  },
];

/** Utility: count alarms by priority for active/acknowledged only */
export function getAlarmCounts(
  alarmList?: Alarm[],
): { critical: number; high: number; medium: number; low: number } {
  const source = alarmList ?? alarms;
  const active = source.filter((a) => a.state !== 'cleared');
  return {
    critical: active.filter((a) => a.priority === 'critical').length,
    high: active.filter((a) => a.priority === 'high').length,
    medium: active.filter((a) => a.priority === 'medium').length,
    low: active.filter((a) => a.priority === 'low').length,
  };
}

export default alarms;
