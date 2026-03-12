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
 * Hopper — P&ID Standard
 * Cone-bottom container (V-shaped bottom) for solids handling.
 * Rectangular upper section with tapered conical discharge at bottom.
 */
const Hopper: React.FC<SymbolProps> = ({
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
  const level = Math.max(0, Math.min(100, fillLevel));

  // Hopper dimensions
  const hL = 10;
  const hR = 38;
  const hTop = 6;
  const hMid = 28; // Where cone starts
  const hBot = 42; // Cone tip
  const coneCenter = 24;

  // Hopper outline path
  const hopperPath = `
    M ${hL},${hTop}
    L ${hR},${hTop}
    L ${hR},${hMid}
    L ${coneCenter},${hBot}
    L ${hL},${hMid}
    Z
  `;

  // Calculate fill based on level
  const totalH = hBot - hTop;
  const fillTop = hBot - (totalH * level) / 100;

  // For solids, show granular fill pattern (dotted area)
  const solidsFill = level > 0;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-hopper ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`hopperClip-${size}`}>
          <path d={hopperPath} />
        </clipPath>
        {/* Granular fill pattern for solids */}
        <pattern id={`solidPattern-${size}`} x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill={stroke} opacity="0.3" />
          <circle cx="4" cy="3" r="0.5" fill={stroke} opacity="0.25" />
          <circle cx="2" cy="5" r="0.4" fill={stroke} opacity="0.2" />
          <circle cx="5" cy="1" r="0.5" fill={stroke} opacity="0.25" />
        </pattern>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Solids fill */}
        {solidsFill && (
          <g clipPath={`url(#hopperClip-${size})`}>
            <rect
              x={hL - 1}
              y={fillTop}
              width={hR - hL + 2}
              height={hBot - fillTop + 1}
              fill={liquidColor}
            />
            <rect
              x={hL - 1}
              y={fillTop}
              width={hR - hL + 2}
              height={hBot - fillTop + 1}
              fill={`url(#solidPattern-${size})`}
            />
            {/* Solids surface (angle of repose) */}
            {level < 95 && (
              <path
                d={`M${Math.max(hL, coneCenter - ((hBot - fillTop) / (hBot - hMid)) * (coneCenter - hL))},${fillTop} L${24},${fillTop - 2} L${Math.min(hR, coneCenter + ((hBot - fillTop) / (hBot - hMid)) * (hR - coneCenter))},${fillTop}`}
                fill={liquidColor}
                stroke={stroke}
                strokeWidth="0.5"
              />
            )}
          </g>
        )}

        {/* Hopper body outline */}
        <path d={hopperPath} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />

        {/* Open top indicator */}
        <line x1={hL - 2} y1={hTop} x2={hR + 2} y2={hTop} stroke={stroke} strokeWidth="2" strokeLinecap="round" />

        {/* Discharge opening at cone bottom */}
        <line x1={22} y1={hBot} x2={26} y2={hBot} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        <line x1={24} y1={hBot} x2={24} y2={46} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Slide gate at discharge */}
        <rect x={21} y={44} width={6} height={2} rx={0.5} fill="none" stroke={stroke} strokeWidth="1" />

        {/* Support structure */}
        <line x1={hL} y1={hMid} x2={hL - 3} y2={46} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={hR} y1={hMid} x2={hR + 3} y2={46} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />

        {/* Level sight glass (left side) */}
        <line x1={hL - 1} y1={hTop + 4} x2={hL - 1} y2={hMid - 2} stroke={stroke} strokeWidth="0.5" strokeDasharray="1,1" />
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

export default Hopper;
