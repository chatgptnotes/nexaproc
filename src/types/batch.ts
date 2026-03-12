import type { ID, Timestamped } from './common';

export enum BatchState {
  Idle = 'idle',
  Running = 'running',
  Paused = 'paused',
  Complete = 'complete',
  Aborted = 'aborted',
}

export enum PhaseState {
  Idle = 'idle',
  Running = 'running',
  Held = 'held',
  Complete = 'complete',
  Aborted = 'aborted',
  Stopping = 'stopping',
  Restarting = 'restarting',
}

export enum RecipeType {
  Master = 'master',
  Control = 'control',
  Unit = 'unit',
}

export interface RecipeParameter {
  id: ID;
  name: string;
  description: string;
  dataType: 'float' | 'integer' | 'boolean' | 'string';
  defaultValue: string | number | boolean;
  minValue?: number;
  maxValue?: number;
  engineeringUnit?: string;
}

export interface RecipePhase extends Timestamped {
  id: ID;
  recipeId: ID;
  name: string;
  description: string;
  order: number;
  estimatedDuration: number;
  parameters: RecipeParameter[];
  equipmentRequirements: string[];
  transitionCondition?: string;
}

export interface Recipe extends Timestamped {
  id: ID;
  name: string;
  code: string;
  description: string;
  version: string;
  recipeType: RecipeType;
  productCode: string;
  productName: string;
  phases: RecipePhase[];
  plantId: ID;
  productionLineId: ID;
  estimatedDuration: number;
  isApproved: boolean;
  approvedBy?: string;
  approvedAt?: string;
}

export interface BatchPhase extends Timestamped {
  id: ID;
  batchId: ID;
  recipePhaseId: ID;
  name: string;
  state: PhaseState;
  order: number;
  startedAt?: string;
  completedAt?: string;
  actualDuration?: number;
  parameters: Record<string, string | number | boolean>;
  notes?: string;
}

export interface Batch extends Timestamped {
  id: ID;
  batchNumber: string;
  recipeId: ID;
  recipeName: string;
  recipeVersion: string;
  state: BatchState;
  plantId: ID;
  productionLineId: ID;
  processZoneId?: ID;
  productCode: string;
  productName: string;
  lotNumber?: string;
  phases: BatchPhase[];
  currentPhaseIndex: number;
  startedAt?: string;
  completedAt?: string;
  scheduledStartAt?: string;
  estimatedEndAt?: string;
  actualDuration?: number;
  operatorId: ID;
  operatorName: string;
  supervisorId?: ID;
  supervisorName?: string;
  qualityStatus: 'pending' | 'passed' | 'failed' | 'review';
  yield?: number;
  targetYield?: number;
  yieldUnit?: string;
  notes?: string;
}

export interface BatchEvent extends Timestamped {
  id: ID;
  batchId: ID;
  batchNumber: string;
  phaseId?: ID;
  phaseName?: string;
  eventType: 'state_change' | 'parameter_change' | 'alarm' | 'operator_action' | 'note';
  description: string;
  userId?: ID;
  userName?: string;
  oldValue?: string;
  newValue?: string;
}
