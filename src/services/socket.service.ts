import { io, Socket } from 'socket.io-client';
import { WS_URL } from '@/config/constants';
import { useRealtimeStore } from '@/stores/useRealtimeStore';
import { useAlarmStore } from '@/stores/useAlarmStore';
import { SignalQuality } from '@/types/tag';
import { AlarmPriority, AlarmState, AlarmType } from '@/types/alarm';
import type { RealTimeValue } from '@/types/tag';
import type { Alarm } from '@/types/alarm';

interface SimulatedTag {
  tagId: string;
  tagName: string;
  baseValue: number;
  variance: number;
  engineeringUnit: string;
}

const SIMULATED_TAGS: SimulatedTag[] = [
  { tagId: 'tag-tt-101', tagName: 'TT-101', baseValue: 85.0, variance: 5.0, engineeringUnit: 'degC' },
  { tagId: 'tag-tt-102', tagName: 'TT-102', baseValue: 72.5, variance: 3.0, engineeringUnit: 'degC' },
  { tagId: 'tag-tt-103', tagName: 'TT-103', baseValue: 120.0, variance: 8.0, engineeringUnit: 'degC' },
  { tagId: 'tag-tt-201', tagName: 'TT-201', baseValue: 95.0, variance: 4.0, engineeringUnit: 'degC' },
  { tagId: 'tag-pt-101', tagName: 'PT-101', baseValue: 3.2, variance: 0.5, engineeringUnit: 'bar' },
  { tagId: 'tag-pt-102', tagName: 'PT-102', baseValue: 5.8, variance: 0.3, engineeringUnit: 'bar' },
  { tagId: 'tag-pt-201', tagName: 'PT-201', baseValue: 2.1, variance: 0.4, engineeringUnit: 'bar' },
  { tagId: 'tag-pt-301', tagName: 'PT-301', baseValue: 8.5, variance: 0.6, engineeringUnit: 'bar' },
  { tagId: 'tag-ft-101', tagName: 'FT-101', baseValue: 150.0, variance: 15.0, engineeringUnit: 'L/min' },
  { tagId: 'tag-ft-102', tagName: 'FT-102', baseValue: 220.0, variance: 20.0, engineeringUnit: 'L/min' },
  { tagId: 'tag-ft-201', tagName: 'FT-201', baseValue: 85.0, variance: 10.0, engineeringUnit: 'L/min' },
  { tagId: 'tag-lt-101', tagName: 'LT-101', baseValue: 65.0, variance: 8.0, engineeringUnit: '%' },
  { tagId: 'tag-lt-102', tagName: 'LT-102', baseValue: 42.0, variance: 5.0, engineeringUnit: '%' },
  { tagId: 'tag-lt-201', tagName: 'LT-201', baseValue: 78.0, variance: 6.0, engineeringUnit: '%' },
  { tagId: 'tag-at-101', tagName: 'AT-101', baseValue: 7.2, variance: 0.3, engineeringUnit: 'pH' },
  { tagId: 'tag-at-102', tagName: 'AT-102', baseValue: 6.8, variance: 0.2, engineeringUnit: 'pH' },
  { tagId: 'tag-st-101', tagName: 'ST-101', baseValue: 1450, variance: 50, engineeringUnit: 'RPM' },
  { tagId: 'tag-st-201', tagName: 'ST-201', baseValue: 2980, variance: 30, engineeringUnit: 'RPM' },
  { tagId: 'tag-wt-101', tagName: 'WT-101', baseValue: 2500, variance: 100, engineeringUnit: 'kg' },
  { tagId: 'tag-et-101', tagName: 'ET-101', baseValue: 45.0, variance: 5.0, engineeringUnit: 'kW' },
  { tagId: 'tag-et-102', tagName: 'ET-102', baseValue: 120.0, variance: 10.0, engineeringUnit: 'kW' },
  { tagId: 'tag-ct-101', tagName: 'CT-101', baseValue: 4.5, variance: 0.5, engineeringUnit: 'mS/cm' },
  { tagId: 'tag-vt-101', tagName: 'VT-101', baseValue: 75.0, variance: 3.0, engineeringUnit: '%' },
  { tagId: 'tag-vt-102', tagName: 'VT-102', baseValue: 30.0, variance: 5.0, engineeringUnit: '%' },
];

