import { create } from 'zustand';
import type { RealTimeValue } from '@/types/tag';

export type ConnectionStatus = 'connected' | 'disconnected' | 'connecting';

interface RealtimeStoreState {
  tagValues: Map<string, RealTimeValue>;
  connectionStatus: ConnectionStatus;
  subscribedTags: Set<string>;

  updateTagValue: (tagId: string, value: RealTimeValue) => void;
  updateTagValues: (values: RealTimeValue[]) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  subscribeToTags: (tagIds: string[]) => void;
  unsubscribeFromTags: (tagIds: string[]) => void;
  getTagValue: (tagId: string) => RealTimeValue | undefined;
  getTagValues: (tagIds: string[]) => Map<string, RealTimeValue>;
  clearAll: () => void;
}

export const useRealtimeStore = create<RealtimeStoreState>()((set, get) => ({
  tagValues: new Map<string, RealTimeValue>(),
  connectionStatus: 'disconnected' as ConnectionStatus,
  subscribedTags: new Set<string>(),

  updateTagValue: (tagId: string, value: RealTimeValue) => {
    set((state) => {
      const newMap = new Map(state.tagValues);
      newMap.set(tagId, value);
      return { tagValues: newMap };
    });
  },

  updateTagValues: (values: RealTimeValue[]) => {
    set((state) => {
      const newMap = new Map(state.tagValues);
      for (const v of values) {
        newMap.set(v.tagId, v);
      }
      return { tagValues: newMap };
    });
  },

  setConnectionStatus: (status: ConnectionStatus) => {
    set({ connectionStatus: status });
  },

  subscribeToTags: (tagIds: string[]) => {
    set((state) => {
      const newSet = new Set(state.subscribedTags);
      for (const id of tagIds) {
        newSet.add(id);
      }
      return { subscribedTags: newSet };
    });
  },

  unsubscribeFromTags: (tagIds: string[]) => {
    set((state) => {
      const newSet = new Set(state.subscribedTags);
      for (const id of tagIds) {
        newSet.delete(id);
      }
      return { subscribedTags: newSet };
    });
  },

  getTagValue: (tagId: string) => {
    return get().tagValues.get(tagId);
  },

  getTagValues: (tagIds: string[]) => {
    const result = new Map<string, RealTimeValue>();
    const all = get().tagValues;
    for (const id of tagIds) {
      const val = all.get(id);
      if (val) {
        result.set(id, val);
      }
    }
    return result;
  },

  clearAll: () => {
    set({
      tagValues: new Map(),
      subscribedTags: new Set(),
      connectionStatus: 'disconnected',
    });
  },
}));
