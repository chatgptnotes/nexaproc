import React, { useState } from 'react';
import clsx from 'clsx';
import {
  MousePointer2, Move, Plus, Minus, Trash2, Save, Download, Upload,
  Undo2, Redo2, ZoomIn, ZoomOut, Grid3x3, Layers,
  Cylinder, CircleDot, Droplets, Heater, Gauge, Thermometer, Activity, Box, Container,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

type Tool = 'select' | 'pan' | 'add_symbol' | 'add_pipe' | 'delete';

interface SymbolCategory {
  name: string;
  items: { id: string; label: string; icon: React.ReactNode }[];
}

const symbolPalette: SymbolCategory[] = [
  { name: 'Valves', items: [
    { id: 'gate-valve', label: 'Gate Valve', icon: <CircleDot size={16} /> },
    { id: 'globe-valve', label: 'Globe Valve', icon: <CircleDot size={16} /> },
    { id: 'check-valve', label: 'Check Valve', icon: <CircleDot size={16} /> },
    { id: 'control-valve', label: 'Control Valve', icon: <CircleDot size={16} /> },
  ]},
  { name: 'Vessels', items: [
    { id: 'tank', label: 'Tank', icon: <Container size={16} /> },
    { id: 'reactor', label: 'Reactor', icon: <Cylinder size={16} /> },
    { id: 'column', label: 'Column', icon: <Cylinder size={16} /> },
    { id: 'drum', label: 'Drum', icon: <Box size={16} /> },
  ]},
  { name: 'Instruments', items: [
    { id: 'temp-transmitter', label: 'Temp Transmitter', icon: <Thermometer size={16} /> },
    { id: 'press-transmitter', label: 'Press Transmitter', icon: <Gauge size={16} /> },
    { id: 'flow-transmitter', label: 'Flow Transmitter', icon: <Activity size={16} /> },
    { id: 'level-transmitter', label: 'Level Transmitter', icon: <Gauge size={16} /> },
  ]},
  { name: 'Pumps', items: [
    { id: 'centrifugal-pump', label: 'Centrifugal Pump', icon: <Droplets size={16} /> },
    { id: 'positive-disp', label: 'Positive Disp.', icon: <Droplets size={16} /> },
    { id: 'vacuum-pump', label: 'Vacuum Pump', icon: <Droplets size={16} /> },
  ]},
  { name: 'Heat Exchangers', items: [
    { id: 'shell-tube', label: 'Shell & Tube', icon: <Heater size={16} /> },
    { id: 'plate-he', label: 'Plate HE', icon: <Heater size={16} /> },
    { id: 'condenser', label: 'Condenser', icon: <Heater size={16} /> },
  ]},
];

const tools: { id: Tool; label: string; icon: React.ReactNode }[] = [
  { id: 'select', label: 'Select', icon: <MousePointer2 size={16} /> },
  { id: 'pan', label: 'Pan', icon: <Move size={16} /> },
  { id: 'add_symbol', label: 'Add Symbol', icon: <Plus size={16} /> },
  { id: 'add_pipe', label: 'Add Pipe', icon: <Minus size={16} /> },
  { id: 'delete', label: 'Delete', icon: <Trash2 size={16} /> },
];

export default function PidEditorPage() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [expandedCat, setExpandedCat] = useState<string>(symbolPalette[0].name);

  return (
    <div className="min-h-screen bg-scada-dark flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-scada-border bg-scada-panel px-4 py-2">
        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <button key={tool.id} onClick={() => setActiveTool(tool.id)} className={clsx('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all', activeTool === tool.id ? 'bg-nexaproc-amber/15 text-nexaproc-amber border border-nexaproc-amber/30' : 'text-white/50 hover:text-white/80 hover:bg-white/5 border border-transparent')} title={tool.label}>
              {tool.icon}
              <span className="hidden md:inline">{tool.label}</span>
            </button>
          ))}
          <div className="w-px h-6 bg-scada-border mx-2" />
          <button className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors" title="Undo"><Undo2 size={16} /></button>
          <button className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors" title="Redo"><Redo2 size={16} /></button>
          <div className="w-px h-6 bg-scada-border mx-2" />
          <button className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors" title="Zoom In"><ZoomIn size={16} /></button>
          <button className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors" title="Zoom Out"><ZoomOut size={16} /></button>
          <button className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors" title="Grid"><Grid3x3 size={16} /></button>
          <button className="p-1.5 rounded text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors" title="Layers"><Layers size={16} /></button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<Upload size={14} />}>Import</Button>
          <Button variant="ghost" size="sm" icon={<Download size={14} />}>Export</Button>
          <Button variant="primary" size="sm" icon={<Save size={14} />}>Save</Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Symbol palette */}
        <div className="w-56 flex-shrink-0 border-r border-scada-border bg-scada-panel overflow-y-auto">
          <div className="p-3 border-b border-scada-border">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Symbol Palette</h3>
          </div>
          <div className="p-2 space-y-1">
            {symbolPalette.map((cat) => (
              <div key={cat.name}>
                <button onClick={() => setExpandedCat(expandedCat === cat.name ? '' : cat.name)} className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors">
                  {cat.name}
                  <span className="text-white/30">{expandedCat === cat.name ? '\u2212' : '+'}</span>
                </button>
                {expandedCat === cat.name && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    {cat.items.map((item) => (
                      <div key={item.id} draggable className="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab text-xs text-white/50 hover:text-white hover:bg-nexaproc-green/10 transition-colors">
                        <span className="text-nexaproc-green/60">{item.icon}</span>
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="flex-1 relative overflow-hidden bg-scada-dark">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(74,222,128,0.08) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-nexaproc-green/10 flex items-center justify-center mx-auto mb-4">
                <Grid3x3 size={28} className="text-nexaproc-green/40" />
              </div>
              <p className="text-sm text-white/40 max-w-xs">Drag symbols from the palette to build your P&ID diagram</p>
              <p className="text-xs text-white/20 mt-2">Use the toolbar to switch between select, pan, and drawing tools</p>
            </div>
          </div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-scada-border bg-scada-panel/90 px-3 py-1.5">
            <span className="text-xs text-white/40">Zoom:</span>
            <span className="text-xs font-mono text-white">100%</span>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-scada-border bg-scada-panel/90 px-3 py-1.5">
            <span className="text-xs font-mono text-white/40">X: 0 Y: 0</span>
          </div>
        </div>

        {/* Right: Properties */}
        <div className="w-64 flex-shrink-0 border-l border-scada-border bg-scada-panel overflow-y-auto">
          <div className="p-3 border-b border-scada-border">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Properties</h3>
          </div>
          <div className="p-4 flex items-center justify-center h-64">
            <div className="text-center">
              <MousePointer2 size={24} className="text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/30">Select an element to edit properties</p>
            </div>
          </div>
          <div className="border-t border-scada-border p-3 space-y-2">
            {[['Drawing:', 'Untitled P&ID'], ['Elements:', '0'], ['Connections:', '0'], ['Grid:', '24px, Snap On']].map(([l, v]) => (
              <div key={l} className="flex justify-between text-xs">
                <span className="text-white/30">{l}</span>
                <span className="text-white/60 font-mono">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
