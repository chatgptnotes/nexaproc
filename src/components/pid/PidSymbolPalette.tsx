import React, { useState, useMemo } from 'react';

// ── Valve imports ───────────────────────────────────────────────────────────
import {
  GateValve, GlobeValve, BallValve, ButterflyValve, CheckValve,
  ControlValve, ReliefValve, SolenoidValve, ThreeWayValve, NeedleValve,
  PlugValve, DiaphragmValve, PinchValve, AngleValve, KnifeGateValve,
  MotorizedValve, PneumaticValve, HandValve, RegulatingValve, SamplingValve,
} from './symbols/valves';

// ── Pump imports ────────────────────────────────────────────────────────────
import {
  CentrifugalPump, PositiveDisplacementPump, GearPump, DiaphragmPump,
  VacuumPump, ScrewPump, SubmersiblePump, PeristalticPump,
  ReciprocatingPump, ProgressiveCavityPump,
} from './symbols/pumps';

// ── Motor imports ───────────────────────────────────────────────────────────
import {
  ElectricMotor, VariableSpeedDrive, Turbine, DieselEngine,
  Compressor, Blower, Fan, Agitator, Mixer, Conveyor,
  ScrewConveyor as MotorScrewConveyor, BucketElevator as MotorBucketElevator,
} from './symbols/motors';

// ── Vessel imports ──────────────────────────────────────────────────────────
import {
  StorageTank, PressureVessel, ReactorCSTR, ReactorPFR,
  DistillationColumn, AbsorptionTower, Drum, Hopper, Silo, OpenTank,
  JacketedVessel, ConeBottomTank, DayTank, MixingTank, FermentationVessel,
} from './symbols/vessels';

// ── Exchanger imports ───────────────────────────────────────────────────────
import {
  ShellAndTubeHX, PlateHX, DoublePipeHX, AirCooler, Condenser,
  Evaporator, CoolingTower, Furnace, Boiler, Reboiler,
} from './symbols/exchangers';

// ── Instrument imports ──────────────────────────────────────────────────────
import {
  InstrumentBubble,
  TemperatureIndicator, TemperatureTransmitter, TemperatureController,
  PressureIndicator, PressureTransmitter, PressureController,
  FlowIndicator, FlowTransmitter, FlowController,
  LevelIndicator, LevelTransmitter, LevelController,
  AnalyzerIndicator, AnalyzerTransmitter,
  SpeedIndicator, SpeedTransmitter,
  WeightIndicator, WeightTransmitter,
  PressureSafetyValve, TemperatureSafetyHigh, LevelSafetyLow,
  FlowSwitch,
  ControlStation, IPConverter, ProgrammableController,
  Thermocouple, RTD,
  OrificeFlowmeter, MagneticFlowmeter, CoriolisFlowmeter,
  RadarLevelGauge, SightGlass,
} from './symbols/instruments';

// ── Piping imports ──────────────────────────────────────────────────────────
import {
  PipeSegment, PipeElbow, PipeTee, PipeCross, Reducer, EccentricReducer,
  Flange, BlindFlange, SpectacleBlind, Strainer, SteamTrap,
  ExpansionJoint, FlexibleHose, UnionConnector, CapEnd, FlowArrow,
  ProcessLine, InstrumentLine, ElectricalLine, PneumaticLine,
} from './symbols/piping';

// ── Material Handling imports ───────────────────────────────────────────────
import {
  BeltConveyor, ScrewConveyor as MatScrewConveyor,
  BucketElevator as MatBucketElevator, VibratingFeeder, RotaryFeeder,
  Crusher, BallMill, Grinder, Cyclone, Baghouse,
} from './symbols/material';

// ── Process Equipment imports ───────────────────────────────────────────────
import {
  Filter, Centrifuge, Dryer, Crystallizer, SprayDryer, Granulator,
  Coater, TabletPress, FillingMachine, Labeler, Palletizer,
  Homogenizer, Pasteurizer, Sterilizer, Separator, Decanter,
  Thickener, Ejector, RuptureDisc, FlameArrester,
} from './symbols/process';

// ── Types ───────────────────────────────────────────────────────────────────

