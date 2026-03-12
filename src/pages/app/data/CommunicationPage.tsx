import React, { useState, useMemo, useEffect } from 'react';
import { format, subMinutes, subSeconds } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Network,
  Wifi,
  WifiOff,
  AlertCircle,
  Server,
  Activity,
  ArrowUpDown,
  Clock,
  Cpu,
} from 'lucide-react';
import { Card, Badge } from '@/components/ui';
import KPICard from '@/components/scada/KPICard';

type ConnectionStatus = 'connected' | 'disconnected' | 'error';

interface ConnectionInfo {
  id: string;
  name: string;
  device: string;
  protocol: string;
  ip: string;
  port: number;
  status: ConnectionStatus;
  latencyMs: number;
  packetLoss: number;
  uptime: string;
  lastDataReceived: Date;
  tagCount: number;
}

interface LatencyPoint {
  time: string;
  'PLC-01': number;
  'PLC-02': number;
  'OPC-UA': number;
  'MQTT': number;
}

const STATUS_BADGE: Record<ConnectionStatus, 'success' | 'neutral' | 'danger'> = {
  connected: 'success',
  disconnected: 'neutral',
  error: 'danger',
};

const STATUS_ICON: Record<ConnectionStatus, React.ReactNode> = {
  connected: <Wifi className="w-5 h-5" />,
  disconnected: <WifiOff className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
};

function generateConnections(): ConnectionInfo[] {
  const now = new Date();
  return [
    {
      id: 'plc-01',
      name: 'PLC-01',
      device: 'Siemens S7-1500',
      protocol: 'S7 / ISO-on-TCP',
      ip: '192.168.1.10',
      port: 102,
      status: 'connected',
      latencyMs: 12,
      packetLoss: 0.01,
      uptime: '99.98%',
      lastDataReceived: subSeconds(now, 1),
      tagCount: 256,
    },
    {
      id: 'plc-02',
      name: 'PLC-02',
      device: 'Allen Bradley ControlLogix',
      protocol: 'EtherNet/IP (CIP)',
      ip: '192.168.1.20',
      port: 44818,
      status: 'connected',
      latencyMs: 18,
      packetLoss: 0.05,
      uptime: '99.95%',
      lastDataReceived: subSeconds(now, 2),
      tagCount: 184,
    },
    {
      id: 'opc-ua',
      name: 'OPC-UA Server',
      device: 'Kepware KEPServerEX',
      protocol: 'OPC-UA Binary',
      ip: '192.168.1.50',
      port: 4840,
      status: 'connected',
      latencyMs: 8,
      packetLoss: 0.0,
      uptime: '99.99%',
      lastDataReceived: subSeconds(now, 0),
      tagCount: 512,
    },
    {
      id: 'mqtt',
      name: 'MQTT Broker',
      device: 'Eclipse Mosquitto',
      protocol: 'MQTT v5.0 / TLS',
      ip: '192.168.1.100',
      port: 8883,
      status: 'error',
      latencyMs: 245,
      packetLoss: 3.2,
      uptime: '97.81%',
      lastDataReceived: subMinutes(now, 5),
      tagCount: 96,
    },
  ];
}

function generateLatencyHistory(): LatencyPoint[] {
  const points: LatencyPoint[] = [];
  const now = new Date();
  for (let i = 59; i >= 0; i--) {
    const t = subMinutes(now, i);
    points.push({
      time: format(t, 'HH:mm'),
      'PLC-01': Math.round(10 + Math.random() * 8),
      'PLC-02': Math.round(15 + Math.random() * 10),
      'OPC-UA': Math.round(5 + Math.random() * 6),
      'MQTT': i < 5
        ? Math.round(200 + Math.random() * 100)
        : Math.round(20 + Math.random() * 15),
    });
  }
  return points;
}

