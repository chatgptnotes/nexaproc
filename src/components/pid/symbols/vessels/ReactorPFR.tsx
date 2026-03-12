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
 * Reactor (PFR) — Plug Flow Reactor
 * Horizontal tube with internal baffles showing plug flow direction.
 * Dished heads on both ends (elliptical caps).
 */
const ReactorPFR: React.FC<SymbolProps> = ({
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

  // Horizontal tube dimensions
  const tubeTop = 16;
  const tubeBot = 32;
  const tubeH = tubeBot - tubeTop;
  const bodyLeft = 8;
  const bodyRight = 40;
  const headRx = 4;
  const headRy = tubeH / 2;

  const totalLeft = bodyLeft - headRx;
  const totalRight = bodyRight + headRx;
  const totalW = totalRight - totalLeft;
  const liquidX = totalLeft + (totalW * level) / 100;

  // Vessel outline: horizontal with elliptical heads
  const vesselPath = `
    M ${bodyLeft},${tubeTop}
    A ${headRx},${headRy} 0 0,0 ${bodyLeft},${tubeBot}
    L ${bodyRight},${tubeBot}
    A ${headRx},${headRy} 0 0,0 ${bodyRight},${tubeTop}
    Z
  `;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-reactor-pfr ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`pfrClip-${size}`}>
          <path d={vesselPath} />
        </clipPath>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Liquid fill (fills left-to-right for horizontal PFR) */}
        {level > 0 && (
          <g clipPath={`url(#pfrClip-${size})`}>
            <rect
              x={totalLeft}
              y={tubeTop - 1}
              width={liquidX - totalLeft}
              height={tubeH + 2}
              fill={liquidColor}
            />
          </g>
        )}

        {/* Vessel body outline */}
        <path d={vesselPath} fill="none" stroke={stroke} strokeWidth="1.8" />

        {/* Internal baffles */}
        {[14, 20, 26, 32].map((x, i) => (
          <line
            key={i}
            x1={x}
            y1={i % 2 === 0 ? tubeTop + 2 : tubeTop + tubeH / 2}
            x2={x}
            y2={i % 2 === 0 ? tubeTop + tubeH / 2 : tubeBot - 2}
            stroke={stroke}
            strokeWidth="1"
            strokeLinecap="round"
          />
        ))}

        {/* Flow direction arrows */}
        {isRunning && (
          <g>
            <path d="M18,24 L22,24" stroke={stroke} strokeWidth="0.8" fill="none" markerEnd="url(#pfrArrow)" />
            <path d="M28,24 L32,24" stroke={stroke} strokeWidth="0.8" fill="none" markerEnd="url(#pfrArrow)" />
            <defs>
              <marker id="pfrArrow" markerWidth="4" markerHeight="3" refX="4" refY="1.5" orient="auto">
                <polygon points="0,0 4,1.5 0,3" fill={stroke} />
              </marker>
            </defs>
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0;2,0;0,0"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </g>
        )}

        {/* Inlet nozzle (left) */}
        <line x1={0} y1={24} x2={bodyLeft - headRx} y2={24} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={1} cy={24} r="1" fill={stroke} />

        {/* Outlet nozzle (right) */}
        <line x1={bodyRight + headRx} y1={24} x2={48} y2={24} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <circle cx={47} cy={24} r="1" fill={stroke} />

        {/* Top nozzle (thermowell) */}
        <line x1={24} y1={tubeTop} x2={24} y2={10} stroke={stroke} strokeWidth="1" strokeLinecap="round" />
        <circle cx={24} cy={10} r="1.2" fill="none" stroke={stroke} strokeWidth="0.8" />

        {/* Support saddles */}
        <path d={`M14,${tubeBot} L12,${tubeBot + 4} L16,${tubeBot + 4} Z`} fill="none" stroke={stroke} strokeWidth="1" />
        <path d={`M34,${tubeBot} L32,${tubeBot + 4} L36,${tubeBot + 4} Z`} fill="none" stroke={stroke} strokeWidth="1" />
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

export default ReactorPFR;