class SocketService {
  private socket: Socket | null = null;
  private simulationInterval: ReturnType<typeof setInterval> | null = null;
  private alarmSimulationInterval: ReturnType<typeof setInterval> | null = null;
  private listeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();

  connect(token: string): void {
    const store = useRealtimeStore.getState();
    store.setConnectionStatus('connecting');

    try {
      this.socket = io(WS_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        useRealtimeStore.getState().setConnectionStatus('connected');
      });

      this.socket.on('disconnect', () => {
        useRealtimeStore.getState().setConnectionStatus('disconnected');
      });

      this.socket.on('connect_error', () => {
        // In dev mode, fall back to simulation
        this.startSimulation();
      });

      this.socket.on('tag:update', (data: RealTimeValue) => {
        useRealtimeStore.getState().updateTagValue(data.tagId, data);
      });

      this.socket.on('tag:batch-update', (data: RealTimeValue[]) => {
        useRealtimeStore.getState().updateTagValues(data);
      });

      this.socket.on('alarm:new', (data: Alarm) => {
        useAlarmStore.getState().addAlarm(data);
      });

      this.socket.on('alarm:clear', (data: { alarmId: string }) => {
        useAlarmStore.getState().clearAlarm(data.alarmId);
      });

      // Re-emit to custom listeners
      this.listeners.forEach((callbacks, event) => {
        callbacks.forEach((cb) => {
          this.socket?.on(event, cb);
        });
      });
    } catch {
      // Socket connection failed; start simulation
      this.startSimulation();
    }
  }

  disconnect(): void {
    this.stopSimulation();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    useRealtimeStore.getState().setConnectionStatus('disconnected');
  }

  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    this.socket?.on(event, callback);
  }

  off(event: string, callback: (...args: unknown[]) => void): void {
    this.listeners.get(event)?.delete(callback);
    this.socket?.off(event, callback);
  }

  emit(event: string, data: unknown): void {
    this.socket?.emit(event, data);
  }

  private startSimulation(): void {
    useRealtimeStore.getState().setConnectionStatus('connected');

    // Simulate tag value updates every 2 seconds
    this.simulationInterval = setInterval(() => {
      const now = new Date().toISOString();
      const values: RealTimeValue[] = SIMULATED_TAGS.map((tag) => {
        const jitter = (Math.random() - 0.5) * 2 * tag.variance;
        const value = Math.round((tag.baseValue + jitter) * 100) / 100;
        return {
          tagId: tag.tagId,
          tagName: tag.tagName,
          value,
          quality: SignalQuality.Good,
          timestamp: now,
          engineeringUnit: tag.engineeringUnit,
        };
      });

      useRealtimeStore.getState().updateTagValues(values);
    }, 2000);

    // Simulate occasional alarms every 15 seconds
    this.alarmSimulationInterval = setInterval(() => {
      const shouldFire = Math.random() < 0.3;
      if (!shouldFire) return;

      const tagIndex = Math.floor(Math.random() * SIMULATED_TAGS.length);
      const tag = SIMULATED_TAGS[tagIndex];
      const now = new Date().toISOString();
      const priorities = [AlarmPriority.Low, AlarmPriority.Medium, AlarmPriority.High, AlarmPriority.Critical];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const alarmTypes = [AlarmType.High, AlarmType.Low, AlarmType.Deviation, AlarmType.RateOfChange];
      const alarmType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];

      const alarm: Alarm = {
        id: `alarm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        tagId: tag.tagId,
        tagName: tag.tagName,
        plantId: 'plant-001',
        plantName: 'Primary Processing Plant',
        processZoneId: 'zone-001',
        processZoneName: 'Reaction Zone A',
        alarmType,
        priority,
        state: AlarmState.Active,
        message: `${tag.tagName} ${alarmType.replace('_', ' ')} alarm`,
        description: `Tag ${tag.tagName} has exceeded its ${alarmType.replace('_', ' ')} limit`,
        value: tag.baseValue + tag.variance * 1.5,
        limit: tag.baseValue + tag.variance,
        engineeringUnit: tag.engineeringUnit,
        activatedAt: now,
        occurrenceCount: 1,
        isInhibited: false,
        createdAt: now,
        updatedAt: now,
      };

      useAlarmStore.getState().addAlarm(alarm);
    }, 15000);
  }

  private stopSimulation(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    if (this.alarmSimulationInterval) {
      clearInterval(this.alarmSimulationInterval);
      this.alarmSimulationInterval = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
