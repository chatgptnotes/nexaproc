import { create } from 'zustand';
import type { Plant } from '@/types/plant';

interface ProcessStoreState {
  plants: Plant[];
  selectedPlantId: string | null;
  selectedLineId: string | null;
  selectedZoneId: string | null;

  setPlants: (plants: Plant[]) => void;
  selectPlant: (plantId: string | null) => void;
  selectLine: (lineId: string | null) => void;
  selectZone: (zoneId: string | null) => void;
  getSelectedPlant: () => Plant | undefined;
  updatePlant: (plantId: string, updates: Partial<Plant>) => void;
}

export const useProcessStore = create<ProcessStoreState>()((set, get) => ({
  plants: [],
  selectedPlantId: null,
  selectedLineId: null,
  selectedZoneId: null,

  setPlants: (plants: Plant[]) => {
    set({ plants });
  },

  selectPlant: (plantId: string | null) => {
    set({
      selectedPlantId: plantId,
      selectedLineId: null,
      selectedZoneId: null,
    });
  },

  selectLine: (lineId: string | null) => {
    set({
      selectedLineId: lineId,
      selectedZoneId: null,
    });
  },

  selectZone: (zoneId: string | null) => {
    set({ selectedZoneId: zoneId });
  },

  getSelectedPlant: () => {
    const { plants, selectedPlantId } = get();
    if (!selectedPlantId) return undefined;
    return plants.find((p) => p.id === selectedPlantId);
  },

  updatePlant: (plantId: string, updates: Partial<Plant>) => {
    set((state) => ({
      plants: state.plants.map((p) => (p.id === plantId ? { ...p, ...updates } : p)),
    }));
  },
}));
