import React, { useState } from 'react';
import clsx from 'clsx';
import { Calendar, Clock, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';

type OrderStatus = 'running' | 'scheduled' | 'complete' | 'delayed';

interface ProductionOrder {
  id: string;
  orderNumber: string;
  product: string;
  recipe: string;
  line: string;
  quantity: string;
  status: OrderStatus;
  dayStart: number;
  dayEnd: number;
  hourStart: number;
  hourEnd: number;
  operator: string;
  notes: string;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; badge: 'success' | 'info' | 'neutral' | 'danger' }> = {
  running: { label: 'Running', color: 'bg-status-running', badge: 'success' },
  scheduled: { label: 'Scheduled', color: 'bg-status-maintenance', badge: 'info' },
  complete: { label: 'Complete', color: 'bg-gray-600', badge: 'neutral' },
  delayed: { label: 'Delayed', color: 'bg-alarm-critical', badge: 'danger' },
};

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const mockOrders: ProductionOrder[] = [
  { id: 'PO-001', orderNumber: 'WO-2026-3120', product: 'Ibuprofen 200mg Coated', recipe: 'Tablet Coating', line: 'Oral Solid Dosage', quantity: '500,000 tablets', status: 'complete', dayStart: 0, dayEnd: 1, hourStart: 6, hourEnd: 18, operator: 'ops_johnson', notes: 'Completed ahead of schedule. Yield 99.2%.' },
  { id: 'PO-002', orderNumber: 'WO-2026-3121', product: 'Yoghurt Culture YC-44', recipe: 'Fermentation Batch', line: 'Dairy Processing', quantity: '2,000 L', status: 'running', dayStart: 1, dayEnd: 3, hourStart: 0, hourEnd: 12, operator: 'ops_martinez', notes: 'Currently in Growth Phase. pH holding steady.' },
  { id: 'PO-003', orderNumber: 'WO-2026-3122', product: 'CIP \u2014 Line Cleaning', recipe: 'CIP Cycle', line: 'Beverage Line', quantity: 'N/A', status: 'complete', dayStart: 0, dayEnd: 0, hourStart: 20, hourEnd: 22, operator: 'ops_chen', notes: 'Routine cleaning completed successfully.' },
  { id: 'PO-004', orderNumber: 'WO-2026-3123', product: 'Whole Milk 3.5%', recipe: 'Pasteurization', line: 'Dairy Processing', quantity: '10,000 L', status: 'delayed', dayStart: 2, dayEnd: 3, hourStart: 6, hourEnd: 20, operator: 'ops_patel', notes: 'Delayed due to homogenizer pressure alarm. ETA +4 hrs.' },
  { id: 'PO-005', orderNumber: 'WO-2026-3124', product: 'Granulation Blend GB-12', recipe: 'Mixing Protocol', line: 'Oral Solid Dosage', quantity: '300 kg', status: 'scheduled', dayStart: 3, dayEnd: 3, hourStart: 8, hourEnd: 16, operator: 'ops_johnson', notes: 'Waiting for raw material release from QC.' },
  { id: 'PO-006', orderNumber: 'WO-2026-3125', product: 'Amoxicillin 500mg', recipe: 'Tablet Coating', line: 'Oral Solid Dosage', quantity: '750,000 tablets', status: 'scheduled', dayStart: 4, dayEnd: 5, hourStart: 6, hourEnd: 22, operator: 'ops_johnson', notes: 'Large batch \u2014 extended run time expected.' },
  { id: 'PO-007', orderNumber: 'WO-2026-3126', product: 'Orange Juice Concentrate', recipe: 'Pasteurization', line: 'Beverage Line', quantity: '5,000 L', status: 'scheduled', dayStart: 5, dayEnd: 5, hourStart: 6, hourEnd: 18, operator: 'ops_chen', notes: 'Seasonal product run.' },
  { id: 'PO-008', orderNumber: 'WO-2026-3127', product: 'CIP \u2014 Full Plant', recipe: 'CIP Cycle', line: 'All Lines', quantity: 'N/A', status: 'scheduled', dayStart: 6, dayEnd: 6, hourStart: 0, hourEnd: 8, operator: 'ops_martinez', notes: 'Weekend maintenance CIP for all production lines.' },
];

export default function ProductionSchedulePage() {
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);

  const getOrdersForDay = (dayIdx: number) =>
    mockOrders.filter((o) => dayIdx >= o.dayStart && dayIdx <= o.dayEnd);

  const getBarStyle = (order: ProductionOrder, dayIdx: number) => {
    const isStart = dayIdx === order.dayStart;
    const isEnd = dayIdx === order.dayEnd;
    const startPct = isStart ? (order.hourStart / 24) * 100 : 0;
    const endPct = isEnd ? (order.hourEnd / 24) * 100 : 100;
    return { left: `${startPct}%`, width: `${endPct - startPct}%` };
  };

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Production Schedule</h1>
          <p className="text-sm text-white/50">Week of March 9 \u2014 March 15, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />}>Prev</Button>
          <Button variant="ghost" size="sm" icon={<Calendar size={14} />}>This Week</Button>
          <Button variant="ghost" size="sm" icon={<ChevronRight size={14} />}>Next</Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {(Object.entries(statusConfig) as [OrderStatus, typeof statusConfig[OrderStatus]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={clsx('w-3 h-3 rounded-sm', cfg.color)} />
            <span className="text-xs text-white/60">{cfg.label}</span>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <div className="flex border-b border-scada-border">
            <div className="w-28 flex-shrink-0 border-r border-scada-border" />
            <div className="flex-1 flex">
              {[0, 4, 8, 12, 16, 20].map((hr) => (
                <div key={hr} className="flex-1 text-center text-[10px] text-white/30 py-2 border-r border-scada-border/30">
                  {String(hr).padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {days.map((day, dayIdx) => {
            const dayOrders = getOrdersForDay(dayIdx);
            return (
              <div key={day} className="flex border-b border-scada-border/50 last:border-b-0 min-h-[60px]">
                <div className="w-28 flex-shrink-0 border-r border-scada-border px-3 py-2 flex items-start">
                  <div>
                    <p className="text-sm font-medium text-white/80">{daysShort[dayIdx]}</p>
                    <p className="text-[10px] text-white/30">Mar {9 + dayIdx}</p>
                  </div>
                </div>
                <div className="flex-1 relative py-1.5">
                  {[0, 4, 8, 12, 16, 20].map((hr) => (
                    <div key={hr} className="absolute top-0 bottom-0 border-l border-scada-border/15" style={{ left: `${(hr / 24) * 100}%` }} />
                  ))}
                  {dayOrders.map((order, oIdx) => {
                    const barStyle = getBarStyle(order, dayIdx);
                    const cfg = statusConfig[order.status];
                    return (
                      <div key={order.id} className="absolute h-8 px-0.5" style={{ ...barStyle, top: `${4 + oIdx * 36}px` }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className={clsx('w-full h-full rounded-md text-xs font-medium text-white px-2 truncate text-left transition-all hover:brightness-125 active:scale-[0.98]', cfg.color, order.status === 'delayed' && 'animate-pulse')}
                          title={`${order.product} (${order.orderNumber})`}
                        >
                          {order.product}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Orders', value: mockOrders.length, icon: <Package size={16} /> },
          { label: 'Running', value: mockOrders.filter((o) => o.status === 'running').length, icon: <Clock size={16} /> },
          { label: 'Scheduled', value: mockOrders.filter((o) => o.status === 'scheduled').length, icon: <Calendar size={16} /> },
          { label: 'Delayed', value: mockOrders.filter((o) => o.status === 'delayed').length, icon: <Clock size={16} /> },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-scada-border bg-scada-panel p-4 flex items-center gap-3">
            <div className="text-nexaproc-amber">{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={selectedOrder ? `Order ${selectedOrder.orderNumber}` : ''} size="lg" footer={<Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>Close</Button>}>
        {selectedOrder && (
          <div className="space-y-4">
            <Badge variant={statusConfig[selectedOrder.status].badge} dot>{statusConfig[selectedOrder.status].label}</Badge>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['Product', selectedOrder.product],
                ['Recipe', selectedOrder.recipe],
                ['Production Line', selectedOrder.line],
                ['Quantity', selectedOrder.quantity],
                ['Operator', selectedOrder.operator],
                ['Schedule', `${daysShort[selectedOrder.dayStart]} ${String(selectedOrder.hourStart).padStart(2, '0')}:00 \u2014 ${daysShort[selectedOrder.dayEnd]} ${String(selectedOrder.hourEnd).padStart(2, '0')}:00`],
              ].map(([label, val]) => (
                <div key={label}>
                  <span className="text-white/40 text-xs uppercase tracking-wider">{label}</span>
                  <p className="text-white mt-0.5">{val}</p>
                </div>
              ))}
            </div>
            <div>
              <span className="text-white/40 text-xs uppercase tracking-wider">Notes</span>
              <p className="text-white/70 mt-1 text-sm">{selectedOrder.notes}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
