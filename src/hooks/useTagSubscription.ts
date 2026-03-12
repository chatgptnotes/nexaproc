import { useEffect, useMemo } from 'react';
import { useRealtimeStore } from '@/stores/useRealtimeStore';
import type { RealTimeValue } from '@/types/tag';

export function useTagSubscription(tagIds: string[]): Map<string, RealTimeValue> {
  const subscribeToTags = useRealtimeStore((s) => s.subscribeToTags);
  const unsubscribeFromTags = useRealtimeStore((s) => s.unsubscribeFromTags);
  const tagValues = useRealtimeStore((s) => s.tagValues);

  // Stabilize tagIds reference to prevent infinite re-renders
  const stableTagIds = useMemo(() => tagIds, [tagIds.join(',')]);

  useEffect(() => {
    if (stableTagIds.length === 0) return;

    subscribeToTags(stableTagIds);

    return () => {
      unsubscribeFromTags(stableTagIds);
    };
  }, [stableTagIds, subscribeToTags, unsubscribeFromTags]);

  const result = useMemo(() => {
    const map = new Map<string, RealTimeValue>();
    for (const id of stableTagIds) {
      const val = tagValues.get(id);
      if (val) {
        map.set(id, val);
      }
    }
    return map;
  }, [stableTagIds, tagValues]);

  return result;
}