/** Generic component type that accepts size, state, animated, rotation, fillLevel */
type SymbolComponent = React.FC<Record<string, unknown>>;

interface SymbolEntry {
  name: string;
  component: SymbolComponent;
}

interface CategoryDef {
  key: string;
  label: string;
  states: string[];
  hasFillLevel: boolean;
  symbols: SymbolEntry[];
}

// ── Symbol Registry ─────────────────────────────────────────────────────────

const VALVE_STATES = ['open', 'closed', 'transit', 'fault', 'manual', 'offline'];
const EQUIPMENT_STATES = ['running', 'stopped', 'fault', 'maintenance', 'standby', 'offline'];
const INSTRUMENT_STATES = ['normal', 'alarm', 'fault', 'offline', 'manual'];
const SIMPLE_STATES = ['active', 'inactive', 'fault', 'offline'];

const CATEGORIES: CategoryDef[] = [
  {
    key: 'valves',
    label: 'Valves',
    states: VALVE_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Gate Valve', component: GateValve as SymbolComponent },
      { name: 'Globe Valve', component: GlobeValve as SymbolComponent },
      { name: 'Ball Valve', component: BallValve as SymbolComponent },
      { name: 'Butterfly Valve', component: ButterflyValve as SymbolComponent },
      { name: 'Check Valve', component: CheckValve as SymbolComponent },
      { name: 'Control Valve', component: ControlValve as SymbolComponent },
      { name: 'Relief Valve', component: ReliefValve as SymbolComponent },
      { name: 'Solenoid Valve', component: SolenoidValve as SymbolComponent },
      { name: 'Three-Way Valve', component: ThreeWayValve as SymbolComponent },
      { name: 'Needle Valve', component: NeedleValve as SymbolComponent },
      { name: 'Plug Valve', component: PlugValve as SymbolComponent },
      { name: 'Diaphragm Valve', component: DiaphragmValve as SymbolComponent },
      { name: 'Pinch Valve', component: PinchValve as SymbolComponent },
      { name: 'Angle Valve', component: AngleValve as SymbolComponent },
      { name: 'Knife Gate Valve', component: KnifeGateValve as SymbolComponent },
      { name: 'Motorized Valve', component: MotorizedValve as SymbolComponent },
      { name: 'Pneumatic Valve', component: PneumaticValve as SymbolComponent },
      { name: 'Hand Valve', component: HandValve as SymbolComponent },
      { name: 'Regulating Valve', component: RegulatingValve as SymbolComponent },
      { name: 'Sampling Valve', component: SamplingValve as SymbolComponent },
    ],
  },
  {
    key: 'pumps',
    label: 'Pumps',
    states: EQUIPMENT_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Centrifugal Pump', component: CentrifugalPump as SymbolComponent },
      { name: 'Positive Displacement', component: PositiveDisplacementPump as SymbolComponent },
      { name: 'Gear Pump', component: GearPump as SymbolComponent },
      { name: 'Diaphragm Pump', component: DiaphragmPump as SymbolComponent },
      { name: 'Vacuum Pump', component: VacuumPump as SymbolComponent },
      { name: 'Screw Pump', component: ScrewPump as SymbolComponent },
      { name: 'Submersible Pump', component: SubmersiblePump as SymbolComponent },
      { name: 'Peristaltic Pump', component: PeristalticPump as SymbolComponent },
      { name: 'Reciprocating Pump', component: ReciprocatingPump as SymbolComponent },
      { name: 'Progressive Cavity', component: ProgressiveCavityPump as SymbolComponent },
    ],
  },
  {
    key: 'motors',
    label: 'Motors',
    states: EQUIPMENT_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Electric Motor', component: ElectricMotor as SymbolComponent },
      { name: 'Variable Speed Drive', component: VariableSpeedDrive as SymbolComponent },
      { name: 'Turbine', component: Turbine as SymbolComponent },
      { name: 'Diesel Engine', component: DieselEngine as SymbolComponent },
      { name: 'Compressor', component: Compressor as SymbolComponent },
      { name: 'Blower', component: Blower as SymbolComponent },
      { name: 'Fan', component: Fan as SymbolComponent },
      { name: 'Agitator', component: Agitator as SymbolComponent },
      { name: 'Mixer', component: Mixer as SymbolComponent },
      { name: 'Conveyor', component: Conveyor as SymbolComponent },
      { name: 'Screw Conveyor', component: MotorScrewConveyor as SymbolComponent },
      { name: 'Bucket Elevator', component: MotorBucketElevator as SymbolComponent },
    ],
  },
  {
    key: 'vessels',
    label: 'Vessels',
    states: EQUIPMENT_STATES,
    hasFillLevel: true,
    symbols: [
      { name: 'Storage Tank', component: StorageTank as SymbolComponent },
      { name: 'Pressure Vessel', component: PressureVessel as SymbolComponent },
      { name: 'Reactor (CSTR)', component: ReactorCSTR as SymbolComponent },
      { name: 'Reactor (PFR)', component: ReactorPFR as SymbolComponent },
      { name: 'Distillation Column', component: DistillationColumn as SymbolComponent },
      { name: 'Absorption Tower', component: AbsorptionTower as SymbolComponent },
      { name: 'Drum', component: Drum as SymbolComponent },
      { name: 'Hopper', component: Hopper as SymbolComponent },
      { name: 'Silo', component: Silo as SymbolComponent },
      { name: 'Open Tank', component: OpenTank as SymbolComponent },
      { name: 'Jacketed Vessel', component: JacketedVessel as SymbolComponent },
      { name: 'Cone Bottom Tank', component: ConeBottomTank as SymbolComponent },
      { name: 'Day Tank', component: DayTank as SymbolComponent },
      { name: 'Mixing Tank', component: MixingTank as SymbolComponent },
      { name: 'Fermentation Vessel', component: FermentationVessel as SymbolComponent },
    ],
  },
  {
    key: 'exchangers',
    label: 'Exchangers',
    states: EQUIPMENT_STATES,
    hasFillLevel: true,
    symbols: [
      { name: 'Shell & Tube HX', component: ShellAndTubeHX as SymbolComponent },
      { name: 'Plate HX', component: PlateHX as SymbolComponent },
      { name: 'Double Pipe HX', component: DoublePipeHX as SymbolComponent },
      { name: 'Air Cooler', component: AirCooler as SymbolComponent },
      { name: 'Condenser', component: Condenser as SymbolComponent },
      { name: 'Evaporator', component: Evaporator as SymbolComponent },
      { name: 'Cooling Tower', component: CoolingTower as SymbolComponent },
      { name: 'Furnace', component: Furnace as SymbolComponent },
      { name: 'Boiler', component: Boiler as SymbolComponent },
      { name: 'Reboiler', component: Reboiler as SymbolComponent },
    ],
  },
  {
    key: 'instruments',
    label: 'Instruments',
    states: INSTRUMENT_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Instrument Bubble', component: ((props: Record<string, unknown>) => React.createElement(InstrumentBubble, { tagLetters: 'TI', ...props } as React.ComponentProps<typeof InstrumentBubble>)) as SymbolComponent },
      { name: 'Temperature Indicator', component: TemperatureIndicator as SymbolComponent },
      { name: 'Temperature Transmitter', component: TemperatureTransmitter as SymbolComponent },
      { name: 'Temperature Controller', component: TemperatureController as SymbolComponent },
      { name: 'Pressure Indicator', component: PressureIndicator as SymbolComponent },
      { name: 'Pressure Transmitter', component: PressureTransmitter as SymbolComponent },
      { name: 'Pressure Controller', component: PressureController as SymbolComponent },
      { name: 'Flow Indicator', component: FlowIndicator as SymbolComponent },
      { name: 'Flow Transmitter', component: FlowTransmitter as SymbolComponent },
      { name: 'Flow Controller', component: FlowController as SymbolComponent },
      { name: 'Level Indicator', component: LevelIndicator as SymbolComponent },
      { name: 'Level Transmitter', component: LevelTransmitter as SymbolComponent },
      { name: 'Level Controller', component: LevelController as SymbolComponent },
      { name: 'Analyzer Indicator', component: AnalyzerIndicator as SymbolComponent },
      { name: 'Analyzer Transmitter', component: AnalyzerTransmitter as SymbolComponent },
      { name: 'Speed Indicator', component: SpeedIndicator as SymbolComponent },
      { name: 'Speed Transmitter', component: SpeedTransmitter as SymbolComponent },
      { name: 'Weight Indicator', component: WeightIndicator as SymbolComponent },
      { name: 'Weight Transmitter', component: WeightTransmitter as SymbolComponent },
      { name: 'Pressure Safety Valve', component: PressureSafetyValve as SymbolComponent },
      { name: 'Temperature Safety High', component: TemperatureSafetyHigh as SymbolComponent },
      { name: 'Level Safety Low', component: LevelSafetyLow as SymbolComponent },
      { name: 'Flow Switch', component: FlowSwitch as SymbolComponent },
      { name: 'Control Station', component: ControlStation as SymbolComponent },
      { name: 'I/P Converter', component: IPConverter as SymbolComponent },
      { name: 'Programmable Controller', component: ProgrammableController as SymbolComponent },
      { name: 'Thermocouple', component: Thermocouple as SymbolComponent },
      { name: 'RTD', component: RTD as SymbolComponent },
      { name: 'Orifice Flowmeter', component: OrificeFlowmeter as SymbolComponent },
      { name: 'Magnetic Flowmeter', component: MagneticFlowmeter as SymbolComponent },
      { name: 'Coriolis Flowmeter', component: CoriolisFlowmeter as SymbolComponent },
      { name: 'Radar Level Gauge', component: RadarLevelGauge as SymbolComponent },
      { name: 'Sight Glass', component: SightGlass as SymbolComponent },
    ],
  },
  {
    key: 'piping',
    label: 'Piping',
    states: SIMPLE_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Pipe Segment', component: PipeSegment as SymbolComponent },
      { name: 'Pipe Elbow', component: PipeElbow as SymbolComponent },
      { name: 'Pipe Tee', component: PipeTee as SymbolComponent },
      { name: 'Pipe Cross', component: PipeCross as SymbolComponent },
      { name: 'Reducer', component: Reducer as SymbolComponent },
      { name: 'Eccentric Reducer', component: EccentricReducer as SymbolComponent },
      { name: 'Flange', component: Flange as SymbolComponent },
      { name: 'Blind Flange', component: BlindFlange as SymbolComponent },
      { name: 'Spectacle Blind', component: SpectacleBlind as SymbolComponent },
      { name: 'Strainer', component: Strainer as SymbolComponent },
      { name: 'Steam Trap', component: SteamTrap as SymbolComponent },
      { name: 'Expansion Joint', component: ExpansionJoint as SymbolComponent },
      { name: 'Flexible Hose', component: FlexibleHose as SymbolComponent },
      { name: 'Union Connector', component: UnionConnector as SymbolComponent },
      { name: 'Cap End', component: CapEnd as SymbolComponent },
      { name: 'Flow Arrow', component: FlowArrow as SymbolComponent },
      { name: 'Process Line', component: ProcessLine as SymbolComponent },
      { name: 'Instrument Line', component: InstrumentLine as SymbolComponent },
      { name: 'Electrical Line', component: ElectricalLine as SymbolComponent },
      { name: 'Pneumatic Line', component: PneumaticLine as SymbolComponent },
    ],
  },
  {
    key: 'material',
    label: 'Material',
    states: SIMPLE_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Belt Conveyor', component: BeltConveyor as SymbolComponent },
      { name: 'Screw Conveyor', component: MatScrewConveyor as SymbolComponent },
      { name: 'Bucket Elevator', component: MatBucketElevator as SymbolComponent },
      { name: 'Vibrating Feeder', component: VibratingFeeder as SymbolComponent },
      { name: 'Rotary Feeder', component: RotaryFeeder as SymbolComponent },
      { name: 'Crusher', component: Crusher as SymbolComponent },
      { name: 'Ball Mill', component: BallMill as SymbolComponent },
      { name: 'Grinder', component: Grinder as SymbolComponent },
      { name: 'Cyclone', component: Cyclone as SymbolComponent },
      { name: 'Baghouse', component: Baghouse as SymbolComponent },
    ],
  },
  {
    key: 'process',
    label: 'Process',
    states: SIMPLE_STATES,
    hasFillLevel: false,
    symbols: [
      { name: 'Filter', component: Filter as SymbolComponent },
      { name: 'Centrifuge', component: Centrifuge as SymbolComponent },
      { name: 'Dryer', component: Dryer as SymbolComponent },
      { name: 'Crystallizer', component: Crystallizer as SymbolComponent },
      { name: 'Spray Dryer', component: SprayDryer as SymbolComponent },
      { name: 'Granulator', component: Granulator as SymbolComponent },
      { name: 'Coater', component: Coater as SymbolComponent },
      { name: 'Tablet Press', component: TabletPress as SymbolComponent },
      { name: 'Filling Machine', component: FillingMachine as SymbolComponent },
      { name: 'Labeler', component: Labeler as SymbolComponent },
      { name: 'Palletizer', component: Palletizer as SymbolComponent },
      { name: 'Homogenizer', component: Homogenizer as SymbolComponent },
      { name: 'Pasteurizer', component: Pasteurizer as SymbolComponent },
      { name: 'Sterilizer', component: Sterilizer as SymbolComponent },
      { name: 'Separator', component: Separator as SymbolComponent },
      { name: 'Decanter', component: Decanter as SymbolComponent },
      { name: 'Thickener', component: Thickener as SymbolComponent },
      { name: 'Ejector', component: Ejector as SymbolComponent },
      { name: 'Rupture Disc', component: RuptureDisc as SymbolComponent },
      { name: 'Flame Arrester', component: FlameArrester as SymbolComponent },
    ],
  },
];

