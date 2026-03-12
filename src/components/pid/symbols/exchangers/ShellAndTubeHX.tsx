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
 * Shell and Tube Heat Exchanger — ISA 5.1 Standard
 * The most common HX symbol: circle (shell) with two parallel horizontal
 * lines through it (tube bundle). Shell-side and tube-side nozzles shown.
 */
const ShellAndTubeHX: React.FC<SymbolProps> = ({
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

  const cx = 24;
  const cy = 24;
  const r = 13;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-exchanger pid-shell-tube-hx ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        {/* Shell — main circle */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
        />

        {/* Tube bundle — two parallel horizontal lines */}
        <line
          x1={cx - r - 4}
          y1={cy - 3}
          x2={cx + r + 4}
          y2={cy - 3}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1={cx - r - 4}
          y1={cy + 3}
          x2={cx + r + 4}
          y2={cy + 3}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Tube-side inlet (left) */}
        <line x1={0} y1={cy - 3} x2={cx - r - 4} y2={cy - 3} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={1} cy={cy - 3} r="1" fill={stroke} />

        {/* Tube-side outlet (right) */}
        <line x1={cx + r + 4} y1={cy + 3} x2={48} y2={cy + 3} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={47} cy={cy + 3} r="1" fill={stroke} />

        {/* Shell-side inlet (top) */}
        <line x1={cx} y1={cy - r} x2={cx} y2={4} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={cx} cy={4} r="1" fill={stroke} />

        {/* Shell-side outlet (bottom) */}
        <line x1={cx} y1={cy + r} x2={cx} y2={44} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={cx} cy={44} r="1" fill={stroke} />

        {/* Flow indication arrows when running */}
        {isRunning && (
          <>
            {/* Tube-side flow arrow */}
            <polygon points="6,19 9,21 6,23" fill={stroke} opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </polygon>
            {/* Shell-side flow arrow */}
            <polygon points="23,8 24,5 25,8" fill={stroke} opacity="0.6">
              <animate
                attributeName="opacity"
                values="0.6;0.2;0.6"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </polygon>
          </>
        )}
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

export default ShellAndTubeHX;
