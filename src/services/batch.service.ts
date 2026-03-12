import type { Batch, Recipe, BatchEvent } from '@/types/batch';
import { BatchState, PhaseState, RecipeType } from '@/types/batch';
import type { ApiResponse, PaginatedResponse, PaginationParams } from '@/types/common';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const MOCK_RECIPES: Recipe[] = [
  {
    id: 'recipe-001',
    name: 'Polymer Grade A Synthesis',
    code: 'PGA-001',
    description: 'Standard synthesis procedure for Polymer Grade A using catalytic polymerisation',
    version: '3.2',
    recipeType: RecipeType.Master,
    productCode: 'PGA',
    productName: 'Polymer Grade A',
    plantId: 'plant-001',
    productionLineId: 'line-001',
    estimatedDuration: 480,
    isApproved: true,
    approvedBy: 'Dr. Sarah Chen',
    approvedAt: '2026-01-15T10:00:00Z',
    phases: [
      {
        id: 'rphase-001', recipeId: 'recipe-001', name: 'Raw Material Charging',
        description: 'Weigh and charge raw materials into mixing vessel',
        order: 1, estimatedDuration: 45,
        parameters: [
          { id: 'rp-001', name: 'Monomer A Weight', description: 'Target weight of Monomer A', dataType: 'float', defaultValue: 2500, minValue: 2400, maxValue: 2600, engineeringUnit: 'kg' },
          { id: 'rp-002', name: 'Catalyst Weight', description: 'Target weight of catalyst', dataType: 'float', defaultValue: 12.5, minValue: 10, maxValue: 15, engineeringUnit: 'kg' },
          { id: 'rp-003', name: 'Solvent Volume', description: 'Target volume of solvent', dataType: 'float', defaultValue: 500, minValue: 450, maxValue: 550, engineeringUnit: 'L' },
        ],
        equipmentRequirements: ['Weigh hopper', 'Mixer M-101', 'Transfer pump P-102'],
        createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'rphase-002', recipeId: 'recipe-001', name: 'Pre-mix & Heat Up',
        description: 'Mix raw materials and heat to reaction temperature',
        order: 2, estimatedDuration: 60,
        parameters: [
          { id: 'rp-004', name: 'Target Temperature', description: 'Target pre-mix temperature', dataType: 'float', defaultValue: 85, minValue: 80, maxValue: 90, engineeringUnit: 'degC' },
          { id: 'rp-005', name: 'Agitator Speed', description: 'Mixing speed during pre-mix', dataType: 'integer', defaultValue: 1200, minValue: 800, maxValue: 1500, engineeringUnit: 'RPM' },
          { id: 'rp-006', name: 'Heat Rate', description: 'Maximum heating rate', dataType: 'float', defaultValue: 2.0, maxValue: 3.0, engineeringUnit: 'degC/min' },
        ],
        equipmentRequirements: ['Reactor R-201', 'Heat exchanger HX-201', 'Agitator AG-201'],
        transitionCondition: 'TT-201 >= 85 degC AND stable for 5 min',
        createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'rphase-003', recipeId: 'recipe-001', name: 'Reaction',
        description: 'Main polymerisation reaction at controlled temperature and pressure',
        order: 3, estimatedDuration: 240,
        parameters: [
          { id: 'rp-007', name: 'Reaction Temperature', description: 'Maintained reaction temperature', dataType: 'float', defaultValue: 95, minValue: 93, maxValue: 97, engineeringUnit: 'degC' },
          { id: 'rp-008', name: 'Reaction Pressure', description: 'Maintained reaction pressure', dataType: 'float', defaultValue: 2.5, minValue: 2.2, maxValue: 2.8, engineeringUnit: 'bar' },
          { id: 'rp-009', name: 'Agitator Speed', description: 'Agitation during reaction', dataType: 'integer', defaultValue: 800, minValue: 600, maxValue: 1000, engineeringUnit: 'RPM' },
          { id: 'rp-010', name: 'pH Setpoint', description: 'Target pH during reaction', dataType: 'float', defaultValue: 7.2, minValue: 6.8, maxValue: 7.6, engineeringUnit: 'pH' },
        ],
        equipmentRequirements: ['Reactor R-201', 'Agitator AG-201', 'Condenser E-201'],
        transitionCondition: 'Viscosity target reached OR reaction time >= 240 min',
        createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'rphase-004', recipeId: 'recipe-001', name: 'Cool Down & Transfer',
        description: 'Cool reactor contents and transfer to distillation feed tank',
        order: 4, estimatedDuration: 75,
        parameters: [
          { id: 'rp-011', name: 'Target Cool Temperature', description: 'Temperature before transfer', dataType: 'float', defaultValue: 45, maxValue: 50, engineeringUnit: 'degC' },
          { id: 'rp-012', name: 'Cool Rate', description: 'Maximum cooling rate', dataType: 'float', defaultValue: 1.5, maxValue: 2.0, engineeringUnit: 'degC/min' },
        ],
        equipmentRequirements: ['Reactor R-201', 'Heat exchanger HX-201', 'Transfer pump'],
        createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
      },
      {
        id: 'rphase-005', recipeId: 'recipe-001', name: 'Purification',
        description: 'Distillation and filtration to achieve product specification',
        order: 5, estimatedDuration: 60,
        parameters: [
          { id: 'rp-013', name: 'Column Pressure', description: 'Distillation column operating pressure', dataType: 'float', defaultValue: 1.5, minValue: 1.2, maxValue: 1.8, engineeringUnit: 'bar' },
          { id: 'rp-014', name: 'Reflux Ratio', description: 'Target reflux ratio', dataType: 'float', defaultValue: 3.5, minValue: 2.5, maxValue: 4.5 },
        ],
        equipmentRequirements: ['Distillation column C-301', 'Reboiler E-301', 'Product filter F-301'],
        createdAt: '2025-06-01T08:00:00Z', updatedAt: '2026-01-15T10:00:00Z',
      },
    ],
    createdAt: '2025-06-01T08:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'recipe-002',
    name: 'Enzyme Batch B Production',
    code: 'ENZ-B-001',
    description: 'Fermentation procedure for Enzyme Batch B with downstream processing',
    version: '1.4',
    recipeType: RecipeType.Master,
    productCode: 'ENZ-B',
    productName: 'Enzyme Batch B',
    plantId: 'plant-002',
    productionLineId: 'line-003',
    estimatedDuration: 1440,
    isApproved: true,
    approvedBy: 'Dr. Sarah Chen',
    approvedAt: '2026-02-20T10:00:00Z',
    phases: [
      {
        id: 'rphase-010', recipeId: 'recipe-002', name: 'Media Preparation',
        description: 'Prepare and sterilise growth media',
        order: 1, estimatedDuration: 120,
        parameters: [
          { id: 'rp-020', name: 'Media Volume', description: 'Volume of growth media', dataType: 'float', defaultValue: 8000, engineeringUnit: 'L' },
          { id: 'rp-021', name: 'Sterilisation Temperature', description: 'SIP temperature', dataType: 'float', defaultValue: 121, engineeringUnit: 'degC' },
          { id: 'rp-022', name: 'Sterilisation Hold Time', description: 'Hold time at temperature', dataType: 'integer', defaultValue: 30, engineeringUnit: 'min' },
        ],
        equipmentRequirements: ['Fermentor FR-501'],
        createdAt: '2025-08-01T08:00:00Z', updatedAt: '2026-02-20T10:00:00Z',
      },
      {
        id: 'rphase-011', recipeId: 'recipe-002', name: 'Inoculation & Growth',
        description: 'Inoculate with seed culture and grow to target cell density',
        order: 2, estimatedDuration: 720,
        parameters: [
          { id: 'rp-023', name: 'Temperature', description: 'Fermentation temperature', dataType: 'float', defaultValue: 37, engineeringUnit: 'degC' },
          { id: 'rp-024', name: 'pH Setpoint', description: 'Maintained pH', dataType: 'float', defaultValue: 6.8, engineeringUnit: 'pH' },
          { id: 'rp-025', name: 'Dissolved Oxygen', description: 'Target DO level', dataType: 'float', defaultValue: 30, engineeringUnit: '%' },
        ],
        equipmentRequirements: ['Fermentor FR-501'],
        transitionCondition: 'OD600 >= 45 OR fermentation time >= 720 min',
        createdAt: '2025-08-01T08:00:00Z', updatedAt: '2026-02-20T10:00:00Z',
      },
      {
        id: 'rphase-012', recipeId: 'recipe-002', name: 'Harvest & Separation',
        description: 'Harvest broth and separate cells via centrifugation',
        order: 3, estimatedDuration: 180,
        parameters: [
          { id: 'rp-026', name: 'Centrifuge Speed', description: 'Disc stack centrifuge speed', dataType: 'integer', defaultValue: 7500, engineeringUnit: 'RPM' },
          { id: 'rp-027', name: 'Feed Rate', description: 'Centrifuge feed rate', dataType: 'float', defaultValue: 2000, engineeringUnit: 'L/h' },
        ],
        equipmentRequirements: ['Centrifuge CF-501'],
        createdAt: '2025-08-01T08:00:00Z', updatedAt: '2026-02-20T10:00:00Z',
      },
    ],
    createdAt: '2025-08-01T08:00:00Z',
    updatedAt: '2026-02-20T10:00:00Z',
  },
];

