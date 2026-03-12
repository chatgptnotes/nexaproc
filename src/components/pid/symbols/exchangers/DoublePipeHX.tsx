import React from 'react';

export interface SymbolProps {
  size?: number;
  state?: 'running' | 'stopped' | 'fault' | 'maintenance' | 'standby' | 'offline';
  fillLevel?: number;
  color?: string;
  label?: string;
  animated?: boolean;
  rotation?: number;
  className?: string;
  onClick?: () => void;
}

const STATE_COLORS: Record<string, string> = {
  running: '#4ade80',
  stopped: '#ef4444',
  fault: '#f97316',
  maintenance: '#fbbf24',
  standby: '#38bdf8',
  offline: '#6b7280',
};

/**
 * Double Pipe Heat Exchanger — P&ID Standard
 * Two concentric pipes/circles showing counter-flow arrangement.
 * Inner pipe carries one fluid, annular space carries the other.
 * Shown as a U-tube or hairpin configuration.
 */
const DoublePipeHX: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  fillLevel: _fillLevel = 0,
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const isFault = state === 'fault';
  const isRunning = state === 'running' && animated;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-double-pipe-hx ${isFault ? 'pid-fault-flash' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <style>{`
        .pid-fault-flash { animation: pidFaultFlash 0.5s ease-in-out infinite; }
        @keyframes pidFaultFlash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Outer pipe (top pass) */}
        <line x1={4} y1={16} x2={40} y2={16} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <line x1={4} y1={22} x2={40} y2={22} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />

        {/* Outer pipe (bottom pass) */}
        <line x1={4} y1={26} x2={40} y2={26} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        <line x1={4} y1={32} x2={40} y2={32} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />

        {/* Return bend (right side) — connects top and bottom outer pipes */}
        <path
          d={`M40,16 A 4,5 0 0,1 40,32`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
        />
        <path
          d={`M40,22 A 4,2 0 0,1 40,26`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
        />

        {/* Inner pipe (top pass — centered in outer pipe) */}
        <line x1={2} y1={19} x2={42} y2={19} stroke={stroke} strokeWidth="0.8" />

        {/* Inner pipe (bottom pass) */}
        <line x1={2} y1={29} x2={42} y2={29} stroke={stroke} strokeWidth="0.8" />

        {/* Inner pipe return bend */}
        <path
          d={`M42,19 A 3,5 0 0,1 42,29`}
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
        />

        {/* Left end — tube sheet/flange (top) */}
        <line x1={4} y1={14} x2={4} y2={24} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Left end — tube sheet/flange (bottom) */}
        <line x1={4} y1={24} x2={4} y2={34} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />

        {/* Outer fluid inlet (top left, annulus) */}
        <line x1={0} y1={16} x2={4} y2={16} stroke={stroke} strokeWidth="1.5" />
        <circle cx={1} cy={16} r="1" fill={stroke} />

        {/* Outer fluid outlet (bottom left, annulus) */}
        <line x1={0} y1={32} x2={4} y2={32} stroke={stroke} strokeWidth="1.5" />
        <circle cx={1} cy={32} r="1" fill={stroke} />

        {/* Inner fluid inlet (extend above top pass) */}
        <line x1={10} y1={8} x2={10} y2={16} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={10} cy={8} r="1" fill={stroke} />

        {/* Inner fluid outlet (extend below bottom pass) */}
        <line x1={10} y1={32} x2={10} y2={40} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={10} cy={40} r="1" fill={stroke} />

        {/* Flow arrows */}
        {isRunning && (
          <>
            {/* Outer fluid flow direction */}
            <polygon points="8,15 11,16 8,17" fill={stroke} opacity="0.5">
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
            </polygon>
            {/* Inner fluid flow direction */}
            <polygon points="14,8.5 16,10 14,11.5" fill={stroke} opacity="0.5" transform="rotate(90 15 10)">
              <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          </>
        )}

        {/* Support brackets */}
        <line x1={20} y1={32} x2={20} y2={36} stroke={stroke} strokeWidth="0.8" />
        <line x1={30} y1={32} x2={30} y2={36} stroke={stroke} strokeWidth="0.8" />
        <line x1={18} y1={36} x2={32} y2={36} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="7"
          fontFamily="'Inter', 'Segoe UI', sans-serif"
          fill={stroke}
          fontWeight="600"
        >
          {label}
        </text>
      )}
    </svg>
  );
};

export default DoublePipeHX;
