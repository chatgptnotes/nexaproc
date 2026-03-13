// ─── SCADA Screen Types ──────────────────────────────────────────────────────

export interface ScreenTagBinding {
  tagId: string;
  tagName: string;
  property: 'state' | 'fillLevel' | 'value' | 'label';
  format?: string;
}

export interface ScreenElement {
  id: string;
  /** Index within the category's symbols array */
  symbolIndex: number;
  /** Category key (e.g., 'valves', 'vessels') */
  categoryKey: string;
  /** Display name from the symbol entry */
  symbolName: string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  state: string;
  animated: boolean;
  fillLevel?: number;
  label?: string;
  tagBindings: ScreenTagBinding[];
}

export interface ScreenConnection {
  id: string;
  sourceId: string;
  targetId: string;
  sourceHandle?: string;
  targetHandle?: string;
  type: 'pipe' | 'signal' | 'electrical' | 'pneumatic';
  animated: boolean;
  label?: string;
  color?: string;
}

export interface ScadaScreen {
  id: string;
  projectId: string;
  name: string;
  description: string;
  elements: ScreenElement[];
  connections: ScreenConnection[];
  viewport: { x: number; y: number; zoom: number };
  gridSize: number;
  snapToGrid: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}
