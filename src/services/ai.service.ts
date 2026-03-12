import type { ApiResponse } from '@/types/common';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface PredictiveInsight {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  predictionType: 'failure' | 'degradation' | 'maintenance_due';
  severity: 'critical' | 'warning' | 'info';
  confidence: number;
  title: string;
  description: string;
  predictedDate: string;
  remainingUsefulLife?: number;
  remainingUsefulLifeUnit?: string;
  recommendedAction: string;
  modelVersion: string;
  createdAt: string;
}

export interface AnomalyDetection {
  id: string;
  tagId: string;
  tagName: string;
  equipmentId?: string;
  equipmentName?: string;
  anomalyType: 'spike' | 'drift' | 'flatline' | 'oscillation' | 'out_of_range' | 'pattern_change';
  severity: 'critical' | 'warning' | 'info';
  score: number;
  title: string;
  description: string;
  detectedAt: string;
  expectedValue: number;
  actualValue: number;
  engineeringUnit: string;
  isAcknowledged: boolean;
}

export interface OptimizationRecommendation {
  id: string;
  category: 'throughput' | 'quality' | 'energy' | 'cost' | 'safety';
  title: string;
  description: string;
  currentValue: number;
  recommendedValue: number;
  expectedImprovement: number;
  improvementUnit: string;
  tagId?: string;
  tagName?: string;
  confidence: number;
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedSavings?: number;
  savingsCurrency?: string;
  savingsPeriod?: string;
  createdAt: string;
}

export interface EnergyMetrics {
  totalConsumption: number;
  consumptionUnit: string;
  costPerUnit: number;
  currency: string;
  period: string;
  breakdown: EnergyBreakdown[];
  trend: EnergyTrendPoint[];
  peakDemand: number;
  peakDemandUnit: string;
  powerFactor: number;
  carbonFootprint: number;
  carbonUnit: string;
}

export interface EnergyBreakdown {
  category: string;
  consumption: number;
  percentage: number;
  cost: number;
}

export interface EnergyTrendPoint {
  timestamp: string;
  consumption: number;
  cost: number;
}

const MOCK_PREDICTIVE_INSIGHTS: PredictiveInsight[] = [
  {
    id: 'pred-001',
    equipmentId: 'eq-001', equipmentName: 'Feed Pump P-101', equipmentCode: 'P-101',
    predictionType: 'degradation', severity: 'warning', confidence: 0.87,
    title: 'Bearing degradation detected on P-101',
    description: 'Vibration analysis indicates progressive bearing wear on the drive end. Current vibration levels show 23% increase over baseline measured at last maintenance. Pattern is consistent with inner race defect development.',
    predictedDate: '2026-04-18T00:00:00Z',
    remainingUsefulLife: 37, remainingUsefulLifeUnit: 'days',
    recommendedAction: 'Schedule bearing replacement during next planned shutdown. Order SKF 6310-2RS bearing. Estimated repair time: 4 hours.',
    modelVersion: 'v2.3.1',
    createdAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'pred-002',
    equipmentId: 'eq-008', equipmentName: 'Heat Exchanger HX-201', equipmentCode: 'HX-201',
    predictionType: 'degradation', severity: 'warning', confidence: 0.78,
    title: 'Fouling trend increasing on HX-201',
    description: 'Heat transfer coefficient has decreased by 18% over the last 30 days. Temperature approach is increasing, suggesting tube-side fouling. Current U-value: 420 W/m2K vs. clean U-value: 520 W/m2K.',
    predictedDate: '2026-04-05T00:00:00Z',
    remainingUsefulLife: 24, remainingUsefulLifeUnit: 'days',
    recommendedAction: 'Plan CIP cleaning cycle. If fouling rate continues, chemical cleaning will be required by early April. Consider increasing cooling water flow as interim measure.',
    modelVersion: 'v2.3.1',
    createdAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'pred-003',
    equipmentId: 'eq-010', equipmentName: 'Distillation Column C-301', equipmentCode: 'C-301',
    predictionType: 'maintenance_due', severity: 'info', confidence: 0.92,
    title: 'Scheduled tray inspection due for C-301',
    description: 'Column has reached 6,800 operating hours since last internal inspection. Historical data shows packing degradation typically begins at 7,500 hours for this service.',
    predictedDate: '2026-04-01T00:00:00Z',
    remainingUsefulLife: 700, remainingUsefulLifeUnit: 'hours',
    recommendedAction: 'Schedule internal inspection during next turnaround. Prepare replacement packing material (Koch-Glitsch FLEXIPAC 2Y). Estimated downtime: 48 hours.',
    modelVersion: 'v2.3.1',
    createdAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'pred-004',
    equipmentId: 'eq-003', equipmentName: 'Control Valve XV-101', equipmentCode: 'XV-101',
    predictionType: 'failure', severity: 'critical', confidence: 0.82,
    title: 'Valve positioner drift detected on XV-101',
    description: 'Valve position feedback shows increasing deviation from setpoint. Dead band has increased from 0.5% to 2.3% over the last 14 days. Actuator response time has degraded by 40%.',
    predictedDate: '2026-03-20T00:00:00Z',
    remainingUsefulLife: 8, remainingUsefulLifeUnit: 'days',
    recommendedAction: 'Replace valve positioner (Fisher DVC6200). Calibrate actuator. Verify fail-safe action before returning to service. Critical path item — affects feed flow control.',
    modelVersion: 'v2.3.1',
    createdAt: '2026-03-12T08:00:00Z',
  },
];

