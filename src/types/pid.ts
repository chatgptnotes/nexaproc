import type { ID, Timestamped, Coordinate } from './common';

export enum PidElementType {
  Valve = 'valve',
  Pump = 'pump',
  Motor = 'motor',
  Tank = 'tank',
  Reactor = 'reactor',
  HeatExchanger = 'heat_exchanger',
  Mixer = 'mixer',
  Compressor = 'compressor',
  Filter = 'filter',
  Column = 'column',
  Instrument = 'instrument',
  Controller = 'controller',
  Transmitter = 'transmitter',
  Indicator = 'indicator',
  Junction = 'junction',
  Label = 'label',
  Annotation = 'annotation',
  Boundary = 'boundary',
}

export enum PidConnectionType {
  Pipe = 'pipe',
  Signal = 'signal',
  Electrical = 'electrical',
  Pneumatic = 'pneumatic',
  Hydraulic = 'hydraulic',
  DataLink = 'data_link',
}

export enum LineStyle {
  Solid = 'solid',
  Dashed = 'dashed',
  Dotted = 'dotted',
  DashDot = 'dash_dot',
}

export interface TagBinding {
  tagId: ID;
  tagName: string;
  propertyName: string;
  displayFormat?: string;
}

export interface PidElementStyle {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  fontSize?: number;
}

export interface PidElement {
  id: ID;
  type: PidElementType;
  label: string;
  position: Coordinate;
  size: { width: number; height: number };
  rotation: number;
  tagBindings: TagBinding[];
  style: PidElementStyle;
  equipmentId?: ID;
  metadata: Record<string, string>;
  isLocked: boolean;
  layerId?: ID;
  zIndex: number;
}

export interface PidConnection {
  id: ID;
  source: ID;
  sourceHandle: string;
  target: ID;
  targetHandle: string;
  type: PidConnectionType;
  lineStyle: LineStyle;
  label?: string;
  color?: string;
  strokeWidth: number;
  animated: boolean;
  waypoints: Coordinate[];
  metadata: Record<string, string>;
}

export interface PidLayer {
  id: ID;
  name: string;
  visible: boolean;
  locked: boolean;
  opacity: number;
  order: number;
}

export interface PidLayout extends Timestamped {
  id: ID;
  name: string;
  description: string;
  plantId: ID;
  processZoneId?: ID;
  version: string;
  elements: PidElement[];
  connections: PidConnection[];
  layers: PidLayer[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  gridSize: number;
  snapToGrid: boolean;
  isLocked: boolean;
  lastEditedBy: string;
}