export default function CommunicationPage() {
  const [connections] = useState<ConnectionInfo[]>(generateConnections);
  const [latencyHistory] = useState<LatencyPoint[]>(generateLatencyHistory);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const networkStats = useMemo(() => {
    const connected = connections.filter((c) => c.status === 'connected').length;
    const avgLatency = connections.reduce((s, c) => s + c.latencyMs, 0) / connections.length;
    const totalTags = connections.reduce((s, c) => s + c.tagCount, 0);
    const avgPacketLoss = connections.reduce((s, c) => s + c.packetLoss, 0) / connections.length;
    return {
      connected,
      total: connections.length,
      avgLatency: Math.round(avgLatency * 10) / 10,
      totalTags,
      avgPacketLoss: Math.round(avgPacketLoss * 100) / 100,
    };
  }, [connections]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Network className="w-7 h-7 text-nexaproc-amber" />
            Communication Status
          </h1>
          <p className="mt-1 text-sm text-white/50">
            PLC, OPC, and gateway connection health monitoring
          </p>
        </div>
        <div className="text-xs text-white/40 font-mono flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {format(now, 'yyyy-MM-dd HH:mm:ss')}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Connections Online"
          value={`${networkStats.connected}/${networkStats.total}`}
          trend={networkStats.connected === networkStats.total ? 'flat' : 'down'}
          trendValue={networkStats.connected === networkStats.total ? 0 : 25}
          icon={<Server className="w-5 h-5" />}
          color={networkStats.connected === networkStats.total ? '#4ade80' : '#f97316'}
        />
        <KPICard
          title="Avg Latency"
          value={networkStats.avgLatency}
          unit="ms"
          trend={networkStats.avgLatency < 50 ? 'down' : 'up'}
          trendValue={networkStats.avgLatency < 50 ? 3.2 : 18.5}
          icon={<Activity className="w-5 h-5" />}
          color="#38bdf8"
        />
        <KPICard
          title="Total Tags"
          value={networkStats.totalTags}
          unit="tags"
          trend="flat"
          trendValue={0}
          icon={<Cpu className="w-5 h-5" />}
          color="#a78bfa"
        />
        <KPICard
          title="Avg Packet Loss"
          value={networkStats.avgPacketLoss}
          unit="%"
          trend={networkStats.avgPacketLoss < 1 ? 'down' : 'up'}
          trendValue={networkStats.avgPacketLoss < 1 ? 0.5 : 2.1}
          icon={<ArrowUpDown className="w-5 h-5" />}
          color={networkStats.avgPacketLoss < 1 ? '#4ade80' : '#ef4444'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((conn) => (
          <Card key={conn.id} className="relative overflow-hidden">
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${
                conn.status === 'connected'
                  ? 'bg-status-running'
                  : conn.status === 'error'
                    ? 'bg-status-fault'
                    : 'bg-status-stopped'
              }`}
            />

            <div className="pl-3">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      conn.status === 'connected'
                        ? 'bg-status-running/15 text-status-running'
                        : conn.status === 'error'
                          ? 'bg-status-fault/15 text-status-fault'
                          : 'bg-status-stopped/15 text-status-stopped'
                    }`}
                  >
                    {STATUS_ICON[conn.status]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{conn.name}</h3>
                    <p className="text-xs text-white/50">{conn.device}</p>
                  </div>
                </div>
                <Badge variant={STATUS_BADGE[conn.status]} dot pulse={conn.status === 'error'}>
                  {conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Protocol</span>
                  <p className="text-white/80 font-medium mt-0.5">{conn.protocol}</p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Address</span>
                  <p className="text-white/80 font-mono mt-0.5">{conn.ip}:{conn.port}</p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Latency</span>
                  <p className={`font-mono font-bold mt-0.5 ${
                    conn.latencyMs < 50 ? 'text-status-running' : conn.latencyMs < 200 ? 'text-status-warning' : 'text-status-fault'
                  }`}>
                    {conn.latencyMs} ms
                  </p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Packet Loss</span>
                  <p className={`font-mono font-bold mt-0.5 ${
                    conn.packetLoss < 1 ? 'text-status-running' : conn.packetLoss < 5 ? 'text-status-warning' : 'text-status-fault'
                  }`}>
                    {conn.packetLoss}%
                  </p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Uptime</span>
                  <p className="text-white/80 font-mono font-bold mt-0.5">{conn.uptime}</p>
                </div>
                <div>
                  <span className="text-white/40 uppercase tracking-wider">Tag Count</span>
                  <p className="text-white/80 font-mono font-bold mt-0.5">{conn.tagCount}</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-scada-border/50 flex items-center justify-between">
                <span className="text-xs text-white/40">Last data received</span>
                <span className="text-xs font-mono text-white/60">
                  {format(conn.lastDataReceived, 'yyyy-MM-dd HH:mm:ss')}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Communication Latency" subtitle="Last 60 minutes">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={latencyHistory} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(74,222,128,0.08)" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                stroke="#374151"
                interval={9}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 11 }}
                stroke="#374151"
                width={40}
                label={{ value: 'ms', angle: -90, position: 'insideLeft', style: { fill: '#6b7280', fontSize: 11 } }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1a12',
                  border: '1px solid rgba(74,222,128,0.28)',
                  borderRadius: 8,
                  fontSize: 12,
                  color: '#e5e7eb',
                }}
              />
              <Line type="monotone" dataKey="PLC-01" stroke="#fbbf24" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="PLC-02" stroke="#4ade80" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="OPC-UA" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="MQTT" stroke="#ef4444" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3">
          {[
            { label: 'PLC-01', color: '#fbbf24' },
            { label: 'PLC-02', color: '#4ade80' },
            { label: 'OPC-UA', color: '#38bdf8' },
            { label: 'MQTT', color: '#ef4444' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-white/50">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
