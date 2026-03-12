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
 * Silo — P&ID Standard
 * Tall cylindrical vessel with conical bottom for bulk solids storage.
 * Domed or flat top, conical discharge at bottom.
 */
const Silo: React.FC<SymbolProps> = ({
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

  // Silo dimensions — tall and narrow
  const sL = 14;
  const sR = 34;
  const sW = sR - sL;
  const sTop = 4;
  const coneStart = 36; // Where cone begins
  const coneBot = 44;
  const domeRy = 3;

  // Silo outline path with domed top and conical bottom
  const siloPath = `
    M ${sL},${sTop + domeRy}
    A ${sW / 2},${domeRy} 0 0,1 ${sR},${sTop + domeRy}
    L ${sR},${coneStart}
    L ${24},${coneBot}
    L ${sL},${coneStart}
    Z
  `;

  const totalTop = sTop;
  const totalBot = coneBot;
  const totalH = totalBot - totalTop;
  const fillTop = totalBot - (totalH * level) / 100;

  return (
    <svg
      width={size}
      height={label ? size * 1.33 : size}
      viewBox={label ? '0 0 48 64' : '0 0 48 48'}
      xmlns="http://www.w3.org/2000/svg"
      className={`pid-vessel pid-silo ${isFault ? 'pid-fault-flash' : ''} ${className}`}
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
        <clipPath id={`siloClip-${size}`}>
          <path d={siloPath} />
        </clipPath>
        <pattern id={`siloSolid-${size}`} x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="0.5" fill={stroke} opacity="0.25" />
          <circle cx="4" cy="3.5" r="0.4" fill={stroke} opacity="0.2" />
          <circle cx="2.5" cy="4.5" r="0.3" fill={stroke} opacity="0.2" />
        </pattern>
      </defs>

      <g transform={`rotate(${rotation} 24 24)`}>
        {/* Solids fill */}
        {level > 0 && (
          <g clipPath={`url(#siloClip-${size})`}>
            <rect
              x={sL - 1}
              y={fillTop}
              width={sW + 2}
              height={totalBot - fillTop + 1}
              fill={liquidColor}
            />
            <rect
              x={sL - 1}
              y={fillTop}
              width={sW + 2}
              height={totalBot - fillTop + 1}
              fill={`url(#siloSolid-${size})`}
            />
            {/* Angle of repose surface */}
            {level < 90 && fillTop > sTop + domeRy + 2 && (
              <path
                d={`M${sL + 1},${fillTop + 1} Q${24},${fillTop - 2} ${sR - 1},${fillTop + 1}`}
                fill="none"
                stroke={stroke}
                strokeWidth="0.5"
              />
            )}
          </g>
        )}

        {/* Silo body outline */}
        <path d={siloPath} fill="none" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />

        {/* Dome top arc */}
        <path
          d={`M ${sL},${sTop + domeRy} A ${sW / 2},${domeRy} 0 0,1 ${sR},${sTop + domeRy}`}
          fill="none"
          stroke={stroke}
          strokeWidth="1.8"
        />

        {/* Top fill inlet */}
        <line x1={24} y1={0} x2={24} y2={sTop} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <circle cx={24} cy={1} r="1" fill={stroke} />

        {/* Bottom discharge */}
        <line x1={24} y1={coneBot} x2={24} y2={47} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />

        {/* Rotary valve at discharge */}
        <circle cx={24} cy={46} r="2" fill="none" stroke={stroke} strokeWidth="0.8" />
        <line x1={22.5} y1={46} x2={25.5} y2={46} stroke={stroke} strokeWidth="0.6" />

        {/* Level indicator marks (left side) */}
        {[12, 18, 24, 30].map((y, i) => (
          <line
            key={i}
            x1={sL - 1.5}
            y1={y}
            x2={sL}
            y2={y}
            stroke={stroke}
            strokeWidth="0.6"
          />
        ))}

        {/* Vent on top */}
        <line x1={28} y1={sTop + 1} x2={32} y2={0} stroke={stroke} strokeWidth="0.8" strokeLinecap="round" />

        {/* Support legs */}
        <line x1={sL} y1={coneStart} x2={sL - 3} y2={47} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
        <line x1={sR} y1={coneStart} x2={sR + 3} y2={47} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
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

export default Silo;
