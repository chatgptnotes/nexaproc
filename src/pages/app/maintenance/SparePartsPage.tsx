import { useState, useMemo } from 'react';
import {
  Package,
  Search,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Truck,
} from 'lucide-react';
import clsx from 'clsx';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import KPICard from '@/components/scada/KPICard';

// ── Types ───────────────────────────────────────────────────────────────────
type PartStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';

interface SparePart {
  partNumber: string;
  description: string;
  category: string;
  location: string;
  qtyInStock: number;
  minStock: number;
  maxStock: number;
  unitCost: number;
  status: PartStatus;
}

// ── Mock Data (20 spare parts) ──────────────────────────────────────────────
const spareParts: SparePart[] = [
  { partNumber: 'BRG-6208-2RS', description: 'Deep Groove Ball Bearing 40x80x18', category: 'Bearings', location: 'A1-01', qtyInStock: 12, minStock: 4, maxStock: 20, unitCost: 28.50, status: 'In Stock' },
  { partNumber: 'BRG-22210-E', description: 'Spherical Roller Bearing 50x90x23', category: 'Bearings', location: 'A1-02', qtyInStock: 3, minStock: 4, maxStock: 12, unitCost: 145.00, status: 'Low Stock' },
  { partNumber: 'SEL-CR102', description: 'Mechanical Seal Cartridge Type 102', category: 'Seals', location: 'A2-01', qtyInStock: 6, minStock: 3, maxStock: 10, unitCost: 380.00, status: 'In Stock' },
  { partNumber: 'SEL-OR-VIT-50', description: 'Viton O-Ring Kit 50-piece Assorted', category: 'Seals', location: 'A2-02', qtyInStock: 2, minStock: 3, maxStock: 8, unitCost: 65.00, status: 'Low Stock' },
  { partNumber: 'GSK-RF150', description: 'Ring Joint Gasket ANSI 150# 6"', category: 'Gaskets', location: 'A3-01', qtyInStock: 20, minStock: 10, maxStock: 40, unitCost: 18.75, status: 'In Stock' },
  { partNumber: 'GSK-SP-304', description: 'Spiral Wound Gasket SS304 8"', category: 'Gaskets', location: 'A3-02', qtyInStock: 8, minStock: 5, maxStock: 15, unitCost: 42.00, status: 'In Stock' },
  { partNumber: 'MOT-ABB-5.5', description: 'ABB Motor M3AA 5.5kW 4-pole IE3', category: 'Motors', location: 'B1-01', qtyInStock: 0, minStock: 1, maxStock: 3, unitCost: 1250.00, status: 'On Order' },
  { partNumber: 'MOT-ABB-11', description: 'ABB Motor M3AA 11kW 4-pole IE3', category: 'Motors', location: 'B1-02', qtyInStock: 1, minStock: 1, maxStock: 2, unitCost: 2180.00, status: 'In Stock' },
  { partNumber: 'SNS-PT-100A', description: 'RTD Sensor PT100 3-wire 200mm', category: 'Sensors', location: 'C1-01', qtyInStock: 15, minStock: 5, maxStock: 25, unitCost: 45.00, status: 'In Stock' },
  { partNumber: 'SNS-PX-016', description: 'Pressure Transmitter 0-16 bar 4-20mA', category: 'Sensors', location: 'C1-02', qtyInStock: 4, minStock: 3, maxStock: 8, unitCost: 520.00, status: 'In Stock' },
  { partNumber: 'SNS-VIB-100', description: 'Vibration Sensor ICP Accelerometer', category: 'Sensors', location: 'C1-03', qtyInStock: 0, minStock: 2, maxStock: 6, unitCost: 290.00, status: 'Out of Stock' },
  { partNumber: 'FLT-AIR-C301', description: 'Air Intake Filter Compressor C-301', category: 'Filters', location: 'D1-01', qtyInStock: 6, minStock: 4, maxStock: 12, unitCost: 35.00, status: 'In Stock' },
  { partNumber: 'FLT-OIL-HYD', description: 'Hydraulic Oil Filter 10 micron', category: 'Filters', location: 'D1-02', qtyInStock: 3, minStock: 4, maxStock: 10, unitCost: 28.00, status: 'Low Stock' },
  { partNumber: 'FLT-CART-10', description: 'Process Filter Cartridge 10" 5um', category: 'Filters', location: 'D1-03', qtyInStock: 24, minStock: 12, maxStock: 48, unitCost: 22.50, status: 'In Stock' },
  { partNumber: 'BLT-VB-68', description: 'V-Belt B68 Classical Profile', category: 'Belts', location: 'E1-01', qtyInStock: 4, minStock: 4, maxStock: 10, unitCost: 15.00, status: 'In Stock' },
  { partNumber: 'BLT-SYNC-8M', description: 'Timing Belt HTD 8M-1200-30', category: 'Belts', location: 'E1-02', qtyInStock: 1, minStock: 2, maxStock: 4, unitCost: 85.00, status: 'Low Stock' },
  { partNumber: 'CPL-JAW-42', description: 'Jaw Coupling L-100 Complete Set', category: 'Couplings', location: 'E2-01', qtyInStock: 3, minStock: 2, maxStock: 6, unitCost: 65.00, status: 'In Stock' },
  { partNumber: 'CPL-INS-CR10', description: 'Coupling Insert Spider CR-10 NBR', category: 'Couplings', location: 'E2-02', qtyInStock: 5, minStock: 3, maxStock: 10, unitCost: 12.00, status: 'In Stock' },
  { partNumber: 'LUB-ISO220', description: 'Gear Oil ISO 220 Mineral 20L Pail', category: 'Lubricants', location: 'F1-01', qtyInStock: 0, minStock: 2, maxStock: 6, unitCost: 95.00, status: 'Out of Stock' },
  { partNumber: 'LUB-GRS-EP2', description: 'Grease EP2 Multi-purpose 15kg Pail', category: 'Lubricants', location: 'F1-02', qtyInStock: 3, minStock: 2, maxStock: 5, unitCost: 72.00, status: 'In Stock' },
];

