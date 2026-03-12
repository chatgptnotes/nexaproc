import type { Tag, RealTimeValue, TagTrend, HistoricalDataPoint } from '@/types/tag';
import { TagType, TagDataType, SignalQuality } from '@/types/tag';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_TAGS: Tag[] = [
  {
    id: 'tag-tt-101', name: 'TT-101', description: 'Feed tank outlet temperature',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'degC', equipmentId: 'eq-002', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 200,
    alarmLimits: { highHigh: 120, high: 100, low: 30, lowLow: 10, deadband: 1 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-tt-102', name: 'TT-102', description: 'Heat exchanger inlet temperature',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'degC', equipmentId: 'eq-008', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 200,
    alarmLimits: { highHigh: 100, high: 85, low: 20, lowLow: 5, deadband: 1 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-tt-103', name: 'TT-103', description: 'Heat exchanger outlet temperature',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'degC', equipmentId: 'eq-008', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 250,
    alarmLimits: { highHigh: 150, high: 130, low: 40, lowLow: 15, deadband: 2 },
    scanRate: 500, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-tt-201', name: 'TT-201', description: 'Reactor internal temperature',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'degC', equipmentId: 'eq-006', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 200,
    alarmLimits: { highHigh: 120, high: 105, low: 50, lowLow: 30, deadband: 1 },
    scanRate: 500, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-pt-101', name: 'PT-101', description: 'Feed pump discharge pressure',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'bar', equipmentId: 'eq-001', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 10,
    alarmLimits: { highHigh: 8, high: 6, low: 1, lowLow: 0.5, deadband: 0.1 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 2,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-pt-102', name: 'PT-102', description: 'Instrument air header pressure',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'bar', equipmentId: 'eq-013', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 12,
    alarmLimits: { highHigh: 10, high: 8, low: 4, lowLow: 3, deadband: 0.2 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-pt-201', name: 'PT-201', description: 'Reactor internal pressure',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'bar', equipmentId: 'eq-006', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 10,
    alarmLimits: { highHigh: 5.5, high: 4.5, low: 0.5, lowLow: 0.2, deadband: 0.1 },
    scanRate: 500, isEnabled: true, isHistorized: true, decimalPlaces: 2,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-pt-301', name: 'PT-301', description: 'Distillation column top pressure',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'bar', equipmentId: 'eq-010', processZoneId: 'zone-003', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 10,
    alarmLimits: { highHigh: 4.5, high: 3.8, low: 0.5, lowLow: 0.2, deadband: 0.1 },
    scanRate: 500, isEnabled: true, isHistorized: true, decimalPlaces: 2,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-ft-101', name: 'FT-101', description: 'Feed pump flowrate',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'L/min', equipmentId: 'eq-001', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 300,
    alarmLimits: { highHigh: 250, high: 200, low: 50, lowLow: 20, deadband: 5 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-ft-102', name: 'FT-102', description: 'Transfer pump flowrate',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'L/min', equipmentId: 'eq-005', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 300,
    alarmLimits: { highHigh: 280, high: 250, low: 30, lowLow: 10, deadband: 5 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-ft-201', name: 'FT-201', description: 'Reactor feed flowrate',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'L/min', equipmentId: 'eq-008', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 200,
    alarmLimits: { highHigh: 150, high: 120, low: 20, lowLow: 5, deadband: 3 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-lt-101', name: 'LT-101', description: 'Feed tank level',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: '%', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 100,
    alarmLimits: { highHigh: 95, high: 85, low: 20, lowLow: 10, deadband: 2 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-lt-102', name: 'LT-102', description: 'Distillation column sump level',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: '%', equipmentId: 'eq-010', processZoneId: 'zone-003', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 100,
    alarmLimits: { highHigh: 90, high: 80, low: 15, lowLow: 5, deadband: 2 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-lt-201', name: 'LT-201', description: 'Reactor level',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: '%', equipmentId: 'eq-006', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 100,
    alarmLimits: { highHigh: 95, high: 88, low: 15, lowLow: 5, deadband: 2 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-at-101', name: 'AT-101', description: 'Reactor pH',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'pH', equipmentId: 'eq-006', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 14,
    alarmLimits: { highHigh: 9.0, high: 8.0, low: 5.5, lowLow: 4.5, deadband: 0.1 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 2,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-at-102', name: 'AT-102', description: 'Fermentor pH',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'pH', equipmentId: 'eq-014', processZoneId: 'zone-005', plantId: 'plant-002',
    rangeMin: 0, rangeMax: 14,
    alarmLimits: { highHigh: 8.5, high: 7.5, low: 6.5, lowLow: 5.5, deadband: 0.1 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 2,
    createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-st-101', name: 'ST-101', description: 'Agitator speed',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'RPM', equipmentId: 'eq-004', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 3000,
    alarmLimits: { highHigh: 2000, high: 1800, low: 200, lowLow: 100, deadband: 20 },
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 0,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-st-201', name: 'ST-201', description: 'Reactor agitator speed',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'RPM', equipmentId: 'eq-007', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 3600,
    alarmLimits: { highHigh: 3200, high: 3100, low: 500, lowLow: 200, deadband: 20 },
    scanRate: 500, isEnabled: true, isHistorized: true, decimalPlaces: 0,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-wt-101', name: 'WT-101', description: 'Batch weigh hopper',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'kg', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 5000,
    alarmLimits: { highHigh: 4800, high: 4500, low: 50, lowLow: 10, deadband: 10 },
    scanRate: 500, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-et-101', name: 'ET-101', description: 'Feed pump power consumption',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'kW', equipmentId: 'eq-001', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 100,
    alarmLimits: { highHigh: 80, high: 60, deadband: 2 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-et-102', name: 'ET-102', description: 'Mixer power consumption',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'kW', equipmentId: 'eq-002', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 200,
    alarmLimits: { highHigh: 160, high: 130, deadband: 3 },
    scanRate: 2000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-ct-101', name: 'CT-101', description: 'Reactor conductivity',
    tagType: TagType.AnalogInput, dataType: TagDataType.Float,
    engineeringUnit: 'mS/cm', equipmentId: 'eq-006', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 20,
    alarmLimits: { highHigh: 10, high: 7, low: 1, lowLow: 0.5, deadband: 0.2 },
    scanRate: 5000, isEnabled: true, isHistorized: true, decimalPlaces: 2,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-vt-101', name: 'VT-101', description: 'Feed control valve position',
    tagType: TagType.AnalogOutput, dataType: TagDataType.Float,
    engineeringUnit: '%', equipmentId: 'eq-003', processZoneId: 'zone-001', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 100,
    alarmLimits: {},
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
  {
    id: 'tag-vt-102', name: 'VT-102', description: 'Cooling water valve position',
    tagType: TagType.AnalogOutput, dataType: TagDataType.Float,
    engineeringUnit: '%', processZoneId: 'zone-002', plantId: 'plant-001',
    rangeMin: 0, rangeMax: 100,
    alarmLimits: {},
    scanRate: 1000, isEnabled: true, isHistorized: true, decimalPlaces: 1,
    createdAt: '2025-03-15T08:00:00Z', updatedAt: '2026-01-10T14:30:00Z',
  },
];

function generateHistoricalData(baseValue: number, variance: number, points: number): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const now = Date.now();
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now - i * 60000).toISOString();
    const jitter = (Math.random() - 0.5) * 2 * variance;
    const trendDrift = Math.sin(i / 20) * variance * 0.3;
    data.push({
      timestamp,
      value: Math.round((baseValue + jitter + trendDrift) * 100) / 100,
      quality: Math.random() > 0.02 ? SignalQuality.Good : SignalQuality.Uncertain,
    });
  }
  return data;
}

export async function getTags(params?: PaginationParams & { plantId?: string; processZoneId?: string; tagType?: TagType }): Promise<PaginatedResponse<Tag>> {
  await delay(300);
  let filtered = [...MOCK_TAGS];
  if (params?.plantId) {
    filtered = filtered.filter((t) => t.plantId === params.plantId);
  }
  if (params?.processZoneId) {
    filtered = filtered.filter((t) => t.processZoneId === params.processZoneId);
  }
  if (params?.tagType) {
    filtered = filtered.filter((t) => t.tagType === params.tagType);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((t) =>
      t.name.toLowerCase().includes(s) || t.description.toLowerCase().includes(s),
    );
  }
  return {
    data: filtered,
    message: 'Tags retrieved successfully',
    success: true,
    total: filtered.length,
    page: params?.page ?? 1,
    limit: params?.limit ?? 50,
    totalPages: 1,
  };
}

export async function getTagById(tagId: string): Promise<ApiResponse<Tag>> {
  await delay(200);
  const tag = MOCK_TAGS.find((t) => t.id === tagId);
  if (!tag) throw new Error(`Tag ${tagId} not found`);
  return { data: tag, message: 'Tag retrieved successfully', success: true };
}

export async function getTagRealTimeValues(tagIds: string[]): Promise<ApiResponse<RealTimeValue[]>> {
  await delay(150);
  const now = new Date().toISOString();
  const values: RealTimeValue[] = tagIds
    .map((id): RealTimeValue | null => {
      const tag = MOCK_TAGS.find((t) => t.id === id);
      if (!tag) return null;
      const midpoint = (tag.rangeMax + tag.rangeMin) / 2;
      const range = tag.rangeMax - tag.rangeMin;
      const numericValue = midpoint + (Math.random() - 0.5) * range * 0.3;
      return {
        tagId: tag.id,
        tagName: tag.name,
        value: Math.round(numericValue * Math.pow(10, tag.decimalPlaces)) / Math.pow(10, tag.decimalPlaces),
        quality: SignalQuality.Good,
        timestamp: now,
        engineeringUnit: tag.engineeringUnit,
      };
    })
    .filter((v): v is RealTimeValue => v !== null);
  return { data: values, message: 'Real-time values retrieved', success: true };
}

export async function getTagTrend(tagId: string, _from?: string, _to?: string, points: number = 120): Promise<ApiResponse<TagTrend>> {
  await delay(400);
  const tag = MOCK_TAGS.find((t) => t.id === tagId);
  if (!tag) throw new Error(`Tag ${tagId} not found`);
  const midpoint = (tag.rangeMax + tag.rangeMin) / 2;
  const variance = (tag.rangeMax - tag.rangeMin) * 0.08;
  return {
    data: {
      tagId: tag.id,
      tagName: tag.name,
      engineeringUnit: tag.engineeringUnit,
      data: generateHistoricalData(midpoint, variance, points),
    },
    message: 'Tag trend data retrieved',
    success: true,
  };
}

export async function getMultiTagTrends(tagIds: string[], _from?: string, _to?: string, points: number = 120): Promise<ApiResponse<TagTrend[]>> {
  await delay(500);
  const trends: TagTrend[] = tagIds
    .map((id) => {
      const tag = MOCK_TAGS.find((t) => t.id === id);
      if (!tag) return null;
      const midpoint = (tag.rangeMax + tag.rangeMin) / 2;
      const variance = (tag.rangeMax - tag.rangeMin) * 0.08;
      return {
        tagId: tag.id,
        tagName: tag.name,
        engineeringUnit: tag.engineeringUnit,
        data: generateHistoricalData(midpoint, variance, points),
      };
    })
    .filter((t): t is TagTrend => t !== null);
  return { data: trends, message: 'Multi-tag trends retrieved', success: true };
}
