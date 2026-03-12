import { create } from 'zustand';
import type { Alarm, AlarmSummary } from '@/types/alarm';
import { AlarmPriority, AlarmState } from '@/types/alarm';

interface AlarmStoreState {
  activeAlarms: Alarm[];
  alarmCounts: AlarmSummary;

  addAlarm: (alarm: Alarm) => void;
  removeAlarm: (alarmId: string) => void;
  acknowledgeAlarm: (alarmId: string, userId: string) => void;
  clearAlarm: (alarmId: string) => void;
  shelveAlarm: (alarmId: string, userId: string, duration: number) => void;
  unshelveAlarm: (alarmId: string) => void;
  setAlarms: (alarms: Alarm[]) => void;
  getAlarmsByPriority: (priority: AlarmPriority) => Alarm[];
  getAlarmsByState: (state: AlarmState) => Alarm[];
  getAlarmsByPlant: (plantId: string) => Alarm[];
}

function computeCounts(alarms: Alarm[]): AlarmSummary {
  const active = alarms.filter((a) => a.state !== AlarmState.Cleared);
  return {
    critical: active.filter((a) => a.priority === AlarmPriority.Critical).length,
    high: active.filter((a) => a.priority === AlarmPriority.High).length,
    medium: active.filter((a) => a.priority === AlarmPriority.Medium).length,
    low: active.filter((a) => a.priority === AlarmPriority.Low).length,
    total: active.length,
    unacknowledged: active.filter((a) => a.state === AlarmState.Active).length,
    shelved: active.filter((a) => a.state === AlarmState.Shelved).length,
  };
}

export const useAlarmStore = create<AlarmStoreState>()((set, get) => ({
  activeAlarms: [],
  alarmCounts: { critical: 0, high: 0, medium: 0, low: 0, total: 0, unacknowledged: 0, shelved: 0 },

  addAlarm: (alarm: Alarm) => {
    set((state) => {
      const exists = state.activeAlarms.find((a) => a.id === alarm.id);
      if (exists) {
        const updated = state.activeAlarms.map((a) =>
          a.id === alarm.id ? { ...alarm, occurrenceCount: a.occurrenceCount + 1 } : a,
        );
        return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
      }
      const updated = [alarm, ...state.activeAlarms];
      return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
    });
  },

  removeAlarm: (alarmId: string) => {
    set((state) => {
      const updated = state.activeAlarms.filter((a) => a.id !== alarmId);
      return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
    });
  },

  acknowledgeAlarm: (alarmId: string, userId: string) => {
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.activeAlarms.map((a) =>
        a.id === alarmId
          ? { ...a, state: AlarmState.Acknowledged, acknowledgedAt: now, acknowledgedBy: userId, updatedAt: now }
          : a,
      );
      return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
    });
  },

  clearAlarm: (alarmId: string) => {
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.activeAlarms.map((a) =>
        a.id === alarmId ? { ...a, state: AlarmState.Cleared, clearedAt: now, updatedAt: now } : a,
      );
      return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
    });
  },

  shelveAlarm: (alarmId: string, userId: string, duration: number) => {
    set((state) => {
      const now = new Date();
      const shelvedUntil = new Date(now.getTime() + duration * 60 * 1000).toISOString();
      const updated = state.activeAlarms.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              state: AlarmState.Shelved,
              shelvedAt: now.toISOString(),
              shelvedBy: userId,
              shelvedUntil,
              updatedAt: now.toISOString(),
            }
          : a,
      );
      return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
    });
  },

  unshelveAlarm: (alarmId: string) => {
    set((state) => {
      const now = new Date().toISOString();
      const updated = state.activeAlarms.map((a) =>
        a.id === alarmId
          ? {
              ...a,
              state: AlarmState.Active,
              shelvedAt: undefined,
              shelvedBy: undefined,
              shelvedUntil: undefined,
              updatedAt: now,
            }
          : a,
      );
      return { activeAlarms: updated, alarmCounts: computeCounts(updated) };
    });
  },

  setAlarms: (alarms: Alarm[]) => {
    set({ activeAlarms: alarms, alarmCounts: computeCounts(alarms) });
  },

  getAlarmsByPriority: (priority: AlarmPriority) => {
    return get().activeAlarms.filter((a) => a.priority === priority);
  },

  getAlarmsByState: (state: AlarmState) => {
    return get().activeAlarms.filter((a) => a.state === state);
  },

  getAlarmsByPlant: (plantId: string) => {
    return get().activeAlarms.filter((a) => a.plantId === plantId);
  },
}));