const MOCK_BATCHES: Batch[] = [
  {
    id: 'batch-001',
    batchNumber: 'PGA-2026-0342',
    recipeId: 'recipe-001', recipeName: 'Polymer Grade A Synthesis', recipeVersion: '3.2',
    state: BatchState.Running,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-002',
    productCode: 'PGA', productName: 'Polymer Grade A',
    lotNumber: 'LOT-2026-0342',
    currentPhaseIndex: 2,
    startedAt: '2026-03-12T06:00:00Z',
    scheduledStartAt: '2026-03-12T06:00:00Z',
    estimatedEndAt: '2026-03-12T14:00:00Z',
    operatorId: 'user-operator-001', operatorName: 'Carlos Rivera',
    supervisorId: 'user-supervisor-001', supervisorName: 'James Miller',
    qualityStatus: 'pending',
    targetYield: 2200, yieldUnit: 'kg',
    phases: [
      {
        id: 'bphase-001', batchId: 'batch-001', recipePhaseId: 'rphase-001',
        name: 'Raw Material Charging', state: PhaseState.Complete, order: 1,
        startedAt: '2026-03-12T06:00:00Z', completedAt: '2026-03-12T06:42:00Z',
        actualDuration: 42,
        parameters: { 'Monomer A Weight': 2510, 'Catalyst Weight': 12.3, 'Solvent Volume': 498 },
        createdAt: '2026-03-12T06:00:00Z', updatedAt: '2026-03-12T06:42:00Z',
      },
      {
        id: 'bphase-002', batchId: 'batch-001', recipePhaseId: 'rphase-002',
        name: 'Pre-mix & Heat Up', state: PhaseState.Complete, order: 2,
        startedAt: '2026-03-12T06:42:00Z', completedAt: '2026-03-12T07:38:00Z',
        actualDuration: 56,
        parameters: { 'Target Temperature': 85, 'Agitator Speed': 1200, 'Heat Rate': 1.8 },
        createdAt: '2026-03-12T06:42:00Z', updatedAt: '2026-03-12T07:38:00Z',
      },
      {
        id: 'bphase-003', batchId: 'batch-001', recipePhaseId: 'rphase-003',
        name: 'Reaction', state: PhaseState.Running, order: 3,
        startedAt: '2026-03-12T07:38:00Z',
        parameters: { 'Reaction Temperature': 95, 'Reaction Pressure': 2.5, 'Agitator Speed': 800, 'pH Setpoint': 7.2 },
        createdAt: '2026-03-12T07:38:00Z', updatedAt: '2026-03-12T10:00:00Z',
      },
      {
        id: 'bphase-004', batchId: 'batch-001', recipePhaseId: 'rphase-004',
        name: 'Cool Down & Transfer', state: PhaseState.Idle, order: 4,
        parameters: { 'Target Cool Temperature': 45, 'Cool Rate': 1.5 },
        createdAt: '2026-03-12T06:00:00Z', updatedAt: '2026-03-12T06:00:00Z',
      },
      {
        id: 'bphase-005', batchId: 'batch-001', recipePhaseId: 'rphase-005',
        name: 'Purification', state: PhaseState.Idle, order: 5,
        parameters: { 'Column Pressure': 1.5, 'Reflux Ratio': 3.5 },
        createdAt: '2026-03-12T06:00:00Z', updatedAt: '2026-03-12T06:00:00Z',
      },
    ],
    createdAt: '2026-03-12T05:55:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
  },
  {
    id: 'batch-002',
    batchNumber: 'PGA-2026-0341',
    recipeId: 'recipe-001', recipeName: 'Polymer Grade A Synthesis', recipeVersion: '3.2',
    state: BatchState.Complete,
    plantId: 'plant-001', productionLineId: 'line-001', processZoneId: 'zone-002',
    productCode: 'PGA', productName: 'Polymer Grade A',
    lotNumber: 'LOT-2026-0341',
    currentPhaseIndex: 4,
    startedAt: '2026-03-11T06:00:00Z',
    completedAt: '2026-03-11T13:52:00Z',
    scheduledStartAt: '2026-03-11T06:00:00Z',
    actualDuration: 472,
    operatorId: 'user-operator-001', operatorName: 'Carlos Rivera',
    supervisorId: 'user-supervisor-001', supervisorName: 'James Miller',
    qualityStatus: 'passed',
    yield: 2180, targetYield: 2200, yieldUnit: 'kg',
    phases: [
      {
        id: 'bphase-011', batchId: 'batch-002', recipePhaseId: 'rphase-001',
        name: 'Raw Material Charging', state: PhaseState.Complete, order: 1,
        startedAt: '2026-03-11T06:00:00Z', completedAt: '2026-03-11T06:40:00Z', actualDuration: 40,
        parameters: { 'Monomer A Weight': 2495, 'Catalyst Weight': 12.6, 'Solvent Volume': 502 },
        createdAt: '2026-03-11T06:00:00Z', updatedAt: '2026-03-11T06:40:00Z',
      },
      {
        id: 'bphase-012', batchId: 'batch-002', recipePhaseId: 'rphase-002',
        name: 'Pre-mix & Heat Up', state: PhaseState.Complete, order: 2,
        startedAt: '2026-03-11T06:40:00Z', completedAt: '2026-03-11T07:35:00Z', actualDuration: 55,
        parameters: { 'Target Temperature': 85, 'Agitator Speed': 1200, 'Heat Rate': 1.9 },
        createdAt: '2026-03-11T06:40:00Z', updatedAt: '2026-03-11T07:35:00Z',
      },
      {
        id: 'bphase-013', batchId: 'batch-002', recipePhaseId: 'rphase-003',
        name: 'Reaction', state: PhaseState.Complete, order: 3,
        startedAt: '2026-03-11T07:35:00Z', completedAt: '2026-03-11T11:30:00Z', actualDuration: 235,
        parameters: { 'Reaction Temperature': 95, 'Reaction Pressure': 2.5, 'Agitator Speed': 800, 'pH Setpoint': 7.2 },
        createdAt: '2026-03-11T07:35:00Z', updatedAt: '2026-03-11T11:30:00Z',
      },
      {
        id: 'bphase-014', batchId: 'batch-002', recipePhaseId: 'rphase-004',
        name: 'Cool Down & Transfer', state: PhaseState.Complete, order: 4,
        startedAt: '2026-03-11T11:30:00Z', completedAt: '2026-03-11T12:48:00Z', actualDuration: 78,
        parameters: { 'Target Cool Temperature': 45, 'Cool Rate': 1.5 },
        createdAt: '2026-03-11T11:30:00Z', updatedAt: '2026-03-11T12:48:00Z',
      },
      {
        id: 'bphase-015', batchId: 'batch-002', recipePhaseId: 'rphase-005',
        name: 'Purification', state: PhaseState.Complete, order: 5,
        startedAt: '2026-03-11T12:48:00Z', completedAt: '2026-03-11T13:52:00Z', actualDuration: 64,
        parameters: { 'Column Pressure': 1.5, 'Reflux Ratio': 3.5 },
        createdAt: '2026-03-11T12:48:00Z', updatedAt: '2026-03-11T13:52:00Z',
      },
    ],
    createdAt: '2026-03-11T05:55:00Z',
    updatedAt: '2026-03-11T13:52:00Z',
  },
  {
    id: 'batch-003',
    batchNumber: 'ENZ-B-2026-0087',
    recipeId: 'recipe-002', recipeName: 'Enzyme Batch B Production', recipeVersion: '1.4',
    state: BatchState.Paused,
    plantId: 'plant-002', productionLineId: 'line-003', processZoneId: 'zone-005',
    productCode: 'ENZ-B', productName: 'Enzyme Batch B',
    lotNumber: 'LOT-2026-B087',
    currentPhaseIndex: 1,
    startedAt: '2026-03-11T22:00:00Z',
    scheduledStartAt: '2026-03-11T22:00:00Z',
    estimatedEndAt: '2026-03-12T22:00:00Z',
    operatorId: 'user-operator-001', operatorName: 'Carlos Rivera',
    qualityStatus: 'pending',
    targetYield: 6500, yieldUnit: 'L',
    notes: 'Paused due to pH control issue — maintenance investigating fermentor FR-501',
    phases: [
      {
        id: 'bphase-021', batchId: 'batch-003', recipePhaseId: 'rphase-010',
        name: 'Media Preparation', state: PhaseState.Complete, order: 1,
        startedAt: '2026-03-11T22:00:00Z', completedAt: '2026-03-12T00:05:00Z', actualDuration: 125,
        parameters: { 'Media Volume': 8000, 'Sterilisation Temperature': 121, 'Sterilisation Hold Time': 30 },
        createdAt: '2026-03-11T22:00:00Z', updatedAt: '2026-03-12T00:05:00Z',
      },
      {
        id: 'bphase-022', batchId: 'batch-003', recipePhaseId: 'rphase-011',
        name: 'Inoculation & Growth', state: PhaseState.Held, order: 2,
        startedAt: '2026-03-12T00:05:00Z',
        parameters: { 'Temperature': 37, 'pH Setpoint': 6.8, 'Dissolved Oxygen': 30 },
        notes: 'Held at 10h12 — pH drifting below setpoint',
        createdAt: '2026-03-12T00:05:00Z', updatedAt: '2026-03-12T10:12:00Z',
      },
      {
        id: 'bphase-023', batchId: 'batch-003', recipePhaseId: 'rphase-012',
        name: 'Harvest & Separation', state: PhaseState.Idle, order: 3,
        parameters: { 'Centrifuge Speed': 7500, 'Feed Rate': 2000 },
        createdAt: '2026-03-11T22:00:00Z', updatedAt: '2026-03-11T22:00:00Z',
      },
    ],
    createdAt: '2026-03-11T21:50:00Z',
    updatedAt: '2026-03-12T10:12:00Z',
  },
];

