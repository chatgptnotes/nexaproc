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

const LIQUID_COLORS: Record<string, string> = {
  running: '#4ade8040',
  stopped: '#ef444440',
  fault: '#f9731640',
  maintenance: '#fbbf2440',
  standby: '#38bdf840',
  offline: '#6b728040',
};

/**
 * Condenser — P&ID Standard
 * Shell & tube variant with vapor inlet (top) and liquid outlet (bottom).
 * Circle with tubes through it, plus distinctive vapor/liquid nozzle arrangement.
 */
const Condenser: React.FC<SymbolProps> = ({
  size = 48,
  state = 'stopped',
  fillLevel = 0,
  color,
  label,
  animated = false,
  rotation = 0,
  className = '',
  onClick,
}) => {
  const stroke = color || STATE_COLORS[state] || STATE_COLORS.offline;
  const liquidColor = color ? `${color}40` : LIQUID_COLORS[state] || LIQUID_COLORS.offline;
  const isFault = state === 'fault';
  const isRunning = state === 'running' && animated;
  const level = Math.max(0, Math.min(100, fillLevel));

  const cx = 24;
  const cy = 22;
  const r = 12;

  // Condensate accumulation at bottom
  const liquidY = cy + r - (2 * r * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-condenser ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
      <defs>
        <clipPath id={`condClip-${size}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Condensate fill inside shell */}
        {level > 0 && (
          <g clipPath={`url(#condClip-${size})`}>
            <rect
              x={cx - r - 1}
              y={liquidY}
              width={2 * r + 2}
              height={cy + r - liquidY + 1}
              fill={liquidColor}
            />
          </g>
        )}

        {/* Shell — main circle */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Tube bundle — two parallel lines */}
        <line x1={cx - r - 3} y1={cy - 3} x2={cx + r + 3} y2={cy - 3} stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
        <line x1={cx - r - 3} y1={cy + 3} x2={cx + r + 3} y2={cy + 3} stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />

        {/* Vapor inlet (top — larger nozzle for vapor) */}
        <line x1={cx} y1={cy - r} x2={cx} y2={2} stroke={stroke} strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={2} r="1.2" fill={stroke} />

        {/* Vapor wiggly lines to indicate phase */}
        {isRunning && (
          <g>
            <path d={`M${cx - 2},${5} Q${cx},${3} ${cx + 2},${5}`} fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.4">
              <animate attributeName="opacity" values="0.4;0.1;0.4" dur="1.5s" repeatCount="indefinite" />
            </path>
          </g>
        )}

        {/* Liquid outlet (bottom — condensate) */}
        <line x1={cx} y1={cy + r} x2={cx} y2={42} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={cx} cy={42} r="1" fill={stroke} />

        {/* Cooling water inlet (left tube side) */}
        <line x1={0} y1={cy - 3} x2={cx - r - 3} y2={cy - 3} stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx={1} cy={cy - 3} r="1" fill={stroke} />

        {/* Cooling water outlet (right tube side) */}
        <line x1={cx + r + 3} y1={cy + 3} x2={48} y2={cy + 3} stroke={stroke} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx={47} cy={cy + 3} r="1" fill={stroke} />

        {/* CW label for cooling water */}
        <text x={3} y={cy - 6} fontSize="3" fill={stroke} fontFamily="'Inter', sans-serif" opacity="0.7">CW</text>

        {/* Condensation animation — droplets falling inside */}
        {isRunning && (
          <g clipPath={`url(#condClip-${size})`}>
            {[20, 24, 28].map((x, i) => (
              <circle key={i} cx={x} cy={cy - 6} r="0.6" fill={stroke} opacity="0.4">
                <animate
                  attributeName="cy"
                  values={`${cy - 6};${cy + r - 2}`}
                  dur={`${1.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0.1"
                  dur={`${1.5 + i * 0.3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}

        {/* Vent on top (non-condensables) */}
        <line x1={cx + 5} y1={cy - r + 1} x2={cx + 10} y2={4} stroke={stroke} strokeWidth="0.8" strokeLinecap="round" />
        <polygon points={`${cx + 9},${5} ${cx + 10},${3} ${cx + 11},${5}`} fill={stroke} opacity="0.6" />

        {/* Support */}
        <line x1={16} y1={cy + r} x2={14} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <line x1={32} y1={cy + r} x2={34} y2={46} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
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

export default Condenser;
