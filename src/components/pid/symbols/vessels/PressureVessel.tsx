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
 * Pressure Vessel — ISA 5.1
 * Vertical vessel with elliptical (dished) heads on both ends.
 * Represented as a rounded rectangle with elliptical caps top and bottom.
 */
const PressureVessel: React.FC<SymbolProps> = ({
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

  // Vessel body dimensions (vertical orientation)
  const vesselLeft = 12;
  const vesselRight = 36;
  const vesselWidth = vesselRight - vesselLeft;
  const bodyTop = 10;
  const bodyBottom = 38;
  const bodyHeight = bodyBottom - bodyTop;
  const headRx = vesselWidth / 2;
  const headRy = 4;

  // Total internal height including dished heads
  const totalInternalTop = bodyTop - headRy;
  const totalInternalBottom = bodyBottom + headRy;
  const totalInternalHeight = totalInternalBottom - totalInternalTop;
  const liquidY = totalInternalBottom - (totalInternalHeight * level) / 100;

  // Vessel outline path: elliptical top + straight sides + elliptical bottom
  const vesselPath = `
    M ${vesselLeft},${bodyTop}
    A ${headRx},${headRy} 0 0,1 ${vesselRight},${bodyTop}
    L ${vesselRight},${bodyBottom}
    A ${headRx},${headRy} 0 0,1 ${vesselLeft},${bodyBottom}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-pressure-vessel ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`pvClip-${size}`}>
          <path d={vesselPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill inside vessel */}
        {level > 0 && (
          <g clipPath={`url(#pvClip-${size})`}>
            <rect
              x={vesselLeft - 1}
              y={liquidY}
              width={vesselWidth + 2}
              height={totalInternalBottom - liquidY + 1}
              fill={liquidColor}
            />
            {isRunning ? (
              <path
                d={`M${vesselLeft},${liquidY} Q${24 - 3},${liquidY - 1.2} 24,${liquidY} Q${24 + 3},${liquidY + 1.2} ${vesselRight},${liquidY}`}
                stroke={stroke}
                strokeWidth="0.7"
                fill="none"
              >
                <animate
                  attributeName="d"
                  values={`M${vesselLeft},${liquidY} Q${24 - 3},${liquidY - 1.2} 24,${liquidY} Q${24 + 3},${liquidY + 1.2} ${vesselRight},${liquidY};M${vesselLeft},${liquidY} Q${24 - 3},${liquidY + 1.2} 24,${liquidY} Q${24 + 3},${liquidY - 1.2} ${vesselRight},${liquidY};M${vesselLeft},${liquidY} Q${24 - 3},${liquidY - 1.2} 24,${liquidY} Q${24 + 3},${liquidY + 1.2} ${vesselRight},${liquidY}`}
                  dur="3s"
                  repeatCount="indefinite"
                />
              </path>
            ) : (
              <line x1={vesselLeft} y1={liquidY} x2={vesselRight} y2={liquidY} stroke={stroke} strokeWidth="0.7" />
            )}
          </g>
        )}

        {/* Vessel body outline */}
        <path d={vesselPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Pressure relief valve nozzle (top) */}
        <line x1={24} y1={bodyTop - headRy} x2={24} y2={2} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="22,2 24,0 26,2" fill={stroke} />

        {/* Inlet nozzle (left side) */}
        <line x1={4} y1={18} x2={vesselLeft} y2={18} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={4} cy={18} r="1" fill={stroke} />

        {/* Outlet nozzle (right side bottom) */}
        <line x1={vesselRight} y1={34} x2={44} y2={34} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={44} cy={34} r="1" fill={stroke} />

        {/* Drain nozzle (bottom) */}
        <line x1={24} y1={bodyBottom + headRy} x2={24} y2={46} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Support saddles */}
        <rect x={vesselLeft - 1} y={43} width={4} height={2} rx={0.5} fill={stroke} />
        <rect x={vesselRight - 3} y={43} width={4} height={2} rx={0.5} fill={stroke} />
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

export default PressureVessel;
