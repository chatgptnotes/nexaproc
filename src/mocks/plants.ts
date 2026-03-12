export interface ProcessCell {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'fault';
}

export interface ProcessZone {
  id: string;
  name: string;
  cells: ProcessCell[];
}

export interface ProductionLine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'changeover';
  zones: ProcessZone[];
}

export interface Plant {
  id: string;
  name: string;
  code: string;
  status: 'online' | 'offline' | 'partial';
  address: string;
  lat: number;
  lng: number;
  productionLines: ProductionLine[];
}

export const plants: Plant[] = [
  {
    id: 'plant-001',
    name: 'Pharma Plant Alpha',
    code: 'PPA',
    status: 'online',
    address: '1200 Innovation Drive, Research Triangle Park, NC 27709',
    lat: 35.8992,
    lng: -78.8637,
    productionLines: [
      {
        id: 'line-ppa-01',
        name: 'Oral Solid Dosage',
        status: 'running',
        zones: [
          {
            id: 'zone-ppa-01-01',
            name: 'Granulation',
            cells: [
              { id: 'cell-ppa-01-01-01', name: 'High-Shear Granulator', status: 'active' },
              { id: 'cell-ppa-01-01-02', name: 'Fluid Bed Dryer', status: 'active' },
              { id: 'cell-ppa-01-01-03', name: 'Milling Unit', status: 'idle' },
            ],
          },
          {
            id: 'zone-ppa-01-02',
            name: 'Compression',
            cells: [
              { id: 'cell-ppa-01-02-01', name: 'Tablet Press A', status: 'active' },
              { id: 'cell-ppa-01-02-02', name: 'Tablet Press B', status: 'maintenance' },
            ],
          },
          {
            id: 'zone-ppa-01-03',
            name: 'Coating',
            cells: [
              { id: 'cell-ppa-01-03-01', name: 'Film Coating Pan', status: 'active' },
              { id: 'cell-ppa-01-03-02', name: 'Inspection Unit', status: 'active' },
            ],
          },
        ],
      },
      {
        id: 'line-ppa-02',
        name: 'Injectable Line',
        status: 'running',
        zones: [
          {
            id: 'zone-ppa-02-01',
            name: 'Preparation',
            cells: [
              { id: 'cell-ppa-02-01-01', name: 'Mixing Vessel MV-101', status: 'active' },
              { id: 'cell-ppa-02-01-02', name: 'Filtration Skid', status: 'active' },
            ],
          },
          {
            id: 'zone-ppa-02-02',
            name: 'Filling & Stoppering',
            cells: [
              { id: 'cell-ppa-02-02-01', name: 'Vial Filling Machine', status: 'active' },
              { id: 'cell-ppa-02-02-02', name: 'Lyophilizer', status: 'idle' },
              { id: 'cell-ppa-02-02-03', name: 'Capping Station', status: 'active' },
            ],
          },
          {
            id: 'zone-ppa-02-03',
            name: 'Sterilization',
            cells: [
              { id: 'cell-ppa-02-03-01', name: 'Autoclave AC-201', status: 'active' },
              { id: 'cell-ppa-02-03-02', name: 'Depyrogenation Tunnel', status: 'active' },
            ],
          },
        ],
      },
      {
        id: 'line-ppa-03',
        name: 'Packaging',
        status: 'changeover',
        zones: [
          {
            id: 'zone-ppa-03-01',
            name: 'Primary Packaging',
            cells: [
              { id: 'cell-ppa-03-01-01', name: 'Blister Machine BM-101', status: 'maintenance' },
              { id: 'cell-ppa-03-01-02', name: 'Bottle Filler BF-101', status: 'idle' },
            ],
          },
          {
            id: 'zone-ppa-03-02',
            name: 'Secondary Packaging',
            cells: [
              { id: 'cell-ppa-03-02-01', name: 'Cartoner CR-101', status: 'idle' },
              { id: 'cell-ppa-03-02-02', name: 'Case Packer CP-101', status: 'idle' },
              { id: 'cell-ppa-03-02-03', name: 'Labeling Station', status: 'idle' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'plant-002',
    name: 'Food Processing Beta',
    code: 'FPB',
    status: 'online',
    address: '3400 Midwest Industrial Blvd, Columbus, OH 43228',
    lat: 39.9612,
    lng: -83.0007,
    productionLines: [
      {
        id: 'line-fpb-01',
        name: 'Dairy Processing',
        status: 'running',
        zones: [
          {
            id: 'zone-fpb-01-01',
            name: 'Reception & Pasteurization',
            cells: [
              { id: 'cell-fpb-01-01-01', name: 'Raw Milk Silo S-101', status: 'active' },
              { id: 'cell-fpb-01-01-02', name: 'HTST Pasteurizer', status: 'active' },
              { id: 'cell-fpb-01-01-03', name: 'Homogenizer H-101', status: 'active' },
            ],
          },
          {
            id: 'zone-fpb-01-02',
            name: 'Fermentation',
            cells: [
              { id: 'cell-fpb-01-02-01', name: 'Culture Tank CT-101', status: 'active' },
              { id: 'cell-fpb-01-02-02', name: 'Fermentation Vessel FV-101', status: 'active' },
              { id: 'cell-fpb-01-02-03', name: 'Fermentation Vessel FV-102', status: 'idle' },
            ],
          },
          {
            id: 'zone-fpb-01-03',
            name: 'Packaging & Cold Storage',
            cells: [
              { id: 'cell-fpb-01-03-01', name: 'Cup Filler CF-101', status: 'active' },
              { id: 'cell-fpb-01-03-02', name: 'Cold Room CR-101', status: 'active' },
            ],
          },
        ],
      },
      {
        id: 'line-fpb-02',
        name: 'Beverage Line',
        status: 'running',
        zones: [
          {
            id: 'zone-fpb-02-01',
            name: 'Syrup Preparation',
            cells: [
              { id: 'cell-fpb-02-01-01', name: 'Sugar Dissolving Tank', status: 'active' },
              { id: 'cell-fpb-02-01-02', name: 'Blending Tank BT-201', status: 'active' },
            ],
          },
          {
            id: 'zone-fpb-02-02',
            name: 'Carbonation & Filling',
            cells: [
              { id: 'cell-fpb-02-02-01', name: 'Carbonation Unit CU-201', status: 'active' },
              { id: 'cell-fpb-02-02-02', name: 'Bottle Rinser-Filler-Capper', status: 'active' },
              { id: 'cell-fpb-02-02-03', name: 'CIP Skid CIP-201', status: 'idle' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'plant-003',
    name: 'Textile Mill Gamma',
    code: 'TMG',
    status: 'partial',
    address: '780 Cotton Mill Road, Greenville, SC 29605',
    lat: 34.8526,
    lng: -82.394,
    productionLines: [
      {
        id: 'line-tmg-01',
        name: 'Weaving',
        status: 'running',
        zones: [
          {
            id: 'zone-tmg-01-01',
            name: 'Warping',
            cells: [
              { id: 'cell-tmg-01-01-01', name: 'Warping Machine WM-101', status: 'active' },
              { id: 'cell-tmg-01-01-02', name: 'Sizing Machine SM-101', status: 'active' },
            ],
          },
          {
            id: 'zone-tmg-01-02',
            name: 'Loom Floor',
            cells: [
              { id: 'cell-tmg-01-02-01', name: 'Air-Jet Loom AJL-101', status: 'active' },
              { id: 'cell-tmg-01-02-02', name: 'Air-Jet Loom AJL-102', status: 'active' },
              { id: 'cell-tmg-01-02-03', name: 'Air-Jet Loom AJL-103', status: 'fault' },
              { id: 'cell-tmg-01-02-04', name: 'Rapier Loom RL-101', status: 'active' },
            ],
          },
        ],
      },
      {
        id: 'line-tmg-02',
        name: 'Dyeing & Finishing',
        status: 'stopped',
        zones: [
          {
            id: 'zone-tmg-02-01',
            name: 'Dyeing',
            cells: [
              { id: 'cell-tmg-02-01-01', name: 'Jet Dyeing Machine JD-201', status: 'maintenance' },
              { id: 'cell-tmg-02-01-02', name: 'Jet Dyeing Machine JD-202', status: 'maintenance' },
              { id: 'cell-tmg-02-01-03', name: 'Padding Mangle PM-201', status: 'idle' },
            ],
          },
          {
            id: 'zone-tmg-02-02',
            name: 'Finishing',
            cells: [
              { id: 'cell-tmg-02-02-01', name: 'Stenter Frame SF-201', status: 'idle' },
              { id: 'cell-tmg-02-02-02', name: 'Sanforizing Machine SZ-201', status: 'idle' },
              { id: 'cell-tmg-02-02-03', name: 'Calendar CL-201', status: 'idle' },
            ],
          },
        ],
      },
    ],
  },
];

export default plants;
