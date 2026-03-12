export type EquipmentState = 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby';

export interface EquipmentTag {
  tagId: string;
  label: string;
  value: number;
  unit: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  state: EquipmentState;
  plantId: string;
  zoneId: string;
  runtimeHours: number;
  tags: EquipmentTag[];
}

export const equipment: Equipment[] = [
  // ============================================================
  // PHARMA PLANT ALPHA (plant-001)
  // ============================================================

  // -- Reactors --
  {
    id: 'R-101',
    name: 'High-Shear Granulator R-101',
    type: 'Reactor',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-01',
    runtimeHours: 4820,
    tags: [
      { tagId: 'TT-101', label: 'Jacket Temp', value: 52.3, unit: '°C' },
      { tagId: 'PT-101', label: 'Internal Pressure', value: 2.4, unit: 'bar' },
      { tagId: 'ST-101', label: 'Impeller Speed', value: 1450, unit: 'RPM' },
    ],
  },
  {
    id: 'R-201',
    name: 'Mixing Vessel MV-101',
    type: 'Reactor',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-02-01',
    runtimeHours: 3250,
    tags: [
      { tagId: 'TT-301', label: 'Temperature', value: 22.1, unit: '°C' },
      { tagId: 'LT-301', label: 'Level', value: 67.4, unit: '%' },
    ],
  },

  // -- Heat Exchangers --
  {
    id: 'HX-101',
    name: 'Granulator Jacket Heat Exchanger',
    type: 'Heat Exchanger',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-01',
    runtimeHours: 4815,
    tags: [
      { tagId: 'TT-101', label: 'Process Side Temp', value: 52.3, unit: '°C' },
    ],
  },
  {
    id: 'HX-201',
    name: 'HTST Plate Heat Exchanger',
    type: 'Heat Exchanger',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-01-01',
    runtimeHours: 6120,
    tags: [
      { tagId: 'TT-402', label: 'Holding Temp', value: 74.9, unit: '°C' },
      { tagId: 'FT-401', label: 'Milk Flow', value: 425.3, unit: 'L/min' },
    ],
  },

  // -- Pumps --
  {
    id: 'P-101',
    name: 'Granulation Spray Pump',
    type: 'Pump',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-01',
    runtimeHours: 3150,
    tags: [
      { tagId: 'FT-101', label: 'Flow Rate', value: 12.8, unit: 'L/min' },
    ],
  },
  {
    id: 'P-102',
    name: 'Coating Solution Pump',
    type: 'Pump',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-03',
    runtimeHours: 2840,
    tags: [
      { tagId: 'TIC-201', label: 'Coating Temp', value: 42.8, unit: '°C' },
    ],
  },
  {
    id: 'P-103',
    name: 'Filtration Feed Pump',
    type: 'Pump',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-02-01',
    runtimeHours: 2910,
    tags: [
      { tagId: 'PT-301', label: 'Diff Pressure', value: 0.85, unit: 'bar' },
    ],
  },
  {
    id: 'P-104',
    name: 'Raw Milk Intake Pump',
    type: 'Pump',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-01-01',
    runtimeHours: 5480,
    tags: [
      { tagId: 'FT-401', label: 'Flow', value: 425.3, unit: 'L/min' },
    ],
  },
  {
    id: 'P-105',
    name: 'Homogenizer Feed Pump',
    type: 'Pump',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-01-01',
    runtimeHours: 5200,
    tags: [
      { tagId: 'PT-401', label: 'Discharge Pressure', value: 180.2, unit: 'bar' },
    ],
  },
  {
    id: 'P-106',
    name: 'Syrup Transfer Pump',
    type: 'Pump',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-02-01',
    runtimeHours: 4100,
    tags: [
      { tagId: 'FIC-201', label: 'Syrup Flow', value: 85.6, unit: 'L/min' },
    ],
  },
  {
    id: 'P-107',
    name: 'Dye Liquor Circulation Pump JD-201',
    type: 'Pump',
    state: 'standby',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-02-01',
    runtimeHours: 7200,
    tags: [
      { tagId: 'FT-701', label: 'Circulation Flow', value: 220.8, unit: 'L/min' },
    ],
  },
  {
    id: 'P-108',
    name: 'CIP Return Pump',
    type: 'Pump',
    state: 'stopped',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-02-02',
    runtimeHours: 3800,
    tags: [],
  },

  // -- Valves --
  {
    id: 'XV-101',
    name: 'Granulator Discharge Valve',
    type: 'Valve',
    state: 'stopped',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-01',
    runtimeHours: 4800,
    tags: [
      { tagId: 'XV-101', label: 'Position', value: 0, unit: '' },
    ],
  },
  {
    id: 'FCV-201',
    name: 'Syrup Flow Control Valve',
    type: 'Valve',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-02-01',
    runtimeHours: 4050,
    tags: [
      { tagId: 'FIC-201', label: 'Flow SP', value: 85.6, unit: 'L/min' },
    ],
  },
  {
    id: 'PCV-301',
    name: 'Carbonation Pressure Control Valve',
    type: 'Valve',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-02-02',
    runtimeHours: 3900,
    tags: [
      { tagId: 'PIC-301', label: 'Pressure', value: 3.4, unit: 'bar' },
    ],
  },

  // -- Motors --
  {
    id: 'M-101',
    name: 'Granulator Impeller Motor',
    type: 'Motor',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-01',
    runtimeHours: 4820,
    tags: [
      { tagId: 'ST-101', label: 'Speed', value: 1450, unit: 'RPM' },
      { tagId: 'HS-101', label: 'Run Status', value: 1, unit: '' },
    ],
  },
  {
    id: 'M-102',
    name: 'Tablet Press Main Motor',
    type: 'Motor',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-02',
    runtimeHours: 3600,
    tags: [
      { tagId: 'ST-102', label: 'Turret Speed', value: 62, unit: 'RPM' },
    ],
  },
  {
    id: 'M-103',
    name: 'Loom AJL-101 Drive Motor',
    type: 'Motor',
    state: 'running',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-01-02',
    runtimeHours: 8400,
    tags: [
      { tagId: 'ST-601', label: 'Speed', value: 720, unit: 'picks/min' },
    ],
  },
  {
    id: 'M-104',
    name: 'Loom AJL-103 Drive Motor',
    type: 'Motor',
    state: 'fault',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-01-02',
    runtimeHours: 7900,
    tags: [
      { tagId: 'ST-603', label: 'Speed', value: 0, unit: 'picks/min' },
    ],
  },

  // -- Mixers --
  {
    id: 'MX-101',
    name: 'Coating Pan Mixer',
    type: 'Mixer',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-03',
    runtimeHours: 2800,
    tags: [
      { tagId: 'TIC-201', label: 'Temperature', value: 42.8, unit: '°C' },
    ],
  },
  {
    id: 'MX-201',
    name: 'Sugar Dissolving Mixer',
    type: 'Mixer',
    state: 'running',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-02-01',
    runtimeHours: 4200,
    tags: [
      { tagId: 'TT-501', label: 'Temperature', value: 72.4, unit: '°C' },
    ],
  },

  // -- Conveyors --
  {
    id: 'CV-101',
    name: 'Tablet Press Output Conveyor',
    type: 'Conveyor',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-02',
    runtimeHours: 3550,
    tags: [],
  },
  {
    id: 'CV-102',
    name: 'Packaging Line Conveyor',
    type: 'Conveyor',
    state: 'stopped',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-03-02',
    runtimeHours: 2100,
    tags: [],
  },

  // -- Compressors --
  {
    id: 'CP-101',
    name: 'Compressed Air Supply Compressor',
    type: 'Compressor',
    state: 'running',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-01-02',
    runtimeHours: 12400,
    tags: [
      { tagId: 'PT-601', label: 'Discharge Pressure', value: 4.8, unit: 'bar' },
    ],
  },

  // -- Boilers --
  {
    id: 'BL-101',
    name: 'Steam Boiler BL-101',
    type: 'Boiler',
    state: 'running',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-02-01',
    runtimeHours: 11800,
    tags: [
      { tagId: 'TT-701', label: 'Steam Temp', value: 95.6, unit: '°C' },
    ],
  },

  // -- Filters --
  {
    id: 'FL-101',
    name: 'Sterile Filtration Unit',
    type: 'Filter',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-02-01',
    runtimeHours: 2900,
    tags: [
      { tagId: 'PT-301', label: 'Diff Pressure', value: 0.85, unit: 'bar' },
    ],
  },
  {
    id: 'FL-102',
    name: 'Beverage Pre-filter',
    type: 'Filter',
    state: 'standby',
    plantId: 'plant-002',
    zoneId: 'zone-fpb-02-02',
    runtimeHours: 3200,
    tags: [],
  },

  // -- Filling Machines --
  {
    id: 'FM-101',
    name: 'Vial Filling Machine FM-101',
    type: 'Filling Machine',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-02-02',
    runtimeHours: 3100,
    tags: [
      { tagId: 'FT-301', label: 'Fill Rate', value: 320, unit: 'vials/min' },
    ],
  },

  // -- Tablet Press --
  {
    id: 'TP-101',
    name: 'Rotary Tablet Press TP-101',
    type: 'Tablet Press',
    state: 'running',
    plantId: 'plant-001',
    zoneId: 'zone-ppa-01-02',
    runtimeHours: 3600,
    tags: [
      { tagId: 'PT-201', label: 'Pre-compression', value: 18.2, unit: 'kN' },
      { tagId: 'PT-202', label: 'Main Compression', value: 45.6, unit: 'kN' },
      { tagId: 'ST-102', label: 'Turret Speed', value: 62, unit: 'RPM' },
      { tagId: 'WT-102', label: 'Tablet Weight', value: 200.3, unit: 'mg' },
    ],
  },

  // -- Additional Textile equipment --
  {
    id: 'WM-101',
    name: 'Warping Machine WM-101',
    type: 'Motor',
    state: 'running',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-01-01',
    runtimeHours: 9200,
    tags: [],
  },
  {
    id: 'SM-101',
    name: 'Sizing Machine SM-101',
    type: 'Motor',
    state: 'running',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-01-01',
    runtimeHours: 8800,
    tags: [
      { tagId: 'TT-601', label: 'Drying Cylinder Temp', value: 118.5, unit: '°C' },
    ],
  },
  {
    id: 'JD-201',
    name: 'Jet Dyeing Machine JD-201',
    type: 'Reactor',
    state: 'maintenance',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-02-01',
    runtimeHours: 7100,
    tags: [
      { tagId: 'TT-701', label: 'Temperature', value: 95.6, unit: '°C' },
      { tagId: 'AT-301', label: 'pH', value: 6.3, unit: 'pH' },
      { tagId: 'FT-701', label: 'Circ. Flow', value: 220.8, unit: 'L/min' },
    ],
  },
  {
    id: 'JD-202',
    name: 'Jet Dyeing Machine JD-202',
    type: 'Reactor',
    state: 'maintenance',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-02-01',
    runtimeHours: 6800,
    tags: [
      { tagId: 'TT-702', label: 'Temperature', value: 28.3, unit: '°C' },
    ],
  },
  {
    id: 'SF-201',
    name: 'Stenter Frame SF-201',
    type: 'Motor',
    state: 'stopped',
    plantId: 'plant-003',
    zoneId: 'zone-tmg-02-02',
    runtimeHours: 6200,
    tags: [
      { tagId: 'TT-703', label: 'Zone 1 Temp', value: 165.0, unit: '°C' },
      { tagId: 'TT-704', label: 'Zone 2 Temp', value: 172.3, unit: '°C' },
      { tagId: 'ST-701', label: 'Chain Speed', value: 42.0, unit: 'm/min' },
    ],
  },
];

export default equipment;
