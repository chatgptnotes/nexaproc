import { create } from 'zustand';
import type { ScadaScreen, ScreenElement, ScreenConnection } from '@/types/screen';

// ─── Demo Screens ────────────────────────────────────────────────────────────

function makeDemoScreens(): ScadaScreen[] {
  const now = new Date().toISOString();

  // ── Demo 1: Pharma OSD Granulation ──────────────────────────────────────
  const osdElements: ScreenElement[] = [
    { id: 'el-1', symbolIndex: 0, categoryKey: 'vessels', symbolName: 'Storage Tank', position: { x: 80, y: 200 }, size: 72, rotation: 0, state: 'running', animated: true, fillLevel: 75, label: 'Raw Material', tagBindings: [] },
    { id: 'el-2', symbolIndex: 0, categoryKey: 'pumps', symbolName: 'Centrifugal Pump', position: { x: 250, y: 230 }, size: 56, rotation: 0, state: 'running', animated: true, tagBindings: [] },
    { id: 'el-3', symbolIndex: 5, categoryKey: 'process', symbolName: 'Granulator', position: { x: 420, y: 180 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Granulator', tagBindings: [] },
    { id: 'el-4', symbolIndex: 2, categoryKey: 'process', symbolName: 'Dryer', position: { x: 600, y: 180 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Fluid Bed Dryer', tagBindings: [] },
    { id: 'el-5', symbolIndex: 0, categoryKey: 'instruments', symbolName: 'Instrument Bubble', position: { x: 420, y: 80 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'TI-101', tagBindings: [] },
    { id: 'el-6', symbolIndex: 4, categoryKey: 'instruments', symbolName: 'Pressure Indicator', position: { x: 600, y: 80 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'PI-102', tagBindings: [] },
    { id: 'el-7', symbolIndex: 5, categoryKey: 'valves', symbolName: 'Control Valve', position: { x: 330, y: 230 }, size: 48, rotation: 0, state: 'open', animated: false, label: 'CV-101', tagBindings: [] },
    { id: 'el-8', symbolIndex: 7, categoryKey: 'process', symbolName: 'Tablet Press', position: { x: 780, y: 180 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Tablet Press', tagBindings: [] },
    { id: 'el-9', symbolIndex: 6, categoryKey: 'process', symbolName: 'Coater', position: { x: 960, y: 180 }, size: 72, rotation: 0, state: 'standby', animated: false, label: 'Film Coater', tagBindings: [] },
    { id: 'el-10', symbolIndex: 10, categoryKey: 'vessels', symbolName: 'Jacketed Vessel', position: { x: 80, y: 400 }, size: 72, rotation: 0, state: 'running', animated: true, fillLevel: 60, label: 'Binder Solution', tagBindings: [] },
  ];

  const osdConnections: ScreenConnection[] = [
    { id: 'c-1', sourceId: 'el-1', targetId: 'el-2', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-2', sourceId: 'el-2', targetId: 'el-7', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-3', sourceId: 'el-7', targetId: 'el-3', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-4', sourceId: 'el-3', targetId: 'el-4', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-5', sourceId: 'el-4', targetId: 'el-8', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-6', sourceId: 'el-8', targetId: 'el-9', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: false },
    { id: 'c-7', sourceId: 'el-5', targetId: 'el-3', sourceHandle: 'bottom', targetHandle: 'top', type: 'signal', animated: false },
    { id: 'c-8', sourceId: 'el-6', targetId: 'el-4', sourceHandle: 'bottom', targetHandle: 'top', type: 'signal', animated: false },
    { id: 'c-9', sourceId: 'el-10', targetId: 'el-3', sourceHandle: 'right', targetHandle: 'bottom', type: 'pipe', animated: true },
  ];

  // ── Demo 2: Dairy Pasteurization ────────────────────────────────────────
  const dairyElements: ScreenElement[] = [
    { id: 'el-1', symbolIndex: 0, categoryKey: 'vessels', symbolName: 'Storage Tank', position: { x: 80, y: 200 }, size: 72, rotation: 0, state: 'running', animated: true, fillLevel: 85, label: 'Raw Milk Silo', tagBindings: [] },
    { id: 'el-2', symbolIndex: 0, categoryKey: 'pumps', symbolName: 'Centrifugal Pump', position: { x: 240, y: 230 }, size: 56, rotation: 0, state: 'running', animated: true, label: 'Feed Pump', tagBindings: [] },
    { id: 'el-3', symbolIndex: 1, categoryKey: 'exchangers', symbolName: 'Plate HX', position: { x: 400, y: 190 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Pre-Heater', tagBindings: [] },
    { id: 'el-4', symbolIndex: 12, categoryKey: 'process', symbolName: 'Pasteurizer', position: { x: 580, y: 190 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Pasteurizer', tagBindings: [] },
    { id: 'el-5', symbolIndex: 11, categoryKey: 'process', symbolName: 'Homogenizer', position: { x: 760, y: 190 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Homogenizer', tagBindings: [] },
    { id: 'el-6', symbolIndex: 1, categoryKey: 'exchangers', symbolName: 'Plate HX', position: { x: 940, y: 190 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Cooler', tagBindings: [] },
    { id: 'el-7', symbolIndex: 0, categoryKey: 'vessels', symbolName: 'Storage Tank', position: { x: 1100, y: 200 }, size: 72, rotation: 0, state: 'running', animated: true, fillLevel: 40, label: 'Product Tank', tagBindings: [] },
    { id: 'el-8', symbolIndex: 1, categoryKey: 'instruments', symbolName: 'Temperature Indicator', position: { x: 580, y: 80 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'TI-201', tagBindings: [] },
    { id: 'el-9', symbolIndex: 7, categoryKey: 'instruments', symbolName: 'Flow Indicator', position: { x: 240, y: 140 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'FI-201', tagBindings: [] },
    { id: 'el-10', symbolIndex: 5, categoryKey: 'valves', symbolName: 'Control Valve', position: { x: 320, y: 230 }, size: 48, rotation: 0, state: 'open', animated: false, label: 'FCV-201', tagBindings: [] },
    { id: 'el-11', symbolIndex: 14, categoryKey: 'process', symbolName: 'Separator', position: { x: 400, y: 380 }, size: 64, rotation: 0, state: 'running', animated: true, label: 'Cream Separator', tagBindings: [] },
  ];

  const dairyConnections: ScreenConnection[] = [
    { id: 'c-1', sourceId: 'el-1', targetId: 'el-2', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-2', sourceId: 'el-2', targetId: 'el-10', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-3', sourceId: 'el-10', targetId: 'el-3', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-4', sourceId: 'el-3', targetId: 'el-4', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-5', sourceId: 'el-4', targetId: 'el-5', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-6', sourceId: 'el-5', targetId: 'el-6', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-7', sourceId: 'el-6', targetId: 'el-7', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-8', sourceId: 'el-8', targetId: 'el-4', sourceHandle: 'bottom', targetHandle: 'top', type: 'signal', animated: false },
    { id: 'c-9', sourceId: 'el-9', targetId: 'el-2', sourceHandle: 'bottom', targetHandle: 'top', type: 'signal', animated: false },
    { id: 'c-10', sourceId: 'el-3', targetId: 'el-11', sourceHandle: 'bottom', targetHandle: 'top', type: 'pipe', animated: true },
  ];

  // ── Demo 3: Reactor Loop with Heat Exchange ─────────────────────────────
  const reactorElements: ScreenElement[] = [
    { id: 'el-1', symbolIndex: 0, categoryKey: 'vessels', symbolName: 'Storage Tank', position: { x: 80, y: 180 }, size: 72, rotation: 0, state: 'running', animated: true, fillLevel: 90, label: 'Feed Tank', tagBindings: [] },
    { id: 'el-2', symbolIndex: 0, categoryKey: 'pumps', symbolName: 'Centrifugal Pump', position: { x: 250, y: 210 }, size: 56, rotation: 0, state: 'running', animated: true, label: 'Feed Pump', tagBindings: [] },
    { id: 'el-3', symbolIndex: 0, categoryKey: 'exchangers', symbolName: 'Shell & Tube HX', position: { x: 420, y: 170 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Feed Pre-Heater', tagBindings: [] },
    { id: 'el-4', symbolIndex: 2, categoryKey: 'vessels', symbolName: 'Reactor (CSTR)', position: { x: 620, y: 150 }, size: 80, rotation: 0, state: 'running', animated: true, fillLevel: 70, label: 'CSTR Reactor', tagBindings: [] },
    { id: 'el-5', symbolIndex: 7, categoryKey: 'motors', symbolName: 'Agitator', position: { x: 620, y: 60 }, size: 48, rotation: 0, state: 'running', animated: true, label: 'Agitator M-301', tagBindings: [] },
    { id: 'el-6', symbolIndex: 0, categoryKey: 'exchangers', symbolName: 'Shell & Tube HX', position: { x: 850, y: 170 }, size: 72, rotation: 0, state: 'running', animated: true, label: 'Product Cooler', tagBindings: [] },
    { id: 'el-7', symbolIndex: 0, categoryKey: 'vessels', symbolName: 'Storage Tank', position: { x: 1050, y: 180 }, size: 72, rotation: 0, state: 'running', animated: true, fillLevel: 35, label: 'Product Tank', tagBindings: [] },
    { id: 'el-8', symbolIndex: 2, categoryKey: 'instruments', symbolName: 'Temperature Controller', position: { x: 620, y: 350 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'TIC-301', tagBindings: [] },
    { id: 'el-9', symbolIndex: 5, categoryKey: 'instruments', symbolName: 'Pressure Transmitter', position: { x: 750, y: 80 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'PT-301', tagBindings: [] },
    { id: 'el-10', symbolIndex: 8, categoryKey: 'instruments', symbolName: 'Flow Controller', position: { x: 250, y: 120 }, size: 48, rotation: 0, state: 'normal', animated: false, label: 'FIC-301', tagBindings: [] },
    { id: 'el-11', symbolIndex: 5, categoryKey: 'valves', symbolName: 'Control Valve', position: { x: 340, y: 210 }, size: 48, rotation: 0, state: 'open', animated: false, label: 'FCV-301', tagBindings: [] },
    { id: 'el-12', symbolIndex: 6, categoryKey: 'valves', symbolName: 'Relief Valve', position: { x: 700, y: 80 }, size: 48, rotation: 0, state: 'closed', animated: false, label: 'PSV-301', tagBindings: [] },
  ];

  const reactorConnections: ScreenConnection[] = [
    { id: 'c-1', sourceId: 'el-1', targetId: 'el-2', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-2', sourceId: 'el-2', targetId: 'el-11', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-3', sourceId: 'el-11', targetId: 'el-3', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-4', sourceId: 'el-3', targetId: 'el-4', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-5', sourceId: 'el-5', targetId: 'el-4', sourceHandle: 'bottom', targetHandle: 'top', type: 'electrical', animated: false },
    { id: 'c-6', sourceId: 'el-4', targetId: 'el-6', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-7', sourceId: 'el-6', targetId: 'el-7', sourceHandle: 'right', targetHandle: 'left', type: 'pipe', animated: true },
    { id: 'c-8', sourceId: 'el-8', targetId: 'el-4', sourceHandle: 'top', targetHandle: 'bottom', type: 'signal', animated: false },
    { id: 'c-9', sourceId: 'el-9', targetId: 'el-4', sourceHandle: 'bottom', targetHandle: 'right', type: 'signal', animated: false },
    { id: 'c-10', sourceId: 'el-10', targetId: 'el-11', sourceHandle: 'bottom', targetHandle: 'top', type: 'signal', animated: false },
  ];

  return [
    {
      id: 'screen-demo-1',
      projectId: 'proj-001',
      name: 'OSD Granulation Line',
      description: 'Oral Solid Dosage — granulation, drying, compression, and coating process',
      elements: osdElements,
      connections: osdConnections,
      viewport: { x: 0, y: 0, zoom: 1 },
      gridSize: 20,
      snapToGrid: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'screen-demo-2',
      projectId: 'proj-002',
      name: 'Dairy Pasteurization',
      description: 'Milk reception, pasteurization, homogenization, cooling, and storage',
      elements: dairyElements,
      connections: dairyConnections,
      viewport: { x: 0, y: 0, zoom: 1 },
      gridSize: 20,
      snapToGrid: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'screen-demo-3',
      projectId: 'proj-001',
      name: 'Reactor Loop — CSTR',
      description: 'Continuous stirred-tank reactor with feed pre-heat and product cooling',
      elements: reactorElements,
      connections: reactorConnections,
      viewport: { x: 0, y: 0, zoom: 1 },
      gridSize: 20,
      snapToGrid: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// ─── Zustand Store ───────────────────────────────────────────────────────────

interface ScreenStore {
  screens: ScadaScreen[];
  addScreen: (screen: ScadaScreen) => void;
  updateScreen: (id: string, updates: Partial<ScadaScreen>) => void;
  deleteScreen: (id: string) => void;
  getScreensByProject: (projectId: string) => ScadaScreen[];
  getScreen: (id: string) => ScadaScreen | undefined;
  duplicateScreen: (id: string) => void;
}

export const useScreenStore = create<ScreenStore>((set, get) => ({
  screens: makeDemoScreens(),

  addScreen: (screen) =>
    set((s) => ({ screens: [...s.screens, screen] })),

  updateScreen: (id, updates) =>
    set((s) => ({
      screens: s.screens.map((sc) =>
        sc.id === id ? { ...sc, ...updates, updatedAt: new Date().toISOString() } : sc,
      ),
    })),

  deleteScreen: (id) =>
    set((s) => ({ screens: s.screens.filter((sc) => sc.id !== id) })),

  getScreensByProject: (projectId) =>
    get().screens.filter((sc) => sc.projectId === projectId),

  getScreen: (id) =>
    get().screens.find((sc) => sc.id === id),

  duplicateScreen: (id) => {
    const original = get().screens.find((sc) => sc.id === id);
    if (!original) return;
    const now = new Date().toISOString();
    const clone: ScadaScreen = {
      ...original,
      id: `screen-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    set((s) => ({ screens: [...s.screens, clone] }));
  },
}));
