import type { ID, Timestamped } from './common';

export enum TagType {
  AnalogInput = 'analog_input',
  AnalogOutput = 'analog_output',
  DigitalInput = 'digital_input',
  DigitalOutput = 'digital_output',
  Calculated = 'calculated',
  Manual = 'manual',
}

export enum TagDataType {
  Float = 'float',
  Integer = 'integer',
  Boolean = 'boolean',
  String = 'string',
}

export enum SignalQuality {
  Good = 'good',
  Uncertain = 'uncertain',
  Bad = 'bad',
  NotConnected = 'not_connected',
}

export interface EngineeringUnit {
  symbol: string;
  name: string;
  category: string;
}

export const COMMON_UNITS: EngineeringUnit[] = [
  { symbol: 'degC', name: 'Degrees Celsius', category: 'Temperature' },
  { symbol: 'degF', name: 'Degrees Fahrenheit', category: 'Temperature' },
  { symbol: 'K', name: 'Kelvin', category: 'Temperature' },
  { symbol: 'bar', name: 'Bar', category: 'Pressure' },
  { symbol: 'psi', name: 'Pounds per Square Inch', category: 'Pressure' },
  { symbol: 'kPa', name: 'Kilopascal', category: 'Pressure' },
  { symbol: 'MPa', name: 'Megapascal', category: 'Pressure' },
  { symbol: 'L/min', name: 'Litres per Minute', category: 'Flow' },
  { symbol: 'm3/h', name: 'Cubic Metres per Hour', category: 'Flow' },
  { symbol: 'GPM', name: 'Gallons per Minute', category: 'Flow' },
  { symbol: '%', name: 'Percent', category: 'Ratio' },
  { symbol: 'mm', name: 'Millimetres', category: 'Length' },
  { symbol: 'm', name: 'Metres', category: 'Length' },
  { symbol: 'kg', name: 'Kilograms', category: 'Mass' },
  { symbol: 'kg/h', name: 'Kilograms per Hour', category: 'Mass Flow' },
  { symbol: 't/h', name: 'Tonnes per Hour', category: 'Mass Flow' },
  { symbol: 'RPM', name: 'Revolutions per Minute', category: 'Speed' },
  { symbol: 'm/s', name: 'Metres per Second', category: 'Speed' },
  { symbol: 'pH', name: 'pH', category: 'Chemistry' },
  { symbol: 'mS/cm', name: 'Millisiemens per Centimetre', category: 'Conductivity' },
  { symbol: 'A', name: 'Amperes', category: 'Electrical' },
  { symbol: 'V', name: 'Volts', category: 'Electrical' },
  { symbol: 'kW', name: 'Kilowatts', category: 'Power' },
  { symbol: 'kWh', name: 'Kilowatt-hours', category: 'Energy' },
  { symbol: 'Hz', name: 'Hertz', category: 'Frequency' },
];

export interface AlarmLimits {
  highHigh?: number;
  high?: number;
  low?: number;
  lowLow?: number;
  deadband?: number;
  deviationHigh?: number;
  deviationLow?: number;
  rateOfChange?: number;
}

export interface ScalingConfig {
  rawMin: number;
  rawMax: number;
  engMin: number;
  engMax: number;
  clampEnabled: boolean;
}

export interface Tag extends Timestamped {
  id: ID;
  name: string;
  description: string;
  tagType: TagType;
  dataType: TagDataType;
  engineeringUnit: string;
  equipmentId?: ID;
  processZoneId?: ID;
  plantId: ID;
  rangeMin: number;
  rangeMax: number;
  alarmLimits: AlarmLimits;
  scaling?: ScalingConfig;
  ioAddress?: string;
  scanRate: number;
  isEnabled: boolean;
  isHistorized: boolean;
  decimalPlaces: number;
}

export interface RealTimeValue {
  tagId: ID;
  tagName: string;
  value: number | string | boolean;
  quality: SignalQuality;
  timestamp: string;
  engineeringUnit: string;
}

export interface HistoricalDataPoint {
  timestamp: string;
  value: number;
  quality: SignalQuality;
}

export interface TagTrend {
  tagId: ID;
  tagName: string;
  engineeringUnit: string;
  data: HistoricalDataPoint[];
}
