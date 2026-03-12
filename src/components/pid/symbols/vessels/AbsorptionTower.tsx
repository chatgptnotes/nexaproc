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
 * Absorption Tower — P&ID Standard
 * Tall vertical column with random packing shown as scattered fill pattern
 * inside. Gas inlet at bottom, liquid inlet at top (countercurrent flow).
 */
const AbsorptionTower: React.FC<SymbolProps> = ({
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

  const cL = 15;
  const cR = 33;
  const cW = cR - cL;
  const cTop = 4;
  const cBot = 44;
  const headRy = 3;

  const totalBot = cBot + headRy;
  const totalTop = cTop - headRy;
  const totalH = totalBot - totalTop;
  const liquidY = totalBot - (totalH * level) / 100;

  const columnPath = `
    M ${cL},${cTop}
    A ${cW / 2},${headRy} 0 0,1 ${cR},${cTop}
    L ${cR},${cBot}
    A ${cW / 2},${headRy} 0 0,1 ${cL},${cBot}
    Z
  `;

  // Random packing elements (small circles/shapes)
  const packingElements = [
    { x: 19, y: 12 }, { x: 24, y: 10 }, { x: 29, y: 13 },
    { x: 17, y: 17 }, { x: 22, y: 16 }, { x: 27, y: 18 }, { x: 31, y: 15 },
    { x: 19, y: 22 }, { x: 24, y: 21 }, { x: 29, y: 23 },
    { x: 17, y: 27 }, { x: 22, y: 26 }, { x: 27, y: 28 }, { x: 31, y: 25 },
    { x: 19, y: 32 }, { x: 24, y: 31 }, { x: 29, y: 33 },
    { x: 17, y: 37 }, { x: 22, y: 36 }, { x: 27, y: 38 }, { x: 31, y: 35 },
    { x: 19, y: 42 }, { x: 24, y: 41 }, { x: 29, y: 40 },
  ];

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-absorption-tower ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`absClip-${size}`}>
          <path d={columnPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill */}
        {level > 0 && (
          <g clipPath={`url(#absClip-${size})`}>
            <rect
              x={cL - 1}
              y={liquidY}
              width={cW + 2}
              height={totalBot - liquidY + 1}
              fill={liquidColor}
            />
          </g>
        )}

        {/* Column body */}
        <path d={columnPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Random packing fill pattern */}
        <g clipPath={`url(#absClip-${size})`}>
          {packingElements.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="1.2" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.6" />
              {i % 3 === 0 && (
                <line
                  x1={p.x - 1}
                  y1={p.y}
                  x2={p.x + 1}
                  y2={p.y}
                  stroke={stroke}
                  strokeWidth="0.4"
                  opacity="0.5"
                />
              )}
            </g>
          ))}
        </g>

        {/* Liquid distributor at top (horizontal line with drip points) */}
        <line x1={cL + 2} y1={8} x2={cR - 2} y2={8} stroke={stroke} strokeWidth="0.8" />
        <line x1={20} y1={8} x2={20} y2={9.5} stroke={stroke} strokeWidth="0.4" />
        <line x1={24} y1={8} x2={24} y2={9.5} stroke={stroke} strokeWidth="0.4" />
        <line x1={28} y1={8} x2={28} y2={9.5} stroke={stroke} strokeWidth="0.4" />

        {/* Support plate at bottom of packing */}
        <line x1={cL + 1} y1={43} x2={cR - 1} y2={43} stroke={stroke} strokeWidth="0.8" strokeDasharray="1.5,1" />

        {/* Liquid inlet (top left — solvent in) */}
        <line x1={6} y1={7} x2={cL} y2={7} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={6} cy={7} r="1" fill={stroke} />

        {/* Gas inlet (bottom right) */}
        <line x1={cR} y1={42} x2={42} y2={42} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={42} cy={42} r="1" fill={stroke} />

        {/* Gas outlet (top right) */}
        <line x1={cR} y1={5} x2={42} y2={5} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="40,4 42,5 40,6" fill={stroke} />

        {/* Rich solvent outlet (bottom left) */}
        <line x1={6} y1={44} x2={cL} y2={44} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <polygon points="8,43 6,44 8,45" fill={stroke} />

        {/* Gas bubbles animation */}
        {isRunning && (
          <g clipPath={`url(#absClip-${size})`}>
            {[20, 24, 28].map((x, i) => (
              <circle key={`gb-${i}`} cx={x} cy={42} r="0.6" fill={stroke} opacity="0.4">
                <animate
                  attributeName="cy"
                  values="42;6"
                  dur={`${2.5 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;0"
                  dur={`${2.5 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        )}
      </g>

      {label && (
        <text
          x="24"
          y="58"
          textAnchor="middle"
          fontSize="6.5"
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

export default AbsorptionTower;
