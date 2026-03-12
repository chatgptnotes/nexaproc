import type { ID, Timestamped } from './common';

export enum AlarmPriority {
  Critical = 'critical',
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}

export enum AlarmState {
  Active = 'active',
  Acknowledged = 'acknowledged',
  Cleared = 'cleared',
  Shelved = 'shelved',
}

export enum AlarmType {
  HighHigh = 'high_high',
  High = 'high',
  Low = 'low',
  LowLow = 'low_low',
  Deviation = 'deviation',
  RateOfChange = 'rate_of_change',
  Digital = 'digital',
  Communication = 'communication',
  SystemFault = 'system_fault',
  Equipment = 'equipment',
}

export interface Alarm extends Timestamped {
  id: ID;
  tagId: ID;
  tagName: string;
  equipmentId?: ID;
  equipmentName?: string;
  plantId: ID;
  plantName: string;
  processZoneId?: ID;
  processZoneName?: string;
  alarmType: AlarmType;
  priority: AlarmPriority;
  state: AlarmState;
  message: string;
  description: string;
  value: number | string | boolean;
  limit: number | string | boolean;
  engineeringUnit: string;
  activatedAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  clearedAt?: string;
  shelvedAt?: string;
  shelvedBy?: string;
  shelvedUntil?: string;
  occurrenceCount: number;
  isInhibited: boolean;
}

export interface AlarmConfig extends Timestamped {
  id: ID;
  tagId: ID;
  tagName: string;
  alarmType: AlarmType;
  priority: AlarmPriority;
  enabled: boolean;
  limit: number;
  deadband: number;
  delay: number;
  message: string;
  description: string;
  consequenceDescription: string;
  correctionAction: string;
  groupId?: ID;
  groupName?: string;
}

export interface AlarmGroup extends Timestamped {
  id: ID;
  name: string;
  description: string;
  plantId: ID;
  processZoneId?: ID;
  alarmConfigIds: ID[];
}

export interface AlarmSummary {
  critical: number;
  high: number;
  medium: number;
  low: number;
  total: number;
  unacknowledged: number;
  shelved: number;
}