const MOCK_BATCH_EVENTS: BatchEvent[] = [
  {
    id: 'bevt-001', batchId: 'batch-001', batchNumber: 'PGA-2026-0342',
    eventType: 'state_change', description: 'Batch started',
    userId: 'user-operator-001', userName: 'Carlos Rivera',
    oldValue: 'idle', newValue: 'running',
    createdAt: '2026-03-12T06:00:00Z', updatedAt: '2026-03-12T06:00:00Z',
  },
  {
    id: 'bevt-002', batchId: 'batch-001', batchNumber: 'PGA-2026-0342',
    phaseId: 'bphase-001', phaseName: 'Raw Material Charging',
    eventType: 'state_change', description: 'Phase completed — all materials charged within specification',
    createdAt: '2026-03-12T06:42:00Z', updatedAt: '2026-03-12T06:42:00Z',
  },
  {
    id: 'bevt-003', batchId: 'batch-001', batchNumber: 'PGA-2026-0342',
    phaseId: 'bphase-002', phaseName: 'Pre-mix & Heat Up',
    eventType: 'state_change', description: 'Phase completed — target temperature reached and stable',
    createdAt: '2026-03-12T07:38:00Z', updatedAt: '2026-03-12T07:38:00Z',
  },
  {
    id: 'bevt-004', batchId: 'batch-001', batchNumber: 'PGA-2026-0342',
    phaseId: 'bphase-003', phaseName: 'Reaction',
    eventType: 'alarm', description: 'AT-101 pH high alarm — pH 8.3 above limit 8.0',
    createdAt: '2026-03-12T09:48:12Z', updatedAt: '2026-03-12T09:48:12Z',
  },
  {
    id: 'bevt-005', batchId: 'batch-001', batchNumber: 'PGA-2026-0342',
    phaseId: 'bphase-003', phaseName: 'Reaction',
    eventType: 'operator_action', description: 'Operator adjusted acid dosing pump speed from 40% to 55%',
    userId: 'user-operator-001', userName: 'Carlos Rivera',
    oldValue: '40', newValue: '55',
    createdAt: '2026-03-12T09:50:30Z', updatedAt: '2026-03-12T09:50:30Z',
  },
];