const MOCK_ANOMALIES: AnomalyDetection[] = [
  {
    id: 'anom-001',
    tagId: 'tag-tt-103', tagName: 'TT-103',
    equipmentId: 'eq-008', equipmentName: 'Heat Exchanger HX-201',
    anomalyType: 'drift', severity: 'warning', score: 0.76,
    title: 'Gradual temperature drift on TT-103',
    description: 'HX-201 outlet temperature shows a persistent upward drift of 0.3 degC/day over the last 10 days. Consistent with progressive fouling on the tube side.',
    detectedAt: '2026-03-12T09:30:00Z',
    expectedValue: 118.0, actualValue: 121.2, engineeringUnit: 'degC',
    isAcknowledged: false,
  },
  {
    id: 'anom-002',
    tagId: 'tag-st-101', tagName: 'ST-101',
    equipmentId: 'eq-004', equipmentName: 'Agitator AG-101',
    anomalyType: 'oscillation', severity: 'warning', score: 0.68,
    title: 'Speed oscillation on AG-101',
    description: 'Agitator speed shows periodic oscillation of +/-35 RPM with a 12-second cycle. Possible cause: VFD control loop instability or mechanical imbalance.',
    detectedAt: '2026-03-12T08:15:00Z',
    expectedValue: 1450, actualValue: 1485, engineeringUnit: 'RPM',
    isAcknowledged: false,
  },
  {
    id: 'anom-003',
    tagId: 'tag-ct-101', tagName: 'CT-101',
    equipmentId: 'eq-006', equipmentName: 'Reactor R-201',
    anomalyType: 'spike', severity: 'info', score: 0.54,
    title: 'Brief conductivity spike in reactor',
    description: 'Conductivity reading showed a brief spike to 8.2 mS/cm (normal range 4.0-5.0 mS/cm) lasting approximately 15 seconds. Possibly caused by reagent addition or measurement noise.',
    detectedAt: '2026-03-12T07:45:00Z',
    expectedValue: 4.5, actualValue: 8.2, engineeringUnit: 'mS/cm',
    isAcknowledged: true,
  },
];

const MOCK_OPTIMIZATION: OptimizationRecommendation[] = [
  {
    id: 'opt-001',
    category: 'energy',
    title: 'Reduce cooling water flow on HX-201 during low-load periods',
    description: 'Analysis shows cooling water pump P-CW-01 runs at constant speed regardless of heat load. During night shifts (22:00-06:00), heat load drops by 40%. Variable speed operation could save significant energy.',
    currentValue: 100, recommendedValue: 65,
    expectedImprovement: 12.5, improvementUnit: '%',
    confidence: 0.88,
    implementationComplexity: 'medium',
    estimatedSavings: 18500, savingsCurrency: 'ZAR', savingsPeriod: 'month',
    createdAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'opt-002',
    category: 'throughput',
    title: 'Optimise reactor agitator speed profile',
    description: 'Current recipe uses constant 800 RPM during the reaction phase. Data analysis of 45 historical batches shows a ramped profile (600 RPM first hour, 900 RPM remaining) correlates with 3.2% higher yield and 8 minutes shorter reaction time.',
    currentValue: 800, recommendedValue: 0,
    expectedImprovement: 3.2, improvementUnit: '%',
    tagId: 'tag-st-201', tagName: 'ST-201',
    confidence: 0.74,
    implementationComplexity: 'low',
    estimatedSavings: 45000, savingsCurrency: 'ZAR', savingsPeriod: 'month',
    createdAt: '2026-03-12T08:00:00Z',
  },
  {
    id: 'opt-003',
    category: 'quality',
    title: 'Tighten pH control band during reaction phase',
    description: 'SPC analysis shows pH excursions beyond +/-0.3 pH from setpoint correlate with 15% higher reject rate. Implementing cascade control with AT-101 as primary and acid/base dosing as secondary would reduce variability.',
    currentValue: 0.5, recommendedValue: 0.2,
    expectedImprovement: 15, improvementUnit: '%',
    tagId: 'tag-at-101', tagName: 'AT-101',
    confidence: 0.81,
    implementationComplexity: 'medium',
    createdAt: '2026-03-12T08:00:00Z',
  },
];