const TOTAL_SYMBOLS = CATEGORIES.reduce((sum, c) => sum + c.symbols.length, 0);
const ROTATIONS = [0, 90, 180, 270] as const;

// ── Component ───────────────────────────────────────────────────────────────

export const PidSymbolPalette: React.FC = () => {
  const [activeTab, setActiveTab] = useState(CATEGORIES[0].key);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<{
    entry: SymbolEntry;
    category: CategoryDef;
  } | null>(null);

  // Detail panel state
  const [detailState, setDetailState] = useState<string>('');
  const [detailSize, setDetailSize] = useState(96);
  const [detailAnimated, setDetailAnimated] = useState(false);
  const [detailRotation, setDetailRotation] = useState(0);
  const [detailFillLevel, setDetailFillLevel] = useState(50);

  const activeCategory = CATEGORIES.find((c) => c.key === activeTab)!;

  const filteredSymbols = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return activeCategory.symbols;
    return activeCategory.symbols.filter((s) =>
      s.name.toLowerCase().includes(q),
    );
  }, [activeCategory, search]);

  // Cross-category search results (when search is active)
  const allFilteredResults = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return null;
    const results: { category: CategoryDef; symbols: SymbolEntry[] }[] = [];
    for (const cat of CATEGORIES) {
      const matched = cat.symbols.filter((s) =>
        s.name.toLowerCase().includes(q),
      );
      if (matched.length > 0) results.push({ category: cat, symbols: matched });
    }
    return results;
  }, [search]);

  const handleSelect = (entry: SymbolEntry, category: CategoryDef) => {
    setSelected({ entry, category });
    setDetailState(category.states[0]);
    setDetailSize(96);
    setDetailAnimated(false);
    setDetailRotation(0);
    setDetailFillLevel(50);
  };

  const renderSymbolCard = (entry: SymbolEntry, category: CategoryDef) => {
    const Comp = entry.component;
    const isSelected =
      selected?.entry.name === entry.name &&
      selected?.category.key === category.key;
    return (
      <button
        key={`${category.key}-${entry.name}`}
        onClick={() => handleSelect(entry, category)}
        className={`
          group flex flex-col items-center gap-2 p-3 rounded-lg border transition-all duration-150
          ${
            isSelected
              ? 'border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/30'
              : 'border-gray-700 bg-gray-800/60 hover:border-gray-500 hover:bg-gray-800'
          }
        `}
      >
        <div className="flex items-center justify-center w-12 h-12">
          <Comp size={48} state={category.states[0]} />
        </div>
        <span className="text-[10px] leading-tight text-gray-400 group-hover:text-gray-200 text-center truncate w-full">
          {entry.name}
        </span>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100">
      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${TOTAL_SYMBOLS} symbols...`}
          className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-200
                     placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
                     transition-colors"
        />
      </div>

      {/* ── Category Tabs ───────────────────────────────────────────── */}
      <div className="px-4 pb-2 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                setActiveTab(cat.key);
                setSearch('');
              }}
              className={`
                px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors
                ${
                  activeTab === cat.key && !search
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }
              `}
            >
              {cat.label}
              <span className="ml-1 text-[10px] opacity-60">
                {cat.symbols.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 gap-4 px-4 pb-4">
        {/* ── Symbol Grid ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pr-1">
          {search && allFilteredResults ? (
            // Cross-category search results
            allFilteredResults.length > 0 ? (
              <div className="space-y-4">
                {allFilteredResults.map(({ category, symbols }) => (
                  <div key={category.key}>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {category.label}
                      <span className="ml-1 text-cyan-500">{symbols.length}</span>
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                      {symbols.map((s) => renderSymbolCard(s, category))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                No symbols match &ldquo;{search}&rdquo;
              </div>
            )
          ) : (
            // Single-category grid
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {filteredSymbols.map((s) => renderSymbolCard(s, activeCategory))}
            </div>
          )}
        </div>

        {/* ── Detail Panel ────────────────────────────────────────── */}
        {selected && (
          <div className="w-72 shrink-0 bg-gray-800 rounded-lg border border-gray-700 p-4 overflow-y-auto flex flex-col gap-4">
            {/* Preview */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center w-full aspect-square bg-gray-900 rounded-lg border border-gray-700">
                {React.createElement(selected.entry.component, {
                  size: detailSize,
                  state: detailState,
                  animated: detailAnimated,
                  rotation: detailRotation,
                  ...(selected.category.hasFillLevel
                    ? { fillLevel: detailFillLevel / 100 }
                    : {}),
                })}
              </div>
              <h3 className="text-sm font-semibold text-center">
                {selected.entry.name}
              </h3>
              <span className="text-[10px] text-cyan-400 uppercase tracking-wider">
                {selected.category.label}
              </span>
            </div>

            {/* State Toggles */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                State
              </label>
              <div className="flex flex-wrap gap-1">
                {selected.category.states.map((st) => (
                  <button
                    key={st}
                    onClick={() => setDetailState(st)}
                    className={`
                      px-2 py-1 rounded text-[10px] font-medium transition-colors capitalize
                      ${
                        detailState === st
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-gray-200'
                      }
                    `}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Slider */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Size: {detailSize}px
              </label>
              <input
                type="range"
                min={24}
                max={192}
                value={detailSize}
                onChange={(e) => setDetailSize(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Rotation */}
            <div>
              <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                Rotation: {detailRotation}&deg;
              </label>
              <div className="flex gap-1">
                {ROTATIONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setDetailRotation(r)}
                    className={`
                      flex-1 py-1 rounded text-[10px] font-medium transition-colors
                      ${
                        detailRotation === r
                          ? 'bg-cyan-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:text-gray-200'
                      }
                    `}
                  >
                    {r}&deg;
                  </button>
                ))}
              </div>
            </div>

            {/* Animated Toggle */}
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Animated
              </label>
              <button
                onClick={() => setDetailAnimated(!detailAnimated)}
                className={`
                  w-10 h-5 rounded-full transition-colors relative
                  ${detailAnimated ? 'bg-cyan-600' : 'bg-gray-600'}
                `}
              >
                <span
                  className={`
                    absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform
                    ${detailAnimated ? 'translate-x-5' : 'translate-x-0.5'}
                  `}
                />
              </button>
            </div>

            {/* Fill Level (vessels/exchangers only) */}
            {selected.category.hasFillLevel && (
              <div>
                <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                  Fill Level: {detailFillLevel}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={detailFillLevel}
                  onChange={(e) => setDetailFillLevel(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
              </div>
            )}

            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="mt-auto py-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
            >
              Close Detail
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PidSymbolPalette;

/** Exported for use by SymbolLibraryPage summary cards */
export { CATEGORIES, TOTAL_SYMBOLS };