// ── Status Config ───────────────────────────────────────────────────────────
const statusBadge: Record<PartStatus, 'success' | 'warning' | 'danger' | 'info'> = {
  'In Stock': 'success',
  'Low Stock': 'warning',
  'Out of Stock': 'danger',
  'On Order': 'info',
};

// ── Dropdowns ───────────────────────────────────────────────────────────────
const categories = [
  { value: '', label: 'All Categories' },
  ...Array.from(new Set(spareParts.map((p) => p.category))).map((c) => ({ value: c, label: c })),
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'In Stock', label: 'In Stock' },
  { value: 'Low Stock', label: 'Low Stock' },
  { value: 'Out of Stock', label: 'Out of Stock' },
  { value: 'On Order', label: 'On Order' },
];

// ── Table Columns ───────────────────────────────────────────────────────────
const columns = [
  {
    key: 'partNumber',
    header: 'Part Number',
    sortable: true,
    render: (r: SparePart) => <span className="font-mono text-nexaproc-amber text-xs">{r.partNumber}</span>,
  },
  { key: 'description', header: 'Description', sortable: true },
  { key: 'category', header: 'Category', sortable: true },
  {
    key: 'location',
    header: 'Location',
    render: (r: SparePart) => <span className="font-mono text-xs text-white/60">{r.location}</span>,
  },
  {
    key: 'qtyInStock',
    header: 'Qty',
    sortable: true,
    render: (r: SparePart) => (
      <span className={clsx('font-mono font-bold', r.qtyInStock <= r.minStock ? 'text-alarm-critical' : 'text-white')}>
        {r.qtyInStock}
      </span>
    ),
  },
  {
    key: 'minStock',
    header: 'Min',
    render: (r: SparePart) => <span className="font-mono text-xs text-white/40">{r.minStock}</span>,
  },
  {
    key: 'maxStock',
    header: 'Max',
    render: (r: SparePart) => <span className="font-mono text-xs text-white/40">{r.maxStock}</span>,
  },
  {
    key: 'unitCost',
    header: 'Unit Cost',
    sortable: true,
    render: (r: SparePart) => (
      <span className="font-mono text-xs text-white/70">${r.unitCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (r: SparePart) => <Badge variant={statusBadge[r.status]} dot>{r.status}</Badge>,
  },
  {
    key: 'action',
    header: '',
    render: (r: SparePart) =>
      r.status === 'Low Stock' || r.status === 'Out of Stock' ? (
        <Button variant="secondary" size="sm" icon={<ShoppingCart size={12} />}>
          Reorder
        </Button>
      ) : null,
  },
];

export default function SparePartsPage() {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filtered = useMemo(() => {
    return spareParts.filter((p) => {
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.partNumber.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, filterCategory, filterStatus]);

  // Summary stats
  const totalParts = spareParts.length;
  const lowStockCount = spareParts.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
  const totalValue = spareParts.reduce((sum, p) => sum + p.qtyInStock * p.unitCost, 0);
  const pendingOrders = spareParts.filter((p) => p.status === 'On Order').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Package size={24} className="text-nexaproc-amber" />
        <h1 className="text-2xl font-bold text-white">Spare Parts Inventory</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Parts"
          value={totalParts}
          unit="SKUs"
          trend="flat"
          trendValue={0}
          icon={<Package size={22} />}
          color="#4ade80"
        />
        <KPICard
          title="Low Stock Items"
          value={lowStockCount}
          unit="items"
          trend="up"
          trendValue={2.0}
          icon={<AlertTriangle size={22} />}
          color="#ef4444"
        />
        <KPICard
          title="Total Inventory Value"
          value={`$${Math.round(totalValue / 1000)}k`}
          unit=""
          trend="flat"
          trendValue={0.5}
          icon={<DollarSign size={22} />}
          color="#fbbf24"
        />
        <KPICard
          title="Pending Orders"
          value={pendingOrders}
          unit="orders"
          trend="flat"
          trendValue={0}
          icon={<Truck size={22} />}
          color="#3b82f6"
        />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <Input
          label="Search"
          placeholder="Part number, description..."
          icon={<Search size={16} />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Select
          options={categories}
          value={filterCategory}
          onChange={setFilterCategory}
          label="Category"
          className="w-44"
        />
        <Select
          options={statusOptions}
          value={filterStatus}
          onChange={setFilterStatus}
          label="Status"
          className="w-40"
        />
      </div>

      {/* Parts Table */}
      <Card title="Inventory" subtitle={`Showing ${filtered.length} of ${totalParts} parts`}>
        <Table columns={columns} data={filtered} />
      </Card>
    </div>
  );
}