function generateEnergyTrend(): EnergyTrendPoint[] {
  const points: EnergyTrendPoint[] = [];
  const now = Date.now();
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000).toISOString();
    const baseConsumption = 850 + Math.sin(((24 - i) / 24) * Math.PI * 2) * 200;
    const jitter = (Math.random() - 0.5) * 80;
    const consumption = Math.round(baseConsumption + jitter);
    points.push({
      timestamp,
      consumption,
      cost: Math.round(consumption * 2.15 * 100) / 100,
    });
  }
  return points;
}

const MOCK_ENERGY: EnergyMetrics = {
  totalConsumption: 20450,
  consumptionUnit: 'kWh',
  costPerUnit: 2.15,
  currency: 'ZAR',
  period: 'Last 24 Hours',
  breakdown: [
    { category: 'Motors & Drives', consumption: 7800, percentage: 38.1, cost: 16770 },
    { category: 'Heating Systems', consumption: 5200, percentage: 25.4, cost: 11180 },
    { category: 'Cooling Systems', consumption: 3400, percentage: 16.6, cost: 7310 },
    { category: 'Compressed Air', consumption: 1850, percentage: 9.0, cost: 3977 },
    { category: 'Lighting & HVAC', consumption: 1200, percentage: 5.9, cost: 2580 },
    { category: 'Instrumentation', consumption: 600, percentage: 2.9, cost: 1290 },
    { category: 'Other', consumption: 400, percentage: 2.0, cost: 860 },
  ],
  trend: generateEnergyTrend(),
  peakDemand: 1250,
  peakDemandUnit: 'kW',
  powerFactor: 0.92,
  carbonFootprint: 20.9,
  carbonUnit: 'tonnes CO2e',
};

export async function getPredictiveInsights(plantId?: string): Promise<ApiResponse<PredictiveInsight[]>> {
  await delay(450);
  let insights = [...MOCK_PREDICTIVE_INSIGHTS];
  if (plantId) {
    // All mock insights are for plant-001 equipment; filter by checking equipment references
    const plantEquipmentIds = plantId === 'plant-001'
      ? ['eq-001', 'eq-003', 'eq-008', 'eq-010']
      : [];
    insights = insights.filter((i) => plantEquipmentIds.includes(i.equipmentId));
  }
  return { data: insights, message: 'Predictive insights retrieved', success: true };
}

export async function getAnomalies(params?: { plantId?: string; acknowledged?: boolean }): Promise<ApiResponse<AnomalyDetection[]>> {
  await delay(400);
  let anomalies = [...MOCK_ANOMALIES];
  if (params?.acknowledged !== undefined) {
    anomalies = anomalies.filter((a) => a.isAcknowledged === params.acknowledged);
  }
  return { data: anomalies, message: 'Anomalies retrieved', success: true };
}

export async function acknowledgeAnomaly(anomalyId: string): Promise<ApiResponse<AnomalyDetection>> {
  await delay(200);
  const anomaly = MOCK_ANOMALIES.find((a) => a.id === anomalyId);
  if (!anomaly) throw new Error(`Anomaly ${anomalyId} not found`);
  return { data: { ...anomaly, isAcknowledged: true }, message: 'Anomaly acknowledged', success: true };
}

export async function getOptimizationRecommendations(): Promise<ApiResponse<OptimizationRecommendation[]>> {
  await delay(350);
  return { data: MOCK_OPTIMIZATION, message: 'Optimization recommendations retrieved', success: true };
}

export async function getEnergyMetrics(plantId?: string): Promise<ApiResponse<EnergyMetrics>> {
  await delay(400);
  const metrics = { ...MOCK_ENERGY };
  if (plantId === 'plant-002') {
    metrics.totalConsumption = Math.round(metrics.totalConsumption * 0.4);
    metrics.peakDemand = Math.round(metrics.peakDemand * 0.4);
    metrics.carbonFootprint = Math.round(metrics.carbonFootprint * 0.4 * 10) / 10;
    metrics.breakdown = metrics.breakdown.map((b) => ({
      ...b,
      consumption: Math.round(b.consumption * 0.4),
      cost: Math.round(b.cost * 0.4),
    }));
  }
  return { data: metrics, message: 'Energy metrics retrieved', success: true };
}
