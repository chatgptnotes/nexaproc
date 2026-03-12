import type { ID, Timestamped } from './common';

export enum PlantStatus {
  Online = 'online',
  Offline = 'offline',
  Maintenance = 'maintenance',
  Alarm = 'alarm',
  Degraded = 'degraded',
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  country: string;
}

export interface Plant extends Timestamped {
  id: ID;
  name: string;
  code: string;
  description: string;
  status: PlantStatus;
  location: GeoLocation;
  timezone: string;
  productionLines: ProductionLine[];
  totalEquipment: number;
  activeAlarms: number;
  oee: number;
  imageUrl?: string;
}

export enum LineStatus {
  Running = 'running',
  Stopped = 'stopped',
  Changeover = 'changeover',
  Maintenance = 'maintenance',
  Fault = 'fault',
}

export interface ProductionLine extends Timestamped {
  id: ID;
  plantId: ID;
  name: string;
  code: string;
  description: string;
  status: LineStatus;
  processZones: ProcessZone[];
  currentProduct?: string;
  throughput: number;
  throughputUnit: string;
  targetThroughput: number;
}

export enum ZoneStatus {
  Active = 'active',
  Idle = 'idle',
  Fault = 'fault',
  Maintenance = 'maintenance',
}

export interface ProcessZone extends Timestamped {
  id: ID;
  productionLineId: ID;
  name: string;
  code: string;
  description: string;
  status: ZoneStatus;
  processCells: ProcessCell[];
  equipmentCount: number;
  tagCount: number;
}

export enum CellStatus {
  Active = 'active',
  Idle = 'idle',
  Fault = 'fault',
  Maintenance = 'maintenance',
}

export interface ProcessCell extends Timestamped {
  id: ID;
  processZoneId: ID;
  name: string;
  code: string;
  description: string;
  status: CellStatus;
  equipmentIds: ID[];
}
