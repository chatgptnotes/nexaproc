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
 * Air Cooler (Air-Fin Heat Exchanger) — P&ID Standard
 * Fan above finned tube bank. Shows a fan symbol at top with
 * a rectangular tube bundle below with fin indicators.
 */
const AirCooler: React.FC<SymbolProps> = ({
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
      className={`pid-exchanger pid-air-cooler ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        {/* Fan housing (circle at top) */}
        <circle cx={24} cy={12} r={8} fill="none" stroke={stroke} strokeWidth="1.5" />

        {/* Fan blades */}
        <g>
          {isRunning && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 24 12"
              to="360 24 12"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
          {/* 4 fan blades */}
          <path d="M24,12 L24,5 Q26,7 24,12" fill={stroke} opacity="0.6" />
          <path d="M24,12 L31,12 Q29,14 24,12" fill={stroke} opacity="0.6" />
          <path d="M24,12 L24,19 Q22,17 24,12" fill={stroke} opacity="0.6" />
          <path d="M24,12 L17,12 Q19,10 24,12" fill={stroke} opacity="0.6" />
          {/* Hub */}
          <circle cx={24} cy={12} r={1.5} fill={stroke} opacity="0.8" />
        </g>

        {/* Motor indicator */}
        <line x1={24} y1={4} x2={24} y2={1} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <rect x={21} y={0} width={6} height={3} rx={0.5} fill="none" stroke={stroke} strokeWidth="0.8" />

        {/* Tube bundle (rectangular section below fan) */}
        <rect
          x={8}
          y={22}
          width={32}
          height={14}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
          rx={1}
        />

        {/* Tubes inside bundle (horizontal lines) */}
        <line x1={10} y1={26} x2={38} y2={26} stroke={stroke} strokeWidth="0.7" />
        <line x1={10} y1={29} x2={38} y2={29} stroke={stroke} strokeWidth="0.7" />
        <line x1={10} y1={32} x2={38} y2={32} stroke={stroke} strokeWidth="0.7" />

        {/* Fin indicators (short vertical lines on tubes) */}
        {[13, 17, 21, 25, 29, 33].map((x, i) => (
          <g key={i}>
            <line x1={x} y1={24} x2={x} y2={34} stroke={stroke} strokeWidth="0.4" opacity="0.4" />
          </g>
        ))}

        {/* Header box (left) */}
        <rect x={4} y={23} width={4} height={12} rx={0.5} fill="none" stroke={stroke} strokeWidth="1.2" />

        {/* Header box (right) */}
        <rect x={40} y={23} width={4} height={12} rx={0.5} fill="none" stroke={stroke} strokeWidth="1.2" />

        {/* Inlet nozzle (left bottom) */}
        <line x1={0} y1={32} x2={4} y2={32} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={1} cy={32} r="1" fill={stroke} />

        {/* Outlet nozzle (right bottom) */}
        <line x1={44} y1={26} x2={48} y2={26} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={47} cy={26} r="1" fill={stroke} />

        {/* Air flow arrows (downward from fan to bundle) */}
        {isRunning && (
          <>
            {[18, 24, 30].map((x, i) => (
              <polygon key={i} points={`${x - 1},${19} ${x},${21} ${x + 1},${19}`} fill={stroke} opacity="0.4">
                <animate
                  attributeName="opacity"
                  values="0.4;0.1;0.4"
                  dur={`${1 + i * 0.2}s`}
                  repeatCount="indefinite"
                />
              </polygon>
            ))}
          </>
        )}

        {/* Support legs */}
        <line x1={12} y1={36} x2={10} y2={44} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={36} y1={36} x2={38} y2={44} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={8} y1={44} x2={40} y2={44} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
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

export default AirCooler;