export async function getRecipes(params?: PaginationParams & { plantId?: string }): Promise<PaginatedResponse<Recipe>> {
  await delay(350);
  let filtered = [...MOCK_RECIPES];
  if (params?.plantId) {
    filtered = filtered.filter((r) => r.plantId === params.plantId);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((r) =>
      r.name.toLowerCase().includes(s) || r.code.toLowerCase().includes(s) || r.productName.toLowerCase().includes(s),
    );
  }
  return {
    data: filtered,
    message: 'Recipes retrieved successfully',
    success: true,
    total: filtered.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function getRecipeById(recipeId: string): Promise<ApiResponse<Recipe>> {
  await delay(250);
  const recipe = MOCK_RECIPES.find((r) => r.id === recipeId);
  if (!recipe) throw new Error(`Recipe ${recipeId} not found`);
  return { data: recipe, message: 'Recipe retrieved', success: true };
}

export async function getBatches(params?: PaginationParams & { plantId?: string; state?: BatchState }): Promise<PaginatedResponse<Batch>> {
  await delay(400);
  let filtered = [...MOCK_BATCHES];
  if (params?.plantId) {
    filtered = filtered.filter((b) => b.plantId === params.plantId);
  }
  if (params?.state) {
    filtered = filtered.filter((b) => b.state === params.state);
  }
  if (params?.search) {
    const s = params.search.toLowerCase();
    filtered = filtered.filter((b) =>
      b.batchNumber.toLowerCase().includes(s) || b.recipeName.toLowerCase().includes(s) || b.productName.toLowerCase().includes(s),
    );
  }
  return {
    data: filtered,
    message: 'Batches retrieved successfully',
    success: true,
    total: filtered.length,
    page: 1,
    limit: 20,
    totalPages: 1,
  };
}

export async function getBatchById(batchId: string): Promise<ApiResponse<Batch>> {
  await delay(250);
  const batch = MOCK_BATCHES.find((b) => b.id === batchId);
  if (!batch) throw new Error(`Batch ${batchId} not found`);
  return { data: batch, message: 'Batch retrieved', success: true };
}

export async function getBatchEvents(batchId: string): Promise<ApiResponse<BatchEvent[]>> {
  await delay(300);
  const events = MOCK_BATCH_EVENTS.filter((e) => e.batchId === batchId);
  return { data: events, message: 'Batch events retrieved', success: true };
}

export async function startBatch(recipeId: string, operatorId: string): Promise<ApiResponse<Batch>> {
  await delay(500);
  const recipe = MOCK_RECIPES.find((r) => r.id === recipeId);
  if (!recipe) throw new Error(`Recipe ${recipeId} not found`);
  const now = new Date().toISOString();
  const batch: Batch = {
    id: `batch-${Date.now()}`,
    batchNumber: `${recipe.productCode}-2026-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
    recipeId: recipe.id, recipeName: recipe.name, recipeVersion: recipe.version,
    state: BatchState.Running,
    plantId: recipe.plantId, productionLineId: recipe.productionLineId,
    productCode: recipe.productCode, productName: recipe.productName,
    currentPhaseIndex: 0,
    startedAt: now,
    operatorId, operatorName: 'Operator',
    qualityStatus: 'pending',
    targetYield: 2200, yieldUnit: 'kg',
    phases: recipe.phases.map((rp, idx) => ({
      id: `bphase-new-${idx}`,
      batchId: '',
      recipePhaseId: rp.id,
      name: rp.name,
      state: idx === 0 ? PhaseState.Running : PhaseState.Idle,
      order: rp.order,
      startedAt: idx === 0 ? now : undefined,
      parameters: Object.fromEntries(rp.parameters.map((p) => [p.name, p.defaultValue])),
      createdAt: now,
      updatedAt: now,
    })),
    createdAt: now,
    updatedAt: now,
  };
  return { data: batch, message: 'Batch started successfully', success: true };
}

export async function controlBatch(batchId: string, action: 'pause' | 'resume' | 'abort'): Promise<ApiResponse<Batch>> {
  await delay(300);
  const batch = MOCK_BATCHES.find((b) => b.id === batchId);
  if (!batch) throw new Error(`Batch ${batchId} not found`);
  const stateMap: Record<string, BatchState> = {
    pause: BatchState.Paused,
    resume: BatchState.Running,
    abort: BatchState.Aborted,
  };
  const updated = { ...batch, state: stateMap[action], updatedAt: new Date().toISOString() };
  return { data: updated, message: `Batch ${action} successful`, success: true };
}
