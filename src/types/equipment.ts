import type { ID, Timestamped } from './common';

export enum EquipmentType {
  Valve = 'valve',
  Pump = 'pump',
  Motor = 'motor',
  Reactor = 'reactor',
  HeatExchanger = 'heat_exchanger',
  Mixer = 'mixer',
  Conveyor = 'conveyor',
  Compressor = 'compressor',
  Boiler = 'boiler',
  Turbine = 'turbine',
  Centrifuge = 'centrifuge',
  Dryer = 'dryer',
  Filter = 'filter',
  Crusher = 'crusher',
  DistillationColumn = 'distillation_column',
  Evaporator = 'evaporator',
  Crystallizer = 'crystallizer',
  Fermentor = 'fermentor',
  Homogenizer = 'homogenizer',
  Pasteurizer = 'pasteurizer',
  Sterilizer = 'sterilizer',
  Granulator = 'granulator',
  Coater = 'coater',
  TabletPress = 'tablet_press',
  FillingMachine = 'filling_machine',
  Labeler = 'labeler',
  Palletizer = 'palletizer',
  Agitator = 'agitator',
  Blender = 'blender',
  Separator = 'separator',
  Tank = 'tank',
  Silo = 'silo',
  Fan = 'fan',
  Damper = 'damper',
  Instrument = 'instrument',
}

export enum EquipmentState {
  Running = 'running',
  Stopped = 'stopped',
  Fault = 'fault',
  Maintenance = 'maintenance',
  Standby = 'standby',
}

export enum MaintenancePriority {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export interface EquipmentSpec {
  manufacturer: string;
  model: string;
  serialNumber: string;
  installDate: string;
  ratedCapacity?: string;
  ratedPower?: string;
  operatingPressure?: string;
  operatingTemperature?: string;
  material?: string;
  weight?: string;
}

export interface MaintenanceInfo {
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  maintenanceCycle: number;
  maintenanceCycleUnit: 'hours' | 'days' | 'weeks' | 'months';
  totalRunHours: number;
  meanTimeBetweenFailures?: number;
  lastFailureDate?: string;
}

export interface Equipment extends Timestamped {
  id: ID;
  name: string;
  code: string;
  description: string;
  type: EquipmentType;
  state: EquipmentState;
  plantId: ID;
  productionLineId: ID;
  processZoneId: ID;
  processCellId?: ID;
  tagIds: ID[];
  parentEquipmentId?: ID;
  childEquipmentIds: ID[];
  specs: EquipmentSpec;
  maintenance: MaintenanceInfo;
  imageUrl?: string;
  documentUrls: string[];
  isInterlocked: boolean;
  isCritical: boolean;
}
